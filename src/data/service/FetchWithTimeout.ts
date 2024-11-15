export default async function fetchWithTimeout(
  resource: RequestInfo,
  options: RequestInit = {},
  timeout: number = 5000
): Promise<Response> {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, { ...options, signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (signal.aborted) {
      throw new Error("Tempo limite excedido para a solicitação.");
    }
    throw error;
  }
}
