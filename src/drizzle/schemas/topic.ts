import { bigserial, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const signEnum = pgEnum('topic_sign_enum', ['публичная', 'внутренняя']);

export const pgTopicsSchema = pgTable('topics', {
    topicId: bigserial('topic_id', { mode: 'bigint' }).primaryKey(),
    topicTitle: text('topic_title').notNull(),
    topicData: text('topic_data').notNull(),
    topicTags: text('topic_tags').array(),
    topicSign: signEnum('topic_sign'),
    topicAdded: timestamp('topic_added').defaultNow(),
});