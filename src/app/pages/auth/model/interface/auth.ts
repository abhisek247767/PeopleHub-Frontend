export interface ILoginResponse {
<<<<<<< HEAD
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
      role: string; // Added role field
    };
  }
=======
  token: string;
  user: {
    role(arg0: string, role: any): unknown;
    id: string;
    email: string;
    username: string;
  };
}
>>>>>>> 7c1d7ed1a535e8f43bfe96ec95a1f870038eb06e

export interface IRegisterationResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}
