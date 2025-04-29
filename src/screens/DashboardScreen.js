import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, useTheme, ActivityIndicator } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { roboService, eventoService, entregaService } from '../services/api';
import { statusColors } from '../constants/theme';

const DashboardScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    robos: { ativo: 0, inativo: 0, manutencao: 0 },
    entregas: { pendente: 0, em_andamento: 0, concluida: 0, cancelada: 0, atrasada: 0 },
    alertas: [],
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [robos, eventos, entregas] = await Promise.all([
        roboService.getAll(),
        eventoService.getAlertasCriticos(),
        entregaService.getAll(),
      ]);

      const robosStats = robos.data.reduce((acc, robo) => {
        acc[robo.status.toLowerCase()]++;
        return acc;
      }, { ativo: 0, inativo: 0, manutencao: 0 });

      const entregasStats = entregas.data.reduce((acc, entrega) => {
        acc[entrega.status.toLowerCase()]++;
        return acc;
      }, { pendente: 0, em_andamento: 0, concluida: 0, cancelada: 0, atrasada: 0 });

      setStats({
        robos: robosStats,
        entregas: entregasStats,
        alertas: eventos.data,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const entregasData = [
    {
      name: 'Pendentes',
      population: stats.entregas.pendente,
      color: statusColors.PENDENTE,
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Em Andamento',
      population: stats.entregas.em_andamento,
      color: statusColors.EM_ANDAMENTO,
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Concluídas',
      population: stats.entregas.concluida,
      color: statusColors.CONCLUIDA,
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Canceladas',
      population: stats.entregas.cancelada,
      color: statusColors.CANCELADA,
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Atrasadas',
      population: stats.entregas.atrasada,
      color: statusColors.ATRASADA,
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title>Status dos Robôs</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Paragraph style={[styles.statValue, { color: statusColors.ATIVO }]}>
                {stats.robos.ativo}
              </Paragraph>
              <Paragraph>Ativos</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={[styles.statValue, { color: statusColors.INATIVO }]}>
                {stats.robos.inativo}
              </Paragraph>
              <Paragraph>Inativos</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={[styles.statValue, { color: statusColors.MANUTENCAO }]}>
                {stats.robos.manutencao}
              </Paragraph>
              <Paragraph>Manutenção</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Status das Entregas</Title>
          <PieChart
            data={entregasData}
            width={300}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Alertas Críticos</Title>
          {stats.alertas.map((alerta, index) => (
            <View key={index} style={styles.alertItem}>
              <Paragraph style={styles.alertTitle}>
                Robô {alerta.robo.codigo} - {alerta.tipoSensor}
              </Paragraph>
              <Paragraph style={styles.alertMessage}>{alerta.leitura}</Paragraph>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  alertItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#fff3f3',
    borderRadius: 4,
  },
  alertTitle: {
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  alertMessage: {
    color: '#666',
  },
});

export default DashboardScreen; 