export interface AuthUserType {
  uid: string;
  name: string;
  isOnline: boolean;
  avatarURL?: string;
  avatarPath?: string;
  age?: number;
  email: string;
  experience?: string;
  useLanguage?: Array<string>;
  willLanguage?: Array<string>;
  createdAt: Date;
}
