const API_URL = 'http://localhost:8080/api';

export const getRobots = async () => {
  try {
    const response = await fetch(`${API_URL}/robos`);
    if (!response.ok) {
      throw new Error(`Falha ao obter dados dos robôs: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao conectar com o servidor:', error);
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080/api');
  }
};

export const getRobotById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/robos/${id}`);
    if (!response.ok) {
      throw new Error(`Falha ao obter dados do robô: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao conectar com o servidor:', error);
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080/api');
  }
};