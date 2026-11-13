// Tipos espelhando as respostas da API (api/src/services/*).

export type User = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  admin: boolean;
  createdAt: string;
  updatedAt: string;
};

export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE_JUSTIFIED';

// As opções não têm id: a API guarda só o rótulo, e as respostas referenciam a opção pelo rótulo.
export type Option = {
  label: string;
};

export type Question = {
  id: string;
  type: QuestionType;
  title: string;
  position: number;
  options: Option[];
};

export type Author = {
  id: string;
  username: string;
  name: string | null;
};

export type Form = {
  id: string;
  title: string;
  description: string | null;
  collectEmail: boolean;
  published: boolean;
  // Código do link público (/f/:slug).
  slug: string;
  authorId: string;
  createdAt: string;
};

export type FormSummary = Form & {
  author: Author;
  questions: number;
  responses: number;
};

export type FormDetail = Form & {
  author: Author;
  questions: Question[];
};

// Corpo de erro padrão da API (api/src/errors/Base.ts).
export type ApiErrorBody = {
  success: false;
  error: string;
  message: string;
  details: string[];
};

// Formulário como o respondente vê (GET /f/:slug): sem id nem dados do autor.
export type PublicForm = Pick<Form, 'slug' | 'title' | 'description' | 'collectEmail'> & {
  questions: Question[];
};

// Resposta a uma pergunta, como a API guarda (api/src/schemas/Response.ts):
// - TEXT: text preenchido, choices vazio;
// - MULTIPLE_CHOICE: choices com os rótulos marcados, text null;
// - SINGLE_CHOICE_JUSTIFIED: choices com um rótulo e text com a justificativa.
export type Answer = {
  questionId: string;
  text: string | null;
  choices: string[];
};

export type FormResponse = {
  id: string;
  formId: string;
  email: string | null;
  submittedAt: string;
  answers: Answer[];
};
