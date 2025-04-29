const API_URL = 'http://localhost:8080/api';

// // Dados mockados para caso a API falhe
// const mockRobots = [
//   { id: 1, nome: 'R2-D2', status: 'ATIVO', bateria: 87, localizacao: 'Setor A', ultimaManutencao: '2025-04-15' },
//   { id: 2, nome: 'C-3PO', status: 'INATIVO', bateria: 23, localizacao: 'Setor B', ultimaManutencao: '2025-03-22' },
//   { id: 3, nome: 'BB-8', status: 'EM_OPERACAO', bateria: 95, localizacao: 'Setor C', ultimaManutencao: '2025-04-25' },
//   { id: 4, nome: 'K-2SO', status: 'MANUTENCAO', bateria: 45, localizacao: 'Oficina', ultimaManutencao: '2025-04-10' },
//   { id: 5, nome: 'WALL-E', status: 'ATIVO', bateria: 78, localizacao: 'Setor D', ultimaManutencao: '2025-04-05' },
// ];

// export const getRobots = async () => {
//   try {
//     const response = await fetch(`${API_URL}/robos`);
//     if (!response.ok) {
//       throw new Error('Falha ao obter dados dos robôs');
//     }
//     return await response.json();
//   } catch (error) {
//     console.warn('Usando dados mockados devido a erro na API:', error);
//     return mockRobots;
//   }
// };

// export const getRobotById = async (id) => {
//   try {
//     const response = await fetch(`${API_URL}/robos/${id}`);
//     if (!response.ok) {
//       throw new Error('Falha ao obter dados do robô');
//     }
//     return await response.json();
//   } catch (error) {
//     console.warn('Usando dados mockados devido a erro na API:', error);
//     return mockRobots.find(robot => robot.id === parseInt(id));
//   }
// }; 


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