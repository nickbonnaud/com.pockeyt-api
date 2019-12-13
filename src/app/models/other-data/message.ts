import { Reply } from './reply';

export class Message {
  identifier: string;
  title: string;
  body: string;
  sentByBusiness: boolean;
  read: boolean;
  readByAdmin: boolean;
  unreadReply: boolean;
  createdAt: string;
  updatedAt: string;
  replies: Reply[];
}
