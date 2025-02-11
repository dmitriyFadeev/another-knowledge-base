import { TopicFilterSchema, TopicSchema } from '../zod-schemas/topic.js';
import { StringSchema } from '../zod-schemas/common.js';
import { authenticate, authenticateWithoutError } from '../middleware/auth.js';
import { TopicRepository } from '../repositories/topic.js';
import { CommonResponse } from '../responses/common.js';
import { ErrorResponse } from '../responses/error.js';
import { Request, Response, Router } from 'express';
import {ZodError} from 'zod'
import { TopicService } from '../services/topic.js';

const topicRouter = Router();


topicRouter.get('/', authenticateWithoutError, async (req: Request, res: Response):Promise<any> => {
    try {
        const topicTagsParam = req.query.topicTags as string;
        let topicTags = []
        if(topicTagsParam)
            topicTags = JSON.parse(topicTagsParam)
        const data = TopicFilterSchema.parse(topicTags)
        const loggedIn = req.user ? true : false
        const topics = await TopicService.getTopics(data, loggedIn);
        return res.json(new CommonResponse(topics))
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
            topicId:topic.topicId.toString()
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

topicRouter.get('/:id', authenticateWithoutError, async (req: Request, res: Response):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params.id);
        const loggedIn = req.user ? true : false
        const topic = await TopicService.getTopicById(id, loggedIn);
        return res.json(new CommonResponse({
            ...topic,
            topicId:topic.topicId.toString()
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
        console.log(req.user)
        const id = StringSchema.parse(req.params.id);
        const parseResult = TopicSchema.parse(req.body);
        const topic = await TopicRepository.updateTopic({
            ...parseResult,
            topicId: BigInt(id),
        });
        return res.json(new CommonResponse({
            ...topic,
            topicId:topic.topicId.toString()
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
        const id = StringSchema.parse(req.params.id);
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