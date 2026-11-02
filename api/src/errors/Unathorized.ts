import Base, { type ErrorDetails } from './Base.js';

class Unathorized extends Base {
  constructor(details: ErrorDetails = []) {
    super("You aren't authorized!", 401, 'UNATHORIZED', details);
  }
}

export default Unathorized;