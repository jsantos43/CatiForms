import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost';

export type ButtonStyle = {
  variant?: ButtonVariant;
  // "block" ocupa a largura toda (botões de formulário do login/cadastro).
  block?: boolean;
  size?: 'md' | 'lg';
};

// Classes do botão; também usado em <Link className={buttonClass(...)}> para links com cara de botão.
export const buttonClass = ({ variant = 'primary', block = false, size = 'md' }: ButtonStyle = {}) =>
  [styles.button, styles[variant], styles[size], block && styles.block].filter(Boolean).join(' ');
