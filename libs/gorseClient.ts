import { TDateISO } from "@/types";
import { Gorse, Item, User } from "gorsejs";

const auth = {
  gorseApiKey: process.env.GORSE_SERVER_API_KEY ?? 'test',
  gorseApiUrl: process.env.GORSE_SERVER_API_URL ?? "http://127.0.0.1:8087",
}
const client = new Gorse({ endpoint: auth.gorseApiUrl, secret: auth.gorseApiKey });

/*
  { FeedbackType: 'like', UserId: 'bob', ItemId: 'aquemini', Timestamp: '2022-02-24' },
*/
export interface MLFeedback {
  FeedbackType: string;
  UserId: string;
  ItemId: string;
  Timestamp: string;
}

export const insertMLUserEmbedding = 
  async (user: User) => await client.insertUser(user);

export const insertMLItemEmbedding = 
  async (item: Item) => await client.upsertItem(item);

export const insertMLFeedback = 
  async (feedback: MLFeedback[]) => await client.insertFeedbacks(feedback);

export const recommend = async (userId: string, amount = 10) => await client.getRecommend({
  userId: userId, 
  cursorOptions: { n: amount }
});
