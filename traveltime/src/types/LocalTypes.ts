import {User, UserWithNoPassword, TravelPost} from 'hybrid-types/DBTypes';

type Credentials = Pick<User, 'username' | 'password_hash'>;
type RegisterCredentials = Pick<User, 'username' | 'email' | 'password_hash'>;

type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
};

type PostWithOwner = TravelPost & Pick<User, 'username' | 'profile_picture'>;

export type {Credentials, RegisterCredentials, AuthContextType, PostWithOwner};
