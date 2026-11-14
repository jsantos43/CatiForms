import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getForm } from '../../api/forms';
import { Alert } from '../../components/Alert';
import { buttonClass } from '../../components/buttonClass';
import { CheckIcon, CopyIcon } from '../../components/icons';
import { copyText } from '../../lib/clipboard';
import { formSharePath, formShareUrl } from '../../lib/format';
import styles from './Publicado.module.css';

export default function Publicado() {
  const { id = '' } = useParams();
  const location = useLocation();
  const fromState = location.state as { title?: string; slug?: string } | null;

  // Título e slug vêm da tela de criação; se a página for aberta direto, busca na API.
  const [form, setForm] = useState<{ title: string; slug: string; published: boolean } | null>(
    fromState?.title && fromState.slug
      ? { title: fromState.title, slug: fromState.slug, published: true }
      : null,
  );
  const [notFound, setNotFound] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const hasForm = form !== null;
  const url = form ? formShareUrl(form.slug) : '';

  useEffect(() => {
    if (hasForm) return;
    let active = true;
    getForm(id)
      .then((f) => active && setForm({ title: f.title, slug: f.slug, published: f.published }))
      .catch(() => active && setNotFound(true));
    return () => {
      active = false;
    };
  }, [id, hasForm]);

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

  if (!form) {
    return (
      <p className={styles.text} role="status">
        Carregando formulário…
      </p>
    );
  }

  // Sobra de uma publicação interrompida: o link ainda não aceita respostas.
  if (!form.published) {
    return (
      <div className={styles.page}>
        <Alert>
          “{form.title}” não foi publicado, então o link ainda não aceita respostas. Crie o formulário
          novamente para publicá-lo.
        </Alert>
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
          Qualquer pessoa com o link pode responder.
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
          href={formSharePath(form.slug)}
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
