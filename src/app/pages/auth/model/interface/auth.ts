export interface ILoginResponse {
  token: string;
  user: {
    role(arg0: string, role: any): unknown;
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
  };
}
