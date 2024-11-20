import WmData from '../models/WmData';
import WmFormFilds from '../models/WmFormFields';
import fetchWithTimeout from './FetchWithTimeout';

const API_URL = 'http://192.168.0.5:9000/data';

export async function fetchDataOffset(page: number): Promise<WmData[]> {
  try {
    const auth = JSON.parse(localStorage.getItem('activeUser') ?? '');

    const response = await fetch(`${API_URL}/offset?page=${page}&size=65`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth?.token}`,
      }),
      mode: 'no-cors',
    });

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
    const auth = JSON.parse(localStorage.getItem('activeUser') ?? '');

    const response = await fetch(`${API_URL}/all`, {
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

export async function fetchHeatmapData(): Promise<WmData[]> {
  try {
    const response = await fetch(`${API_URL}/heatmap`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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

export async function syncData(
  setModalVisible: (visible: boolean) => void,
  setModalContent: (content: { title: string; message: string }) => void,
  token: string
): Promise<void> {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}/sync`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      10000
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

export function sendData(data: WmFormFilds): Promise<void> {
  const auth = JSON.parse(localStorage.getItem('activeUser') ?? '');

  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/data`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth?.token}`,
      },
      body: JSON.stringify(data),
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
