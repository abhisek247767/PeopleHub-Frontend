export interface ILoginResponse {
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
      role: string; // Added role field
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