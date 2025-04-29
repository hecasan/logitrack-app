import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Searchbar,
  Chip,
  Button,
  useTheme,
  ActivityIndicator,
  Portal,
  Modal,
} from 'react-native-paper';
import { entregaService } from '../services/api';
import { statusColors } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EntregasScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [entregas, setEntregas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedEntrega, setSelectedEntrega] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadEntregas = async () => {
    try {
      setLoading(true);
      const response = await entregaService.getAll();
      setEntregas(response.data);
    } catch (error) {
      console.error('Erro ao carregar entregas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntregas();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadEntregas().then(() => setRefreshing(false));
  }, []);

  const filteredEntregas = entregas.filter((entrega) => {
    const matchesSearch = entrega.codigoPedido
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || entrega.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (entregaId, newStatus) => {
    try {
      await entregaService.updateStatus(entregaId, newStatus);
      loadEntregas();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDENTE':
        return 'clock-outline';
      case 'EM_ANDAMENTO':
        return 'truck-delivery';
      case 'CONCLUIDA':
        return 'check-circle';
      case 'CANCELADA':
        return 'cancel';
      case 'ATRASADA':
        return 'alert';
      default:
        return 'help-circle';
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
        placeholder="Buscar pedidos..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView
        horizontal
        style={styles.statusFilter}
        showsHorizontalScrollIndicator={false}
      >
        <Chip
          selected={!selectedStatus}
          onPress={() => setSelectedStatus(null)}
          style={styles.chip}
        >
          Todos
        </Chip>
        <Chip
          selected={selectedStatus === 'PENDENTE'}
          onPress={() => setSelectedStatus('PENDENTE')}
          style={[styles.chip, { backgroundColor: statusColors.PENDENTE }]}
        >
          Pendentes
        </Chip>
        <Chip
          selected={selectedStatus === 'EM_ANDAMENTO'}
          onPress={() => setSelectedStatus('EM_ANDAMENTO')}
          style={[styles.chip, { backgroundColor: statusColors.EM_ANDAMENTO }]}
        >
          Em Andamento
        </Chip>
        <Chip
          selected={selectedStatus === 'CONCLUIDA'}
          onPress={() => setSelectedStatus('CONCLUIDA')}
          style={[styles.chip, { backgroundColor: statusColors.CONCLUIDA }]}
        >
          Concluídas
        </Chip>
        <Chip
          selected={selectedStatus === 'CANCELADA'}
          onPress={() => setSelectedStatus('CANCELADA')}
          style={[styles.chip, { backgroundColor: statusColors.CANCELADA }]}
        >
          Canceladas
        </Chip>
        <Chip
          selected={selectedStatus === 'ATRASADA'}
          onPress={() => setSelectedStatus('ATRASADA')}
          style={[styles.chip, { backgroundColor: statusColors.ATRASADA }]}
        >
          Atrasadas
        </Chip>
      </ScrollView>

      <ScrollView
        style={styles.entregasList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredEntregas.map((entrega) => (
          <Card key={entrega.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <View style={styles.entregaInfo}>
                  <Icon
                    name={getStatusIcon(entrega.status)}
                    size={24}
                    color={statusColors[entrega.status]}
                  />
                  <Title style={styles.entregaTitle}>
                    Pedido {entrega.codigoPedido}
                  </Title>
                </View>
                <Chip
                  style={[
                    styles.statusChip,
                    { backgroundColor: statusColors[entrega.status] },
                  ]}
                >
                  {entrega.status}
                </Chip>
              </View>

              <View style={styles.infoRow}>
                <Paragraph style={styles.label}>Robô:</Paragraph>
                <Paragraph>{entrega.robo.codigo}</Paragraph>
              </View>

              <View style={styles.infoRow}>
                <Paragraph style={styles.label}>Origem:</Paragraph>
                <Paragraph>{entrega.origem}</Paragraph>
              </View>

              <View style={styles.infoRow}>
                <Paragraph style={styles.label}>Destino:</Paragraph>
                <Paragraph>{entrega.destino}</Paragraph>
              </View>

              <View style={styles.infoRow}>
                <Paragraph style={styles.label}>Distância:</Paragraph>
                <Paragraph>{entrega.distancia} km</Paragraph>
              </View>

              <View style={styles.infoRow}>
                <Paragraph style={styles.label}>Início:</Paragraph>
                <Paragraph>
                  {new Date(entrega.dataInicio).toLocaleString()}
                </Paragraph>
              </View>

              {entrega.dataFim && (
                <View style={styles.infoRow}>
                  <Paragraph style={styles.label}>Fim:</Paragraph>
                  <Paragraph>
                    {new Date(entrega.dataFim).toLocaleString()}
                  </Paragraph>
                </View>
              )}

              {entrega.observacoes && (
                <View style={styles.infoRow}>
                  <Paragraph style={styles.label}>Observações:</Paragraph>
                  <Paragraph>{entrega.observacoes}</Paragraph>
                </View>
              )}

              <View style={styles.actionsContainer}>
                {entrega.status === 'PENDENTE' && (
                  <Button
                    mode="contained"
                    onPress={() =>
                      handleStatusChange(entrega.id, 'EM_ANDAMENTO')
                    }
                  >
                    Iniciar Entrega
                  </Button>
                )}
                {entrega.status === 'EM_ANDAMENTO' && (
                  <Button
                    mode="contained"
                    onPress={() => handleStatusChange(entrega.id, 'CONCLUIDA')}
                  >
                    Concluir Entrega
                  </Button>
                )}
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
  statusFilter: {
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  entregasList: {
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
  entregaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entregaTitle: {
    marginLeft: 8,
  },
  statusChip: {
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginTop: 16,
  },
});

export default EntregasScreen; 