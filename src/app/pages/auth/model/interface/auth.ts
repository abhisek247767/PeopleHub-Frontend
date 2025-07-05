export interface ILoginResponse {
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
    };
  }

export interface IRegisterationResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
  }
}