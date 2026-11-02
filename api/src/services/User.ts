import { NotFound } from '../errors/index.js';
import { db } from '../prisma/db.js';
import type { CreateUserData } from '../schemas/User.js';

class User {
  static async readAll() {
    const users = await db.orm.public.User.all();

    return users;
  }

  static async readById(id: string) {
    const user = await db.orm.public.User.first({ id });

    if (!user) {
      throw new NotFound('Usuário não encontrado');
    }

    return user;
  }

  static async create(data: CreateUserData) {
    const user = await db.orm.public.User.create(data);

    return user;
  }
}

export default User;
