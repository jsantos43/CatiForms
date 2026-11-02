import { NotFound } from '../errors/index.js';
import { db } from '../prisma/db.js';
import type { CreateUserData, UpdateUserData } from '../schemas/User.js';
import { hash } from '../utils/hash.js';

const users = () =>
  db.orm.public.User.select('id', 'email', 'username', 'name', 'createdAt', 'updatedAt');

class User {
  static async readAll() {
    const allUsers = await users().all();

    return allUsers;
  }

  static async readById(id: string) {
    const user = await users().first({ id });

    if (!user) throw new NotFound('User not found');

    return user;
  }

  static async create(data: CreateUserData) {
    const password = await hash(data.password);

    const user = await users().create({ ...data, password });

    return user;
  }

  static async update(id: string, data: UpdateUserData) {
    const user = await users().where({ id }).update(data);

    if (!user) throw new NotFound('User not found');

    return user;
  }

  static async delete(id: string) {
    const user = await users().where({ id }).delete();

    if (!user) throw new NotFound('User not found');

    return user;
  }
}

export default User;
