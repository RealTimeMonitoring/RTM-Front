import WmData from "../../models/WmData";

const API_URL = "http://192.168.0.144:9000/data";

export async function fetchDataOffset(page: number): Promise<WmData[]> {
  try {
    const response = await fetch(`${API_URL}?page=${page}&size=65`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar os dados");
    }

    const data: WmData[] = await response.json();
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    throw error;
  }
}

export async function fetchData(): Promise<WmData[]> {
  try {
    const response = await fetch(`${API_URL}/all`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar os dados");
    }

    const data: WmData[] = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    throw error;
  }
}
