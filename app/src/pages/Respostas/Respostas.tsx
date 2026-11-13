import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiError } from '../../api/client';
import { getForm } from '../../api/forms';
import { listResponses } from '../../api/responses';
import type { FormDetail } from '../../api/types';
import { Alert } from '../../components/Alert';
import { BackLink } from '../../components/BackLink';
import { Button } from '../../components/Button';
import { buttonClass } from '../../components/buttonClass';
import { CopyLinkButton } from '../../components/CopyLinkButton';
import { ArrowLeftIcon, ChevronRightIcon, DownloadIcon } from '../../components/icons';
import { formatDate, formatShortDateTime, formShareUrl, plural } from '../../lib/format';
import { ByQuestion } from './ByQuestion';
import { buildCsv, downloadFile, numberResponses, slug, type NumberedResponse } from './model';
import { ResponseDetail } from './ResponseDetail';
import styles from './Respostas.module.css';

const PAGE_SIZE = 6;

type FormState = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; form: FormDetail };

type ResponsesState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; responses: NumberedResponse[] };

type Tab = 'individual' | 'question';

export default function Respostas() {
  const { id = '' } = useParams();
  const [formState, setFormState] = useState<FormState>({ status: 'loading' });
  const [respState, setRespState] = useState<ResponsesState>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    getForm(id)
      .then((form) => active && setFormState({ status: 'ready', form }))
      .catch((err) => {
        if (!active) return;
        const notFound = err instanceof ApiError && (err.status === 404 || err.status === 400);
        setFormState({
          status: 'error',
          message: notFound ? 'Formulário não encontrado.' : 'Não foi possível carregar este formulário.',
        });
      });

    listResponses(id)
      .then((list) => active && setRespState({ status: 'ready', responses: numberResponses(list) }))
      .catch(() => active && setRespState({ status: 'error' }));

    return () => {
      active = false;
    };
  }, [id]);

  if (formState.status === 'loading') {
    return (
      <p className={styles.muted} role="status">
        Carregando formulário…
      </p>
    );
  }

  if (formState.status === 'error') {
    return (
      <>
        <BackLink to="/formularios">Voltar para formulários</BackLink>
        <Alert>{formState.message}</Alert>
      </>
    );
  }

  return <FormResponses form={formState.form} respState={respState} />;
}

