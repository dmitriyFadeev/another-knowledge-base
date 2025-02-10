import { Router, Request, Response } from 'express';
import { CommonResponse } from '../responses/common';
import { ErrorResponse } from '../responses/error';
import { AuthRepository } from '../repositories/auth';
import { CommonService } from '../services/common-service';
import { UserRepository } from '../repositories/user';
import { authenticate } from '../middleware/auth';

const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response):Promise<any> => {
    try {
        const { input } = req.body;
        const user = await AuthRepository.login(input);
        return new CommonResponse(user);
    } catch (e) {
        const err = e as Error;
        return new ErrorResponse(err);
    }
});

authRouter.post('/refreshToken', async (req: Request, res: Response):Promise<any> => {
    try {
        const { input } = req.body;
        const user = await AuthRepository.login(input);
        return new CommonResponse(user);
    } catch (e) {
        const err = e as Error;
        return new ErrorResponse(err);
    }
});

authRouter.post('/logout', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const { ctx } = req.body;
        await UserRepository.updateRefreshToken(BigInt(req.user.id), null);
        return new CommonResponse(null);
      } catch (e) {
        const err = e as Error;
        return new ErrorResponse(err);
      }
});

export default authRouter;