import { Router } from 'express';
import { UserSchema } from '../zod/user';
import { StringSchema } from '../zod/common';
import { authenticate } from '../middleware/auth';
import { UserRepository } from '../repositories/user';
import { CommonResponse } from '../responses/common';
import { ErrorResponse } from '../responses/error';
import { Request } from 'express';

const userRouter = Router();


userRouter.get('/', authenticate, async (req: Request):Promise<any> => {
    try {
        const users = await UserRepository.getUsers();
        return new CommonResponse(users);
    } catch (e) {
        const err = e as Error;
        return new ErrorResponse(err);
    }
}),

userRouter.post('/', authenticate, async (req: Request):Promise<any> => {
    try {
        const parseResult = UserSchema.parse(req.body);
        const user = await UserRepository.insertUser(parseResult);
        return new CommonResponse(user);
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

userRouter.get('/:id', authenticate, async (req: Request):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params);
        const user = await UserRepository.getUserById(BigInt(id));
        return new CommonResponse(user);
    } catch (e) {
        const err = e as Error;
        return new ErrorResponse(err);
    }
}),

userRouter.put('/:id', authenticate, async (req: Request):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params);
        const parseResult = UserSchema.parse(req.body);
        const user = await UserRepository.updateUser({
            ...parseResult,
            userId: BigInt(id),
        });
        return new CommonResponse(user);
    } catch (e) {
        const err = e as Error;
        return new ErrorResponse(err);
    }
}),

userRouter.delete('/:id', authenticate, async (req: Request):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params);
        await UserRepository.deleteUser(BigInt(id));
        return new CommonResponse(null);
    } catch (e) {
        const err = e as Error;
        return new ErrorResponse(err);
    }
})

export default userRouter;