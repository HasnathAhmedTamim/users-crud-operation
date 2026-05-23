export interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
  is_active?: boolean;
  // add role admin , user , agent task
  role?: string;
}
