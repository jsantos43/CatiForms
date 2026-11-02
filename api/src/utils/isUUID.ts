import type { UUID } from 'node:crypto';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isUUID = (value: unknown): value is UUID =>
  typeof value === 'string' && UUID_REGEX.test(value);

export default isUUID;
