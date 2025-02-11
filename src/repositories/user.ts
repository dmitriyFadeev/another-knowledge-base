import db from '../../db';
import { eq, sql } from 'drizzle-orm';
import { pgUsers } from '../drizzle/schema';
import type {
  TCreateUser,
  TUserFull,
  TUserFullWithToken,
  TUserInsertedDb,
  TUserWithRefreshToken,
} from '../types/user';

export class UserRepository {
  static async updateRefreshToken(
    id: bigint,
    token: string | null
  ): Promise<TUserWithRefreshToken> {

    const result = await db
      .update(pgUsers)
      .set({
        userRefreshToken: token,
      })
      .where(eq(pgUsers.userId, id))
      .returning();

    return {
      userId: result[0].userId,
      refreshToken: result[0].userRefreshToken,
    };
  }

  static async checkAlreadyExist(
    email: string,
    login: string
  ): Promise<void> {
    let usersDb = [] as TUserFull[];
    usersDb = await db
      .select()
      .from(pgUsers)
      .where(sql`LOWER(${pgUsers.userEmail}) = LOWER(${email}) OR LOWER(${pgUsers.userLogin}) = LOWER(${login})`);
    const user = usersDb[0] as TUserFull;
    if (user) {
      throw new Error('пользователь с таким login или email уже есть');
    }
  }

  static async insert(user: TCreateUser): Promise<TUserInsertedDb> {
    const result = await db
      .insert(pgUsers)
      .values(user)
      .returning();
    const createdUser = result[0];
    return createdUser
  }

  static async getUserById(id: bigint): Promise<TUserFull> {
    const result = await db
      .select()
      .from(pgUsers)
      .where(eq(pgUsers.userId, id));
    const user = result[0] as TUserFull;
    if (!user || !user.userId) {
      throw new Error('пользователь по id не найден');
    }
    return user;
  }

  static async getUserByIdWithToken(id: bigint): Promise<TUserFullWithToken> {
    const result = await db
      .select()
      .from(pgUsers)
      .where(eq(pgUsers.userId, id));
    const user = result[0] as TUserFullWithToken;
    if (!user || !user.userId) {
      throw new Error('пользователь по id не найден');
    }
    return user;
  }

  static async getUserByEmail(email: string): Promise<TUserFull> {
    const result = await db
      .select()
      .from(pgUsers)
      .where(sql`LOWER(${pgUsers.userEmail}) = LOWER(${email})`);
    const user = result[0] as TUserFull;
    if (!user || !user.userId) {
      throw new Error('пользователь по email не найден');
    }
    return user;
  }

  static async getUserByLogin(login: string): Promise<TUserFull> {
    const result = await db
      .select()
      .from(pgUsers)
      .where(eq(pgUsers.userLogin, login));
    const user = result[0] as TUserFull;
    if (!user || !user.userId) {
      throw new Error('пользователь по login не найден');
    }
    return user;
  }

  static async getUsers(): Promise<TUserFull[]> {
    const result = await db.select().from(pgUsers);
    const users = result as TUserFull[];
    return users;
  }

  static async update(updatedUser: TUserFull): Promise<bigint> {
    const result = await db
      .update(pgUsers)
      .set(updatedUser,
        )
      .where(eq(pgUsers.userId, updatedUser.userId))
      .returning();
    const user = result[0] as TUserFull;
    if (!user || !user.userId) {
      throw new Error('пользователь по id не найден');
    }
    return user.userId;
  }

  static async deleteUser(id: bigint): Promise<void> {
    const result = await db.delete(pgUsers).where(eq(pgUsers.userId, id));
    if (!result)
      throw new Error('пользователь по id не найден');
  }
}
