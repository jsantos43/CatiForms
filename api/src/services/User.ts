import type { UUID } from 'node:crypto';
import { db } from '../prisma/db.js';
import { NotFound } from '../errors/index.js';


class User {
  static async readAll() {
    const users = await db.orm.public.User.all();
    
    return users;
  }

  static async readById(id: UUID) {
    const user = await db.orm.public.User.first({ id });

    if (!user) {
      throw new NotFound('Usuário não encontrado');
    }

    return user;
  }
}

export default User;
