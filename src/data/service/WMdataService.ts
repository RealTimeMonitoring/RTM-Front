import { WmCategory } from "../../models/WmCategory";

const API_URL = 'http://192.168.0.144:9000/data';

export async function fetchCategories(offset:number): Promise<WmCategory[]> {
  try {
    const response = await fetch(`${API_URL}?offset=${offset+65}&limit=65`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('response:', response);
    if (!response.ok) {
      throw new Error('Erro ao buscar categorias');
    }

    const categories: WmCategory[] = await response.json();
    return categories;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
}