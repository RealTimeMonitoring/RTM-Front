import { WmCategory } from '../../models/WmCategory';

const API_URL = 'http://192.168.0.5:9000';

export async function fetchCategories(): Promise<WmCategory[]> {
  try {
    const response = await fetch(`${API_URL}/category`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar os dados');
    }

    const categories: WmCategory[] = await response.json();

    return categories;
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    throw error;
  }
}
