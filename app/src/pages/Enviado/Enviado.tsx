import { useLocation } from 'react-router-dom';
import { CheckIcon } from '../../components/icons';
import { PublicLayout } from '../../layouts/PublicLayout';
import styles from './Enviado.module.css';

export default function Enviado() {
  const title = (useLocation().state as { title?: string } | null)?.title;

  return (
    <PublicLayout footer={<p className={styles.footer}>Feito com Cati Forms · CATI Jr.</p>}>
      <section className={styles.card}>
        <div className={styles.badge}>
          <CheckIcon size={30} />
        </div>
        <h1 className={styles.title}>Resposta enviada</h1>
        <p className={styles.text}>
          Obrigado por responder{title ? ` “${title}”` : ''}. Suas respostas foram registradas e não
          podem ser alteradas.
        </p>
        <p className={styles.close}>Você já pode fechar esta página.</p>
      </section>
    </PublicLayout>
  );
}
