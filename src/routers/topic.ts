import { Router } from 'express';
import { TopicSchema } from '../zod/topic';
import { StringSchema } from '../zod/common';
import { authenticate } from '../middleware/auth';
import { TopicRepository } from '../repositories/topic';
import { CommonResponse } from '../responses/common';
import { ErrorResponse } from '../responses/error';
import { Request } from 'express';

const topicRouter = Router();


topicRouter.get('/', authenticate, async (req: Request):Promise<any> => {
    try {
        const topics = await TopicRepository.getTopics();
        return new CommonResponse(topics);
    } catch (e) {
        const err = e as Error;
        return new ErrorResponse(err);
    }
}),

topicRouter.post('/', authenticate, async (req: Request):Promise<any> => {
    try {
        const parseResult = TopicSchema.parse(req.body);
        const topic = await TopicRepository.insertTopic(parseResult);
        return new CommonResponse(topic);
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

topicRouter.get('/:id', authenticate, async (req: Request):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params);
        const topic = await TopicRepository.getTopicById(BigInt(id));
        return new CommonResponse(topic);
    } catch (e) {
        const err = e as Error;
        return new ErrorResponse(err);
    }
}),

topicRouter.put('/:id', authenticate, async (req: Request):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params);
        const parseResult = TopicSchema.parse(req.body);
        const topic = await TopicRepository.updateTopic({
            ...parseResult,
            topicId: BigInt(id),
        });
        return new CommonResponse(topic);
    } catch (e) {
        const err = e as Error;
        return new ErrorResponse(err);
    }
}),

topicRouter.delete('/:id', authenticate, async (req: Request):Promise<any> => {
    try {
        const id = StringSchema.parse(req.params);
        await TopicRepository.deleteTopic(BigInt(id));
        return new CommonResponse(null);
    } catch (e) {
        const err = e as Error;
        return new ErrorResponse(err);
    }
})

export default topicRouter;