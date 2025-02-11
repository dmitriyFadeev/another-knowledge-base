import { UserRepository } from "../repositories/user";
import { TCreateUser, TUserFull, TUserWithTokens } from "../types/user";
import { AuthRepository } from "./auth";
import { CommonService } from "./common-service";


export class UserService {
    static async insertUser(user: TCreateUser): Promise<TUserWithTokens>{
        await UserRepository.checkAlreadyExist(user.userEmail, user.userLogin)
        const userPassword = await CommonService.hashPassword(user.userPassword);
        const inserted = await UserRepository.insert({
            ...user,
            userPassword
        })
        const tokens = AuthRepository.generateTokens(
            inserted.userId.toString(),
            inserted.userEmail
        );
        const updatedUser = await UserRepository.updateRefreshToken(
            inserted.userId,
            CommonService.encrypt(tokens.refreshToken)
        );
    
        return {
          userId: updatedUser.userId,
          refreshToken: updatedUser.refreshToken,
          accessToken: tokens.accessToken,
        };
    }

    static async updateUser(updatedUser: TUserFull): Promise<bigint> {
        await UserRepository.checkAlreadyExist(updatedUser.userEmail, updatedUser.userLogin)
        const userPassword = await CommonService.hashPassword(updatedUser.userPassword);
        const result = await UserRepository.update({
            ...updatedUser,
            userPassword
          })

        return result;
    }
}