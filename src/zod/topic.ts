import { z } from 'zod';
import { ETopicSign } from '../types/topic';

const SignEnum = z.nativeEnum(ETopicSign);
type SignEnum = z.infer<typeof SignEnum>;

export const TopicSchema = z.object({
    topicTitle: z.string().nonempty("Title is required"),
    topicData: z.string().nonempty("Data is required"),
    topicTags: z.string().array().nullable(),
    topicSign: SignEnum.nullable(),
});