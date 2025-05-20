import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRobots } from '../services/robotService';

const RobotListScreen = ({ navigation }) => {
  const [robots, setRobots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRobots();
  }, []);

  const loadRobots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRobots();
      setRobots(data);
    } catch (err) {
      setError(err.message || 'Falha ao carregar os robôs. Verifique se o backend está rodando.');
      console.error(err);

      // Mostrar alerta para o usuário
      Alert.alert(
        "Erro de Conexão",
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080/api",
        [
          { text: "OK" },
          {
            text: "Tentar Novamente",
            onPress: () => loadRobots()
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadRobots();
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ATIVO':
        return '#27ae60';
      case 'INATIVO':
        return '#e74c3c';
      case 'EM_OPERACAO':
        return '#3498db';
      case 'MANUTENCAO':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ATIVO':
        return 'Ativo';
      case 'INATIVO':
        return 'Inativo';
      case 'EM_OPERACAO':
        return 'Em Operação';
      case 'MANUTENCAO':
        return 'Em Manutenção';
      default:
        return status;
    }
  };

  const renderRobotItem = ({ item }) => (
    <TouchableOpacity
      style={styles.robotItem}
      onPress={() => navigation.navigate('Detalhes do Robô', { robotId: item.id })}
    >
      <View style={styles.robotInfo}>
        <Text style={styles.robotName}>{item.nome}</Text>
        <View style={styles.robotDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={16} color="#7f8c8d" />
            <Text style={styles.detailText}>{item.localizacao}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="battery-half" size={16} color="#7f8c8d" />
            <Text style={styles.detailText}>{item.bateria}%</Text>
          </View>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando robôs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadRobots}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={robots}
        renderItem={renderRobotItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color="#95a5a6" />
            <Text style={styles.emptyText}>Nenhum robô encontrado</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  robotItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  robotInfo: {
    flex: 1,
  },
  robotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  robotDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 4,
    color: '#7f8c8d',
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default RobotListScreen;