function FormResponses({ form, respState }: { form: FormDetail; respState: ResponsesState }) {
  const [tab, setTab] = useState<Tab>('individual');
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const responses = useMemo(
    () => (respState.status === 'ready' ? respState.responses : []),
    [respState],
  );
  const count = responses.length;
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const pageItems = responses.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const selected = responses.find((r) => r.id === selectedId) ?? responses[0];

  useEffect(() => {
    document.title = `${form.title} · Respostas · Cati Forms`;
    return () => {
      document.title = 'Cati Forms';
    };
  }, [form.title]);

  const exportCsv = () =>
    downloadFile(buildCsv(form, responses), `${slug(form.title)}-respostas.csv`, 'text/csv;charset=utf-8');

  // O PDF sai da caixa de impressão do navegador ("Salvar como PDF"), usando a
  // versão para impressão com todas as respostas (estilos em @media print).
  const exportPdf = () => {
    const previous = document.title;
    document.title = `${slug(form.title)}-respostas`; // vira o nome sugerido do arquivo
    window.addEventListener('afterprint', () => (document.title = previous), { once: true });
    window.print();
  };

  const goToPage = (p: number) => {
    setPage(p);
    setSelectedId(responses[p * PAGE_SIZE]?.id ?? null);
  };

  // Setas esquerda/direita trocam de aba (padrão WAI-ARIA de tabs).
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next: Tab = tab === 'individual' ? 'question' : 'individual';
    setTab(next);
    document.getElementById(`tab-${next}`)?.focus();
  };

  const hasResponses = count > 0;

  return (
    <>
      <div className="no-print">
        <BackLink to="/formularios">Voltar para formulários</BackLink>
      </div>

      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{form.title}</h1>
          {form.description && <p className={styles.description}>{form.description}</p>}
          <div className={styles.meta}>
            <span>
              Criado por <strong>@{form.author.username}</strong> em {formatDate(form.createdAt)}
            </span>
            <span aria-hidden="true">·</span>
            <span className={`${styles.pill} ${styles.pillBlue}`}>
              {plural(form.questions.length, 'pergunta', 'perguntas')}
            </span>
            {form.collectEmail && <span className={`${styles.pill} ${styles.pillGreen}`}>Pede e-mail</span>}
          </div>
        </div>
        <div className={`${styles.headerActions} no-print`}>
          {form.published && (
            <CopyLinkButton
              url={formShareUrl(form.slug)}
              label="Copiar link"
              copiedLabel="Link copiado"
              iconSize={18}
              className={buttonClass({ variant: 'secondary' })}
            />
          )}
          <Button variant="secondary" className={styles.outlineBlue} onClick={exportCsv} disabled={!hasResponses}>
            <DownloadIcon />
            Exportar CSV
          </Button>
          <Button onClick={exportPdf} disabled={!hasResponses}>
            <DownloadIcon />
            Exportar PDF
          </Button>
        </div>
      </div>

      {respState.status === 'loading' && (
        <p className={styles.muted} role="status">
          Carregando respostas…
        </p>
      )}

      {respState.status === 'error' && <Alert>Não foi possível carregar as respostas.</Alert>}

      {respState.status === 'ready' && !hasResponses && (
        <div className={styles.empty}>
          {form.published ? (
            <>
              <p className={styles.emptyTitle}>Nenhuma resposta ainda</p>
              <p className={styles.muted}>Compartilhe o link do formulário para começar a receber respostas.</p>
              <Link to={`/formularios/${form.id}/publicado`} className={buttonClass({ variant: 'soft' })}>
                Ver link de acesso
              </Link>
            </>
          ) : (
            <>
              <p className={styles.emptyTitle}>Formulário não publicado</p>
              <p className={styles.muted}>
                A publicação foi interrompida, então este formulário não tem link e não recebe respostas.
              </p>
            </>
          )}
        </div>
      )}

      {hasResponses && (
        <>
          <div role="tablist" aria-label="Visualização" className={`${styles.tabs} no-print`} onKeyDown={onTabKey}>
            <button
              id="tab-individual"
              type="button"
              role="tab"
              aria-selected={tab === 'individual'}
              aria-controls="panel-individual"
              tabIndex={tab === 'individual' ? 0 : -1}
              className={styles.tab}
              onClick={() => setTab('individual')}
            >
              Respostas individuais <span className={styles.tabCount}>{count}</span>
            </button>
            <button
              id="tab-question"
              type="button"
              role="tab"
              aria-selected={tab === 'question'}
              aria-controls="panel-question"
              tabIndex={tab === 'question' ? 0 : -1}
              className={styles.tab}
              onClick={() => setTab('question')}
            >
              Por pergunta
            </button>
          </div>

          {tab === 'individual' && (
            <div id="panel-individual" role="tabpanel" aria-labelledby="tab-individual" className={`${styles.split} no-print`}>
              <section aria-label="Lista de respostas" className={styles.list}>
                <div className={styles.listHead}>Mais recentes primeiro</div>
                {pageItems.map((r) => {
                  const isSelected = r.id === selected?.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className={`${styles.listItem} ${isSelected ? styles.listItemOn : ''}`}
                      aria-current={isSelected ? 'true' : undefined}
                      onClick={() => setSelectedId(r.id)}
                    >
                      <span className={styles.listText}>
                        <span className={styles.listTitle}>Resposta #{r.number}</span>
                        {form.collectEmail && <span className={styles.listEmail}>{r.email}</span>}
                      </span>
                      <span className={styles.listDate}>{formatShortDateTime(r.submittedAt)}</span>
                    </button>
                  );
                })}
                <div className={styles.pager}>
                  <span>
                    {page * PAGE_SIZE + 1}–{Math.min(count, (page + 1) * PAGE_SIZE)} de {count}
                  </span>
                  <div className={styles.pagerButtons}>
                    <button
                      type="button"
                      className={styles.pagerButton}
                      aria-label="Página anterior"
                      disabled={page === 0}
                      onClick={() => goToPage(page - 1)}
                    >
                      <ArrowLeftIcon />
                    </button>
                    <button
                      type="button"
                      className={styles.pagerButton}
                      aria-label="Próxima página"
                      disabled={page >= pages - 1}
                      onClick={() => goToPage(page + 1)}
                    >
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              </section>

              {selected && (
                <div className={styles.detailWrap} aria-live="polite">
                  <ResponseDetail form={form} response={selected} />
                </div>
              )}
            </div>
          )}

          {tab === 'question' && (
            <div id="panel-question" role="tabpanel" aria-labelledby="tab-question" className="no-print">
              <ByQuestion form={form} responses={responses} />
            </div>
          )}

          {/* Versão para impressão / PDF: todas as respostas, da mais antiga para a mais nova. */}
          <div className={styles.printOnly} aria-hidden="true">
            <p className={styles.printSummary}>
              {plural(count, 'resposta', 'respostas')} · exportado em {formatDate(new Date().toISOString())}
            </p>
            {[...responses].reverse().map((r) => (
              <ResponseDetail key={r.id} form={form} response={r} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
