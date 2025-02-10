import { randomInt } from 'crypto';
import db from '../../db';
import { and, eq, sql } from 'drizzle-orm';
import { pgUsers } from '../drizzle/schema';
import { env } from '../../env';
import type {
  TCreateUser,
  TUserFull,
  TUserFullWithToken,
  TUserWithRefreshToken,
  TUserWithTokens,
} from '../types/user';
import { CommonService } from '../services/common-service';
import { AuthRepository } from './auth';

export class UserRepository {
  static async updateRefreshToken(
    id: bigint,
    token: string | null
  ): Promise<TUserWithRefreshToken> {
    let userRefreshToken = null;
    if (token) userRefreshToken = await CommonService.hashPassword(token);

    const result = await db
      .update(pgUsers)
      .set({
        userRefreshToken,
      })
      .where(eq(pgUsers.userId, id))
      .returning();

    return {
      userId: result[0].userId,
      refreshToken: result[0].userRefreshToken,
    };
  }

  static async emailAlreadyExist(
    email: string,
    isReset?: boolean
  ): Promise<void> {
    let usersDb = [] as TUserFull[];
    usersDb = await db
      .select()
      .from(pgUsers)
      .where(sql`LOWER(${pgUsers.userEmail}) = LOWER(${email})`);
    const user = usersDb[0] as TUserFull;
    if (user && !isReset) {
      throw new Error('пользователь с таким email уже есть');
    }
  }

  static async insertUser(user: TCreateUser): Promise<TUserWithTokens> {
    const userPassword = await CommonService.hashPassword(user.userPassword);
    const result = await db
      .insert(pgUsers)
      .values({
        ...user,
        userPassword,
      })
      .returning();
    const createdUser = result[0];
    const tokens = AuthRepository.generateTokens(
      createdUser.userId.toString(),
      createdUser.userEmail
    );
    const updatedUser = await this.updateRefreshToken(
      createdUser.userId,
      CommonService.encrypt(tokens.refreshToken)
    );

    return {
      userId: updatedUser.userId,
      refreshToken: updatedUser.refreshToken,
      accessToken: tokens.accessToken,
    };
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
      throw new Error('пользователь по кампании не найден');
    }
    return user;
  }

  static async getUsers(): Promise<TUserFull[]> {
    const result = await db.select().from(pgUsers);
    const users = result as TUserFull[];
    return users;
  }

  static async updateUser(updatedUser: TUserFull): Promise<bigint> {
    const userPassword = await CommonService.hashPassword(updatedUser.userPassword);
    const result = await db
      .update(pgUsers)
      .set({
        ...updatedUser,
        userPassword
      })
      .where(eq(pgUsers.userId, updatedUser.userId))
      .returning();
    const user = result[0] as TUserFull;
    if (!user || !user.userId) {
      throw new Error('пользователь по почте не найден');
    }
    return user.userId;
  }

  static async deleteUser(id: bigint): Promise<void> {
    const result = await db.delete(pgUsers).where(eq(pgUsers.userId, id));
    if (!result)
      throw new Error('пользователь по id не найден');
  }
}
