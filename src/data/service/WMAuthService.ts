import { AuthProps } from '../../contexts/UserContext';
import { WmUser } from '../models/WmUser';

export type LoginProps = {
  loginEmail: string;
  password: string;
};

export type RegisterProps = {
  registerName: string;
  registerEmail: string;
  password: string;
};

const API_URL = 'http://192.168.0.5:9000';

export async function auth({
  loginEmail: email,
  password,
}: LoginProps): Promise<AuthProps> {
  try {
    const authLogin = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!authLogin.ok) {
      throw new Error('Erro ao logar');
    }

    const data: AuthProps = await authLogin.json();

    return data;
  } catch (error) {
    console.log('Erro ao logar:', error);
    throw error;
  }
}

export async function register({
  registerName: name,
  registerEmail: email,
  password,
}: RegisterProps): Promise<AuthProps> {
  try {
    const authRegister = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!authRegister.ok) {
      throw new Error('Erro ao registrar');
    }

    const data: AuthProps = await authRegister.json();

    return data;
  } catch (error) {
    console.log('Erro ao registrar:', error);
    throw error;
  }
}
