import { TopicRepository } from "../repositories/topic.js";
import { ETopicSign, TTopicFull, TTopicFullFilters, TTopicFullStr } from "../types/topic.js";

export class TopicService {
    static async getTopics(tags: string[] | null, logged: boolean): Promise<TTopicFullFilters> {
        const topics = await TopicRepository.getAll();
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

    static async getTopicById(id: string, logged: boolean): Promise<TTopicFull> {
        const topic = await TopicRepository.getById(BigInt(id));
        if(!logged && topic.topicSign == ETopicSign.private)
            throw new Error('статья по id не найдена');
        return topic
    }
}