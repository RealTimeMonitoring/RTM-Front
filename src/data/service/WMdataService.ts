import WmData from "../../models/WmData";

const API_URL = 'http://192.168.0.144:9000/data';

export async function fetchCategories(offset:number): Promise<WmData[]> {
  try {
    const response = await fetch(`${API_URL}?offset=${offset+65}&limit=65`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar os dados');
    }

    const categories: WmData[] = await response.json();
    return categories;
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    throw error;
  }
}