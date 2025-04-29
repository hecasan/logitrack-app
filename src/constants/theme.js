import { DefaultTheme } from 'react-native-paper';

export const colors = {
  primary: '#2196F3',
  secondary: '#03DAC6',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#B00020',
  text: '#000000',
  onSurface: '#000000',
  disabled: '#9E9E9E',
  placeholder: '#9E9E9E',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  notification: '#FF0000',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.text,
    onSurface: colors.onSurface,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    backdrop: colors.backdrop,
    notification: colors.notification,
  },
  roundness: 8,
};

export const statusColors = {
  ATIVO: '#4CAF50',
  INATIVO: '#9E9E9E',
  MANUTENCAO: '#FFC107',
  NORMAL: '#4CAF50',
  ALERTA: '#FFC107',
  CRITICO: '#F44336',
  PENDENTE: '#9E9E9E',
  EM_ANDAMENTO: '#2196F3',
  CONCLUIDA: '#4CAF50',
  CANCELADA: '#F44336',
  ATRASADA: '#FF5722',
}; 