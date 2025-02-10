import db from '../../db';
import { eq } from 'drizzle-orm';

import { pgTopics } from '../drizzle/schema';
import type { TTopicFull, TCreateTopic } from '../types/topic';

export class TopicRepository {
  static async insertTopic(topic: TCreateTopic): Promise<TTopicFull> {
    const result = await db.insert(pgTopics).values(topic).returning();
    return result[0] as TTopicFull;
  }

  static async getTopicById(id: bigint): Promise<TTopicFull> {
    const result = await db
      .select()
      .from(pgTopics)
      .where(eq(pgTopics.topicId, id));
    const topic = result[0] as TTopicFull;
    if (!topic || !topic.topicId) {
      throw new Error('статья по id не найден');
    }
    return topic;
  }

  static async getTopics(): Promise<TTopicFull[]> {
    const result = await db.select().from(pgTopics);
    const topics = result as TTopicFull[];
    return topics;
  }

  static async updateTopic(
    updatedTopic: TTopicFull
  ): Promise<TTopicFull> {
    const result = await db
      .update(pgTopics)
      .set(updatedTopic)
      .where(eq(pgTopics.topicId, updatedTopic.topicId))
      .returning();
    const topic = result[0] as TTopicFull;
    if (!topic || !topic.topicId) {
      throw new Error('статья по id не найден');
    }
    return topic;
  }

  static async deleteTopic(id: bigint): Promise<void> {
    const result = await db.delete(pgTopics).where(eq(pgTopics.topicId, id));
    if (!result)
      throw new Error('статья по id не найден');
  }
}
