import Base, { type ErrorDetails } from './Base.js';

class Internal extends Base {
  constructor(details: ErrorDetails = []) {
    super('Internal Server Error!', 500, 'INTERNAL_ERROR', details);
  }
}

export default Internal;
