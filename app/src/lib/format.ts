const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

// "12/11/2026"
export const formatDate = (iso: string) => dateFmt.format(new Date(iso));

// Link público do formulário. Até a API ter um código próprio, o código é o id do form.
export const formShareUrl = (formId: string) => `${window.location.origin}/f/${formId}`;

// Minúsculas e sem acentos, para busca.
export const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const timeFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const shortDateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });

// "13/11/2026 às 00:41"
export const formatDateTime = (iso: string) => `${formatDate(iso)} às ${timeFmt.format(new Date(iso))}`;

// "13/11 00:41" (lista de respostas)
export const formatShortDateTime = (iso: string) =>
  `${shortDateFmt.format(new Date(iso))} ${timeFmt.format(new Date(iso))}`;
