// Mock de serviço de autenticação
const mockUsers = [
  { username: 'admin', password: 'admin123', name: 'Administrador' },
  { username: 'user', password: 'user123', name: 'Usuário Padrão' },
];

export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    // Simula um delay de rede
    setTimeout(() => {
      const user = mockUsers.find(
        user => user.username === username && user.password === password
      );
      
      if (user) {
        // Simula um token JWT
        const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
        resolve({
          user: { username: user.username, name: user.name },
          token
        });
      } else {
        reject({ message: 'Credenciais inválidas' });
      }
    }, 800);
  });
};

export const logout = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};
