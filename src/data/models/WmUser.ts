export type WmUser = {
  id: number;
  username: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'USER';
};
