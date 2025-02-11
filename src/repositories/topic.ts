import db from '../../db';
import { eq, sql } from 'drizzle-orm';

import { pgTopics } from '../drizzle/schema';
import { type TTopicFull, type TCreateTopic, ETopicSign, TTopicFullFilters, TTopicFullStr } from '../types/topic';

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

  static async getTopics(tags: string[] | null, logged: boolean): Promise<TTopicFullFilters> {
    const topics = await db.select().from(pgTopics);
    let filteredTopics = topics
    if (tags && tags.length > 0) {
      filteredTopics = topics.filter(topic => {
          return tags.every(tag => topic.topicTags?.includes(tag));
      });
    }
    if (logged === false){
      filteredTopics = topics.filter(topic=>topic.topicSign == ETopicSign.public)
    }
    const tagsSet: Set<string> = new Set()
    topics.forEach(el=>el.topicTags.forEach(tag=>tagsSet.add(tag)))

    return {
      allTags: Array.from(tagsSet),
      filteredTopics: filteredTopics.map(el=>({
        ...el,
        topicId: el.topicId.toString()
      })) as TTopicFullStr[]
    }
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
