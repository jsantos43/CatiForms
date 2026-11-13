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

export type Option = {
  id: string;
  label: string;
  position: number;
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
  authorId: string;
  createdAt: string;
};

export type FormSummary = Form & {
  author: Author;
  questions: number;
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

// Formulário como o respondente vê (sem dados do autor).
export type PublicForm = Pick<Form, 'id' | 'title' | 'description' | 'collectEmail'> & {
  questions: Question[];
};

// Uma resposta à pergunta, no formato devolvido pela API.
export type Answer = {
  questionId: string;
  text: string | null;
  optionIds: string[];
  justification: string | null;
};

export type FormResponse = {
  id: string;
  email: string | null;
  createdAt: string;
  answers: Answer[];
};
