import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listForms } from '../../api/forms';
import type { FormSummary } from '../../api/types';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { buttonClass } from '../../components/buttonClass';
import { CopyLinkButton } from '../../components/CopyLinkButton';
import { PlusIcon, SearchIcon } from '../../components/icons';
import { formatDate, formShareUrl, normalize, plural } from '../../lib/format';
import styles from './Formularios.module.css';

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; forms: FormSummary[] };

export default function Formularios() {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [query, setQuery] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    listForms()
      .then((forms) => active && setState({ status: 'ready', forms }))
      .catch(() => active && setState({ status: 'error' }));

    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = () => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  };

  // Busca local por título ou username do criador (ignora acentos e maiúsculas).
  const visible = useMemo(() => {
    if (state.status !== 'ready') return [];
    const q = normalize(query.trim().replace(/^@/, ''));
    if (!q) return state.forms;
    return state.forms.filter(
      (f) => normalize(f.title).includes(q) || normalize(f.author.username).includes(q),
    );
  }, [state, query]);

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Formulários</h1>
        </div>
        <Link to="/formularios/novo" className={buttonClass()}>
          <PlusIcon />
          Novo formulário
        </Link>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <label htmlFor="busca" className="visually-hidden">
            Buscar formulários
          </label>
          <SearchIcon className={styles.searchIcon} />
          <input
            id="busca"
            type="search"
            placeholder="Buscar por título ou criador"
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {state.status === 'ready' && (
          <span className={styles.count} aria-live="polite">
            {plural(visible.length, 'formulário', 'formulários')}
          </span>
        )}
      </div>

      {state.status === 'error' ? (
        <div className={styles.errorBox}>
          <Alert>Não foi possível carregar os formulários.</Alert>
          <Button variant="secondary" onClick={retry}>
            Tentar novamente
          </Button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <div className={styles.table} role="table" aria-label="Formulários" aria-busy={state.status === 'loading'}>
            <div className={`${styles.row} ${styles.head}`} role="row">
              <span role="columnheader">Formulário</span>
              <span role="columnheader">Criado por</span>
              <span role="columnheader">Perguntas</span>
              <span role="columnheader">Respostas</span>
              <span role="columnheader" className={styles.actionsHead}>
                Ações
              </span>
            </div>

            {state.status === 'loading' && <SkeletonRows />}

            {state.status === 'ready' &&
              visible.map((form) => (
                <div key={form.id} className={styles.row} role="row">
                  <div role="cell" className={styles.formCell}>
                    <Link to={`/formularios/${form.id}`} className={styles.formTitle}>
                      {form.title}
                    </Link>
                    <span className={styles.meta}>Criado em {formatDate(form.createdAt)}</span>
                  </div>
                  <span role="cell" className={`${styles.muted} ${styles.stat}`} data-label="Criado por">
                    @{form.author.username}
                  </span>
                  <span role="cell" className={styles.stat} data-label="Perguntas">
                    {form.questions}
                  </span>
                  <span role="cell" className={styles.stat} data-label="Respostas">
                    {form.responses}
                  </span>
                  <div role="cell" className={styles.actions}>
                    {form.published ? (
                      <CopyLinkButton
                        url={formShareUrl(form.slug)}
                        className={styles.linkButton}
                        aria-label={`Copiar link do formulário ${form.title}`}
                      />
                    ) : (
                      <span className={styles.muted} title="Este formulário não recebe respostas">
                        Não publicado
                      </span>
                    )}
                    <Link to={`/formularios/${form.id}`} className={styles.viewButton}>
                      Ver respostas
                    </Link>
                  </div>
                </div>
              ))}

            {state.status === 'ready' && visible.length === 0 && (
              <div className={styles.empty}>
                {state.forms.length === 0 ? (
                  <>
                    <p className={styles.emptyTitle}>Nenhum formulário ainda</p>
                    <p className={styles.muted}>Crie o primeiro e compartilhe o link para receber respostas.</p>
                    <Link to="/formularios/novo" className={buttonClass({ variant: 'soft' })}>
                      <PlusIcon />
                      Novo formulário
                    </Link>
                  </>
                ) : (
                  <>
                    <p className={styles.emptyTitle}>Nenhum formulário encontrado</p>
                    <p className={styles.muted}>Nada corresponde a “{query.trim()}”.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function SkeletonRows() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} className={styles.row} aria-hidden="true">
          <div className={styles.formCell}>
            <span className={styles.skeleton} style={{ width: '70%' }} />
            <span className={styles.skeleton} style={{ width: '40%', height: 10 }} />
          </div>
          <span className={styles.skeleton} style={{ width: '60%' }} />
          <span className={styles.skeleton} style={{ width: 24 }} />
          <span className={styles.skeleton} style={{ width: 24 }} />
          <span />
        </div>
      ))}
    </>
  );
}
