import { TopicRepository } from "../repositories/topic";
import { ETopicSign, TTopicFullFilters, TTopicFullStr } from "../types/topic";

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
}