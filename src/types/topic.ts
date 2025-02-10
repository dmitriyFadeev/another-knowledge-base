export type TTopicFull = TTopic & {
    topicId: bigint;
};

export enum ETopicSign{
    public='публичная', 
    private='внутренняя'
}

export type TTopic = TCreateTopic & {
  topicAdded: Date | null;
};

export type TCreateTopic = {
    topicTitle: string;
    topicData: string;
    topicTags: string[];
    topicSign: ETopicSign;
};