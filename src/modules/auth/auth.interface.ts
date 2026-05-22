export interface IAuth {
  email: string;
  password: string;
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
  age?: number;
}