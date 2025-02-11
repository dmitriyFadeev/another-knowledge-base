import { Router } from 'express';
import { TopicSchema } from '../zod/topic';
import { StringSchema } from '../zod/common';
import { authenticate } from '../middleware/auth';
import { TopicRepository } from '../repositories/topic';
import { CommonResponse } from '../responses/common';
import { ErrorResponse } from '../responses/error';
import { Request, Response } from 'express';
import {ZodError} from 'zod'

const topicRouter = Router();


topicRouter.get('/', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const topics = await TopicRepository.getTopics();
        return res.json(new CommonResponse(topics.map(el=>({
            ...el,
            topicId:el.topicId
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

topicRouter.post('/', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const parseResult = TopicSchema.parse(req.body);
        const topic = await TopicRepository.insertTopic(parseResult);
        return res.json(new CommonResponse({
            ...topic,
            topicId:topic.topicId
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

topicRouter.get('/:id', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params);
        const topic = await TopicRepository.getTopicById(BigInt(id));
        return res.json(new CommonResponse({
            ...topic,
            topicId:topic.topicId
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

topicRouter.put('/:id', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params);
        const parseResult = TopicSchema.parse(req.body);
        const topic = await TopicRepository.updateTopic({
            ...parseResult,
            topicId: BigInt(id),
        });
        return res.json(new CommonResponse({
            ...topic,
            topicId:topic.topicId
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

topicRouter.delete('/:id', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params);
        await TopicRepository.deleteTopic(BigInt(id));
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

export default topicRouter;