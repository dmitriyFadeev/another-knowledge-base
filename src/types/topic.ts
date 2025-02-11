export type TTopicFull = TCreateTopic & {
    topicId: bigint;
};

export enum ETopicSign{
    public='публичная', 
    private='внутренняя'
}

export type TCreateTopic = {
    topicTitle: string;
    topicData: string;
    topicTags: string[] | null;
    topicSign: ETopicSign | null;
};