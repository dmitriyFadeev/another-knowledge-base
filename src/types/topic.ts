export type TTopicFull = TCreateTopic & {
    topicId: bigint;
};

export type TTopicFullStr = TCreateTopic & {
    topicId: string;
};

export enum ETopicSign{
    public='публичная', 
    private='внутренняя'
}

export type TCreateTopic = {
    topicTitle: string;
    topicData: string;
    topicTags: string[];
    topicSign: ETopicSign | null;
};

export type TTopicFullFilters = {
    allTags: string[],
    filteredTopics: TTopicFullStr[]
}