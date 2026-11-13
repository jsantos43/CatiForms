import type { FormDetail, QuestionType } from '../../api/types';
import { CheckIcon } from '../../components/icons';
import { formatDateTime } from '../../lib/format';
import { QUESTION_TYPE_SHORT } from '../../lib/questionTypes';
import { answerFor, type NumberedResponse } from './model';
import styles from './Respostas.module.css';

const TYPE_BADGE: Record<QuestionType, string> = {
  TEXT: styles.badgeText,
  MULTIPLE_CHOICE: styles.badgeMultiple,
  SINGLE_CHOICE_JUSTIFIED: styles.badgeSingle,
};

export function TypeBadge({ type }: { type: QuestionType }) {
  return <span className={`${styles.badge} ${TYPE_BADGE[type]}`}>{QUESTION_TYPE_SHORT[type]}</span>;
}

// Uma resposta completa. Usado no painel da direita e na versão para impressão (PDF).
export function ResponseDetail({ form, response }: { form: FormDetail; response: NumberedResponse }) {
  return (
    <article className={styles.detail} aria-labelledby={`resp-${response.id}`}>
      <div className={styles.detailHeader}>
        <div>
          <h2 id={`resp-${response.id}`} className={styles.detailTitle}>
            Resposta #{response.number}
          </h2>
          <span className={styles.muted}>Enviada em {formatDateTime(response.createdAt)}</span>
        </div>
        {form.collectEmail && (
          <div className={styles.detailEmail}>
            <span className={styles.overline}>E-mail de contato</span>
            <span className={styles.emailValue}>{response.email ?? '—'}</span>
          </div>
        )}
      </div>

      {form.questions.map((q, i) => {
        const a = answerFor(response, q);
        return (
          <div key={q.id} className={styles.answer}>
            <div className={styles.answerMeta}>
              <span className={styles.answerNumber}>{i + 1}</span>
              <TypeBadge type={q.type} />
            </div>
            <h3 className={styles.answerQuestion}>{q.title}</h3>

            {q.type === 'TEXT' && <p className={styles.readBox}>{a?.text || '—'}</p>}

            {q.type === 'MULTIPLE_CHOICE' && (
              <div className={styles.chips}>
                {q.options.map((o) => {
                  const chosen = a?.optionIds.includes(o.id);
                  return (
                    <span key={o.id} className={chosen ? styles.chipOn : styles.chipOff}>
                      {chosen && <CheckIcon size={14} />}
                      {o.label}
                      {chosen && <span className="visually-hidden"> (marcada)</span>}
                    </span>
                  );
                })}
              </div>
            )}

            {q.type === 'SINGLE_CHOICE_JUSTIFIED' && (
              <>
                <span className={styles.chipOn}>
                  <span aria-hidden="true" className={styles.dot} />
                  {q.options.find((o) => a?.optionIds.includes(o.id))?.label ?? '—'}
                </span>
                <div className={styles.readBox}>
                  <span className={styles.overline}>Justificativa</span>
                  <p>{a?.justification || '—'}</p>
                </div>
              </>
            )}
          </div>
        );
      })}
    </article>
  );
}
