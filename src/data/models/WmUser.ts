export type WmUser = {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'USER';
};
