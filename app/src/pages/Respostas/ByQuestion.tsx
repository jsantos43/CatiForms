import type { FormDetail } from '../../api/types';
import { plural } from '../../lib/format';
import { answerFor, justificationOf, type NumberedResponse } from './model';
import { TypeBadge } from './ResponseDetail';
import styles from './Respostas.module.css';

// Aba "Por pergunta": contagem por opção e todos os textos/justificativas.
export function ByQuestion({ form, responses }: { form: FormDetail; responses: NumberedResponse[] }) {
  const total = responses.length;

  return (
    <div className={styles.byQuestion}>
      {form.questions.map((q, i) => {
        const answers = responses.map((r) => ({ r, a: answerFor(r, q) }));

        return (
          <section key={q.id} className={styles.summaryCard} aria-labelledby={`sum-${q.id}`}>
            <div className={styles.answerMeta}>
              <span className={styles.answerNumber}>{i + 1}</span>
              <TypeBadge type={q.type} />
            </div>
            <h2 id={`sum-${q.id}`} className={styles.answerQuestion}>
              {q.title}
            </h2>

            {q.type !== 'TEXT' && (
              <ul className={styles.bars}>
                {q.options.map((o) => {
                  const count = answers.filter(({ a }) => a?.choices.includes(o.label)).length;
                  const pct = total ? Math.round((count / total) * 100) : 0;
                  return (
                    <li key={o.label} className={styles.bar}>
                      <div className={styles.barLabel}>
                        <span>{o.label}</span>
                        <span className={styles.muted}>
                          {plural(count, 'resposta', 'respostas')} · {pct}%
                        </span>
                      </div>
                      <div className={styles.barTrack} aria-hidden="true">
                        <div className={styles.barFill} style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {q.type === 'MULTIPLE_CHOICE' && (
              <p className={styles.muted}>Cada pessoa pode marcar mais de uma opção.</p>
            )}

            {q.type !== 'MULTIPLE_CHOICE' && (
              <details className={styles.texts} open={q.type === 'TEXT'}>
                <summary>{q.type === 'TEXT' ? 'Respostas' : 'Justificativas'} ({total})</summary>
                <ul>
                  {answers.map(({ r, a }) => (
                    <li key={r.id}>
                      <span className={styles.textAuthor}>#{r.number}</span>
                      <p>{(q.type === 'TEXT' ? a?.text : justificationOf(a)) || '—'}</p>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        );
      })}
    </div>
  );
}
