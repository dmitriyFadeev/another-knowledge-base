import { Router, Request, Response } from 'express';
import { CommonResponse } from '../responses/common';
import { ErrorResponse } from '../responses/error';
import { AuthRepository } from '../services/auth';
import { UserRepository } from '../repositories/user';
import { authenticate } from '../middleware/auth';
import { ZodError } from 'zod'
import { AuthSchema, RefreshSchema } from '../zod-schemas/auth';

const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response):Promise<any> => {
    try {
        const input = AuthSchema.parse(req.body);
        const user = await AuthRepository.login(input);
        return res.json(new CommonResponse({
            ...user,
            userId:user.userId.toString()
        }));
    } catch (e) {
        if (e instanceof ZodError) {
            let error = ''
            e.errors.forEach(issue => error += issue.path.join('.') + ' ' + issue.message + ',');
            return res.json(new ErrorResponse(new Error(error)));
        }
        const err = e as Error;
        return res.json(new ErrorResponse(err));
    }
});

authRouter.post('/refreshToken', async (req: Request, res: Response):Promise<any> => {
    try {
        const input = RefreshSchema.parse(req.body);
        const user = await AuthRepository.refresh(input.userId,input.token.split(' ')[1]);
        return res.json(new CommonResponse({
            ...user,
            userId:user.userId.toString()
        }));
    } catch (e) {
        if (e instanceof ZodError) {
            let error = ''
            e.errors.forEach(issue => error += issue.path.join('.') + ' ' + issue.message + ',');
            return res.json(new ErrorResponse(new Error(error)));
        }
        const err = e as Error;
        return res.json(new ErrorResponse(err));
    }
});

authRouter.post('/logout', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        await UserRepository.updateRefreshToken(BigInt(req.user.id), null);
        return res.json(new CommonResponse(true));
      } catch (e) {
        if (e instanceof ZodError) {
            let error = ''
            e.errors.forEach(issue => error += issue.path.join('.') + ' ' + issue.message + ',');
            return res.json(new ErrorResponse(new Error(error)));
        }
        const err = e as Error;
        return res.json(new ErrorResponse(err));
      }
});

export default authRouter;