import { UserSchema } from '../zod-schemas/user';
import { StringSchema } from '../zod-schemas/common';
import { authenticate } from '../middleware/auth';
import { UserRepository } from '../repositories/user';
import { CommonResponse } from '../responses/common';
import { ErrorResponse } from '../responses/error';
import { Request, Response, Router } from 'express';
import { ZodError } from 'zod'
import { UserService } from '../services/user';

const userRouter = Router();


userRouter.get('/', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const users = await UserRepository.getUsers();
        return res.json(new CommonResponse(users.map(el=>({
            ...el,
            userId:el.userId.toString() 
        }))))

    } catch (e) {
        if (e instanceof ZodError) {
            let error = ''
            e.errors.forEach(issue => error += issue.path.join('.') + ' ' + issue.message + ',');
            return res.json(new ErrorResponse(new Error(error)));
        }
        const err = e as Error;
        return res.json(new ErrorResponse(err));
    }
}),

userRouter.post('/', async (req: Request, res: Response):Promise<any> => {
    try {
        const parseResult = UserSchema.parse(req.body);
        const user = await UserService.insertUser(parseResult);
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
  }),

userRouter.get('/:id', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params.id);
        const user = await UserRepository.getUserById(BigInt(id));
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
}),

userRouter.put('/:id', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params.id);
        const parseResult = UserSchema.parse(req.body);
        const userId = await UserService.updateUser({
            ...parseResult,
            userId: BigInt(id),
        });
        return res.json(new CommonResponse(userId.toString()));
    } catch (e) {
        if (e instanceof ZodError) {
            let error = ''
            e.errors.forEach(issue => error += issue.path.join('.') + ' ' + issue.message + ',');
            return res.json(new ErrorResponse(new Error(error)));
        }
        const err = e as Error;
        return res.json(new ErrorResponse(err));
    }
}),

userRouter.delete('/:id', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params.id);
        await UserRepository.deleteUser(BigInt(id));
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
})

export default userRouter;