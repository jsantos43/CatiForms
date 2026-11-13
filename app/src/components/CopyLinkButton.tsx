import { useEffect, useRef, useState, type ButtonHTMLAttributes } from 'react';
import { copyText } from '../lib/clipboard';
import { CheckIcon, LinkIcon } from './icons';

type CopyLinkButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'> & {
  url: string;
  label?: string;
  copiedLabel?: string;
  iconSize?: number;
};

// Botão que copia o link e troca o texto para "Copiado" por alguns segundos.
export function CopyLinkButton({
  url,
  label = 'Link',
  copiedLabel = 'Copiado',
  iconSize = 15,
  ...props
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = async () => {
    if (!(await copyText(url))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" onClick={handleClick} {...props}>
      {copied ? <CheckIcon size={iconSize} /> : <LinkIcon size={iconSize} />}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
