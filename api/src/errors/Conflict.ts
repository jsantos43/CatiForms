import Base, { type ErrorDetails } from './Base.js';

class Conflict extends Base {
  constructor(details: ErrorDetails = []) {
    super('The request conflicts with the current state of the resource', 409, 'CONFLICT', details);
  }
}

export default Conflict;
