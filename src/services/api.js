import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Serviços para Robôs Logísticos
export const roboService = {
  getAll: () => api.get('/robos'),
  getById: (id) => api.get(`/robos/${id}`),
  updateStatus: (id, status) => api.put(`/robos/${id}/status`, { status }),
  updateLocalizacao: (id, localizacao) => api.put(`/robos/${id}/localizacao`, { localizacao }),
};

// Serviços para Eventos Sensoriais
export const eventoService = {
  getByRobo: (roboId) => api.get(`/eventos/robo/${roboId}`),
  getAlertasCriticos: () => api.get('/eventos/alertas'),
  getUltimasLeituras: (roboId) => api.get(`/eventos/robo/${roboId}/ultimas`),
};

// Serviços para Entregas Simuladas
export const entregaService = {
  getAll: () => api.get('/entregas'),
  getById: (id) => api.get(`/entregas/${id}`),
  updateStatus: (id, status) => api.put(`/entregas/${id}/status`, { status }),
  getEntregasDia: () => api.get('/entregas/dia'),
};

export default api; 