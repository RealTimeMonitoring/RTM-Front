import { WmCategory } from "../models/WmCategory";
import { storageService } from "../../utils/Storage";
import { API_URL } from "../../utils/Util";


export async function fetchCategories(): Promise<WmCategory[]> {
  try {
    const auth = JSON.parse(await storageService.getItem('activeUser') ?? '');

    const response = await fetch(`${API_URL}/category`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth?.token}`,
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

export async function fetchHeatmapCategories(): Promise<WmCategory[]> {
  try {
    const response = await fetch(`${API_URL}/category/heatmap`, {
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
