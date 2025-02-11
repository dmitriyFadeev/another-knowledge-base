import jwt from 'jsonwebtoken';

import { env } from '../../env';
import type { TAuth, TLoginUser, TUserWithTokens } from '../types/user';
import { CommonService } from '../services/common-service';
import { UserRepository } from './user';

export class AuthRepository {
  static generateTokens(id: string, email: string): TAuth {
    const accessToken = jwt.sign({ id, email }, env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign({ id, email }, env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  static async login(user: TLoginUser): Promise<TUserWithTokens> {
    const foundUser = await UserRepository.getUserByEmail(user.userEmail);
    await CommonService.verifyPassword(user.userPassword, foundUser.userPassword);
    const tokens = this.generateTokens(
      foundUser.userId.toString(),
      foundUser.userEmail
    );
    await UserRepository.updateRefreshToken(
      foundUser.userId,
      CommonService.encrypt(tokens.refreshToken)
    );
    return {
      userId: foundUser.userId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  static async refresh(
    userId: string,
    token: string
  ): Promise<TUserWithTokens> {
    const foundUser = await UserRepository.getUserByIdWithToken(BigInt(userId));
    const JWT_SECRET = env.JWT_SECRET;
    jwt.verify(token, JWT_SECRET);
    const tokens = this.generateTokens(
      foundUser.userId.toString(),
      foundUser.userEmail
    );
    await UserRepository.updateRefreshToken(
      foundUser.userId,
      CommonService.encrypt(tokens.refreshToken)
    );

    return {
      userId: foundUser.userId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
