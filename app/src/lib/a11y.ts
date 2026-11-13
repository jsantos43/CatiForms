// Props de acessibilidade para um controle com erro opcional.
// A mensagem deve ser renderizada com <FieldError id={`${id}-error`}>.
export const errorProps = (id: string, error?: string) => ({
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-error` : undefined,
});
