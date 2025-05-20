import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRobots } from '../services/robotService';

const DashboardScreen = ({ navigation }) => {
  const [robotStats, setRobotStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    maintenance: 0,
    inOperation: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const robots = await getRobots();

      // Calcular estatísticas
      const stats = {
        total: robots.length,
        active: robots.filter(r => r.status === 'ATIVO').length,
        inactive: robots.filter(r => r.status === 'INATIVO').length,
        maintenance: robots.filter(r => r.status === 'MANUTENCAO').length,
        inOperation: robots.filter(r => r.status === 'EM_OPERACAO').length
      };

      setRobotStats(stats);
    } catch (err) {
      setError(err.message || 'Falha ao carregar dados do dashboard. Verifique se o backend está rodando.');
      console.error(err);

      // Mostrar alerta para o usuário
      Alert.alert(
        "Erro de Conexão",
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080/api",
        [
          { text: "OK" },
          {
            text: "Tentar Novamente",
            onPress: () => loadDashboardData()
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDashboardData}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Visão geral do sistema</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="hardware-chip" size={24} color="#3498db" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{robotStats.total}</Text>
            <Text style={styles.statLabel}>Total de Robôs</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#27ae60' }]}>
            <Ionicons name="checkmark-circle" size={24} color="white" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{robotStats.active}</Text>
            <Text style={styles.statLabel}>Ativos</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#e74c3c' }]}>
            <Ionicons name="close-circle" size={24} color="white" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{robotStats.inactive}</Text>
            <Text style={styles.statLabel}>Inativos</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#f39c12' }]}>
            <Ionicons name="construct" size={24} color="white" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{robotStats.maintenance}</Text>
            <Text style={styles.statLabel}>Em Manutenção</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#3498db' }]}>
            <Ionicons name="cog" size={24} color="white" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{robotStats.inOperation}</Text>
            <Text style={styles.statLabel}>Em Operação</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Robôs')}
          >
            <Ionicons name="list" size={24} color="white" />
            <Text style={styles.actionButtonText}>Ver Todos os Robôs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Ionicons name="add-circle" size={24} color="white" />
            <Text style={styles.actionButtonText}>Adicionar Novo Robô</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.tertiaryButton]}>
            <Ionicons name="analytics" size={24} color="white" />
            <Text style={styles.actionButtonText}>Relatórios</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  section: {
    marginTop: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'column',
  },
  actionButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
  },
  tertiaryButton: {
    backgroundColor: '#9b59b6',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
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
});

export default DashboardScreen;