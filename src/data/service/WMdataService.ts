import WmData from '../models/WmData';
import WmFormFilds from '../models/WmFormFields';
import fetchWithTimeout from './FetchWithTimeout';
import { storageService } from '../../utils/Storage';
import { API_URL } from '../../utils/Util';

export type HeatmapFilterProps = {
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  status?: 'OPEN' | 'CLOSED';
};

export async function fetchDataOffset(
  page: number,
  { categoryId, startDate, endDate, status }: HeatmapFilterProps
): Promise<WmData[]> {
  try {
    const auth = JSON.parse((await storageService.getItem('activeUser')) ?? '');

    let stringFilter = undefined;

    if (categoryId || startDate || endDate || status) {
      stringFilter = `&${categoryId ? `category=${categoryId}` : ''}&${
        startDate ? `startDate=${startDate}` : ''
      }&${endDate ? `endDate=${endDate}` : ''}&${
        status ? `status=${status}` : ''
      }`;
    }

    const response = await fetch(
      `${API_URL}/data/offset?page=${page}&size=65${stringFilter}`,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar os dados');
    }

    const data: WmData[] = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    throw error;
  }
}

export async function fetchData(): Promise<WmData[]> {
  try {
    const auth = JSON.parse((await storageService.getItem('activeUser')) ?? '');

    const response = await fetch(`${API_URL}/data/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth?.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar os dados');
    }

    const data: WmData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    throw error;
  }
}

export async function fetchPermittedData({
  categoryId,
  startDate,
  endDate,
  status,
}: HeatmapFilterProps): Promise<WmData[]> {
  try {
    let stringFilter = undefined;

    if (categoryId || startDate || endDate || status) {
      stringFilter = `?${categoryId ? `category=${categoryId}` : ''}&${
        startDate ? `startDate=${startDate}` : ''
      }&${endDate ? `endDate=${endDate}` : ''}&${
        status ? `status=${status}` : ''
      }`;
    }

    const response = await fetch(
      `${API_URL}/data/permit${stringFilter ? stringFilter : ''}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar os dados');
    }

    const data: WmData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    throw error;
  }
}

export async function syncData(
  setModalVisible: (visible: boolean) => void,
  setModalContent: (content: { title: string; message: string }) => void,
  token: string
): Promise<void> {
  const auth = JSON.parse((await storageService.getItem('activeUser')) ?? '');
  try {
    const response = await fetchWithTimeout(
      `${API_URL}/sync`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      },
      100000
    );

    if (response.status !== 200) {
      throw new Error('Erro ao sincronizar os dados');
    }

    setModalContent({
      title: 'Sucesso',
      message: 'Dados sincronizados com sucesso',
    });
    setModalVisible(true);
  } catch (error) {
    setModalContent({
      title: 'Erro',
      message: 'Não foi possível sincronizar os dados. Tente novamente.',
    });
    setModalVisible(true);

    throw error;
  }
}

export async function sendData(data: WmFormFilds): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/data/permit`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status !== 201) {
          throw new Error('Erro ao enviar os dados');
        }

        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function updateData(data: WmData): Promise<void> {
  const auth = JSON.parse((await storageService.getItem('activeUser')) ?? '');

  return new Promise((resolve, reject) => {
    console.log('Data:', JSON.stringify(data));
    fetch(`${API_URL}/data`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth?.token}`,
      },
      body: JSON.stringify({ ...data, productId: data.category?.id }),
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Erro ao enviar os dados');
        }

        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
