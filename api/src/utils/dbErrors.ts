// SQLSTATE do Postgres para violação de unique / primary key.
const UNIQUE_VIOLATION = '23505';

type SqlQueryError = { kind: 'sql_query'; sqlState?: string; constraint?: string };

const isSqlQueryError = (err: unknown): err is SqlQueryError =>
  typeof err === 'object' && err !== null && (err as { kind?: unknown }).kind === 'sql_query';

// O Prisma pode embrulhar o erro do driver, então percorremos a cadeia de `cause`.
const findSqlQueryError = (err: unknown): SqlQueryError | undefined => {
  for (let cur = err, depth = 0; cur && depth < 5; depth++) {
    if (isSqlQueryError(cur)) return cur;
    cur = (cur as { cause?: unknown }).cause;
  }
  return undefined;
};

// Retorna o campo que violou o unique (ex.: "User_username_key" -> "username"),
// `null` se for violação de unique sem campo identificável, ou `undefined` se não for.
export const uniqueViolationField = (err: unknown): string | null | undefined => {
  const sqlError = findSqlQueryError(err);
  if (sqlError?.sqlState !== UNIQUE_VIOLATION) return undefined;

  const match = sqlError.constraint?.match(/^[^_]+_(.+)_key$/);
  return match?.[1] ?? null;
};
