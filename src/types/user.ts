export type TUserFull = TCreateUser & {
    userId: bigint;
  };
  
  export type TUserFullWithToken = TUserFull & {
    userRefreshToken: string;
  };
  
  export type TCreateUser = TLoginUser & {
    userLogin: string;
  };
  
  export type TLoginUser = {
    userPassword: string;
    userEmail: string;
  };
  
  export type TUserWithTokens = TUserWithRefreshToken & {
    accessToken: string;
  };
  
  export type TUserWithRefreshToken = {
    userId: bigint;
    refreshToken: string | null;
  };
  
  export type TUserCtx = {
    id: string;
    email: string;
  };
  
  export type TAuth = {
    accessToken: string;
    refreshToken: string;
  };

  export type TUserInsertedDb = {
    userPassword: string;
    userEmail: string;
    userLogin: string;
    userId: bigint;
  };