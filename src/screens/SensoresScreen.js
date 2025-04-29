import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Searchbar,
  Chip,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { eventoService } from '../services/api';
import { statusColors } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SensoresScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTipo, setSelectedTipo] = useState(null);

  const tiposSensor = [
    'Proximidade',
    'Temperatura',
    'Umidade',
    'Movimento',
    'Peso',
    'Obstáculo',
    'Luminosidade',
  ];

  const loadEventos = async () => {
    try {
      setLoading(true);
      const response = await eventoService.getAlertasCriticos();
      setEventos(response.data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventos();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadEventos().then(() => setRefreshing(false));
  }, []);

  const filteredEventos = eventos.filter((evento) => {
    const matchesSearch = evento.robo.codigo
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTipo = !selectedTipo || evento.tipoSensor === selectedTipo;
    return matchesSearch && matchesTipo;
  });

  const getSensorIcon = (tipo) => {
    switch (tipo) {
      case 'Proximidade':
        return 'ruler';
      case 'Temperatura':
        return 'thermometer';
      case 'Umidade':
        return 'water';
      case 'Movimento':
        return 'motion-sensor';
      case 'Peso':
        return 'scale';
      case 'Obstáculo':
        return 'alert-octagon';
      case 'Luminosidade':
        return 'lightbulb';
      default:
        return 'alert';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NORMAL':
        return statusColors.NORMAL;
      case 'ALERTA':
        return statusColors.ALERTA;
      case 'CRITICO':
        return statusColors.CRITICO;
      case 'MANUTENCAO':
        return statusColors.MANUTENCAO;
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar robôs..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView
        horizontal
        style={styles.tipoFilter}
        showsHorizontalScrollIndicator={false}
      >
        <Chip
          selected={!selectedTipo}
          onPress={() => setSelectedTipo(null)}
          style={styles.chip}
        >
          Todos
        </Chip>
        {tiposSensor.map((tipo) => (
          <Chip
            key={tipo}
            selected={selectedTipo === tipo}
            onPress={() => setSelectedTipo(tipo)}
            style={styles.chip}
          >
            {tipo}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.eventosList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredEventos.map((evento) => (
          <Card key={evento.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <View style={styles.sensorInfo}>
                  <Icon
                    name={getSensorIcon(evento.tipoSensor)}
                    size={24}
                    color={getStatusColor(evento.status)}
                  />
                  <Title style={styles.sensorTitle}>{evento.tipoSensor}</Title>
                </View>
                <Chip
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(evento.status) },
                  ]}
                >
                  {evento.status}
                </Chip>
              </View>
              <Paragraph>Robô: {evento.robo.codigo}</Paragraph>
              <Paragraph>Leitura: {evento.leitura}</Paragraph>
              <Paragraph>
                Data: {new Date(evento.dataHora).toLocaleString()}
              </Paragraph>
              <Paragraph>Localização: {evento.localizacao}</Paragraph>

              {/* Gráfico de linha para histórico de leituras */}
              <View style={styles.chartContainer}>
                <LineChart
                  data={{
                    labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
                    datasets: [
                      {
                        data: [20, 45, 28, 80, 99, 43],
                      },
                    ],
                  }}
                  width={Dimensions.get('window').width - 60}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
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
  searchBar: {
    marginBottom: 16,
  },
  tipoFilter: {
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  eventosList: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sensorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sensorTitle: {
    marginLeft: 8,
  },
  statusChip: {
    marginLeft: 8,
  },
  chartContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default SensoresScreen; 