import { db } from '../prisma/db.js';

class User {
  static async readAll() {
    const users = await db.orm.public.User.all();
    
    return users;
  }

  static readById(id: number) {
    return db.orm.public.User.first({ id });
  }
}

export default User;
