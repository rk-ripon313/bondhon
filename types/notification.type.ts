export interface Notification {
  id: string;
  actor?: ActorUser | null;
  receiver: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date | string;
}

export interface ActorUser {
  name: string;
  username: string;
  image?: string;
}
