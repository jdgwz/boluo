import { SpaceWithMember } from './spaces';
import { ChannelWithMember } from './channels';
import { Id } from '@/utils/id';

export interface User {
  id: Id;
  username: string;
  nickname: string;
  bio: string;
  joined: number;
  deactivated: boolean;
  avatarId: Id | null;
}

export interface GetMe {
  user: User;
  mySpaces: SpaceWithMember[];
  myChannels: ChannelWithMember[];
}

export interface EditUser {
  nickname?: string;
  bio?: string;
}

export interface RegisterData {
  username: string;
  nickname: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResult {
  me: GetMe;
  token: null;
}

export interface CheckEmail {
  email: string;
}

export interface CheckUsername {
  username: string;
}
