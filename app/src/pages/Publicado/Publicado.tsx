import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getForm } from '../../api/forms';
import { Alert } from '../../components/Alert';
import { buttonClass } from '../../components/buttonClass';
import { CheckIcon, CopyIcon } from '../../components/icons';
import { copyText } from '../../lib/clipboard';
import { formShareUrl } from '../../lib/format';
import styles from './Publicado.module.css';

export default function Publicado() {
  const { id = '' } = useParams();
  const location = useLocation();
  const stateTitle = (location.state as { title?: string } | null)?.title;

  // O título vem da tela de criação; se a página for aberta direto, busca na API.
  const [title, setTitle] = useState<string | null>(stateTitle ?? null);
  const [notFound, setNotFound] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const url = formShareUrl(id);

  useEffect(() => {
    if (stateTitle) return;
    let active = true;
    getForm(id)
      .then((form) => active && setTitle(form.title))
      .catch(() => active && setNotFound(true));
    return () => {
      active = false;
    };
  }, [id, stateTitle]);

  const handleCopy = async () => {
    const ok = await copyText(url);
    setCopyStatus(ok ? 'copied' : 'failed');
    if (!ok) inputRef.current?.select();
  };

  if (notFound) {
    return (
      <div className={styles.page}>
        <Alert>Não encontramos este formulário.</Alert>
        <Link to="/formularios" className={buttonClass({ variant: 'secondary' })}>
          Voltar para formulários
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.badge}>
        <CheckIcon size={30} />
      </div>

      <div>
        <h1 className={styles.title}>Formulário publicado</h1>
        <p className={styles.text}>
          {title ? `“${title}”` : 'O formulário'} já pode receber respostas. Qualquer pessoa com o link
          pode responder, sem precisar de cadastro.
        </p>
      </div>

      <div className={styles.card}>
        <label htmlFor="share-link" className={styles.label}>
          Link de acesso
        </label>
        <div className={styles.copyRow}>
          <input
            ref={inputRef}
            id="share-link"
            type="text"
            readOnly
            className={styles.linkInput}
            value={url}
            onFocus={(e) => e.target.select()}
          />
          <button type="button" className={buttonClass({ size: 'lg' })} onClick={handleCopy}>
            <CopyIcon />
            Copiar link
          </button>
        </div>
        <span className={styles.status} role="status">
          {copyStatus === 'copied' && 'Link copiado para a área de transferência.'}
          {copyStatus === 'failed' && (
            <span className={styles.statusError}>
              Não foi possível copiar automaticamente. O link está selecionado: use Ctrl+C.
            </span>
          )}
        </span>
      </div>

      <div className={styles.actions}>
        <a
          href={`/f/${id}`}
          target="_blank"
          rel="noreferrer"
          className={buttonClass({ variant: 'secondary' })}
        >
          Abrir formulário
        </a>
        <Link to={`/formularios/${id}`} className={buttonClass({ variant: 'soft' })}>
          Ver respostas
        </Link>
        <Link to="/formularios" className={styles.backLink}>
          Voltar para formulários
        </Link>
      </div>
    </div>
  );
}
