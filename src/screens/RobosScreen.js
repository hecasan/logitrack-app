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
  TextInput,
} from 'react-native-paper';
import { roboService } from '../services/api';
import { statusColors } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RobosScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [robos, setRobos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedRobo, setSelectedRobo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [localizacao, setLocalizacao] = useState('');

  const loadRobos = async () => {
    try {
      setLoading(true);
      const response = await roboService.getAll();
      setRobos(response.data);
    } catch (error) {
      console.error('Erro ao carregar robôs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRobos();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadRobos().then(() => setRefreshing(false));
  }, []);

  const filteredRobos = robos.filter((robo) => {
    const matchesSearch = robo.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      robo.modelo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || robo.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (roboId, newStatus) => {
    try {
      await roboService.updateStatus(roboId, newStatus);
      loadRobos();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleLocalizacaoUpdate = async () => {
    try {
      await roboService.updateLocalizacao(selectedRobo.id, localizacao);
      setModalVisible(false);
      loadRobos();
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
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
          selected={selectedStatus === 'ATIVO'}
          onPress={() => setSelectedStatus('ATIVO')}
          style={[styles.chip, { backgroundColor: statusColors.ATIVO }]}
        >
          Ativos
        </Chip>
        <Chip
          selected={selectedStatus === 'INATIVO'}
          onPress={() => setSelectedStatus('INATIVO')}
          style={[styles.chip, { backgroundColor: statusColors.INATIVO }]}
        >
          Inativos
        </Chip>
        <Chip
          selected={selectedStatus === 'MANUTENCAO'}
          onPress={() => setSelectedStatus('MANUTENCAO')}
          style={[styles.chip, { backgroundColor: statusColors.MANUTENCAO }]}
        >
          Manutenção
        </Chip>
      </ScrollView>

      <ScrollView
        style={styles.robosList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredRobos.map((robo) => (
          <Card key={robo.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title>{robo.codigo}</Title>
                <Chip
                  style={[
                    styles.statusChip,
                    { backgroundColor: statusColors[robo.status] },
                  ]}
                >
                  {robo.status}
                </Chip>
              </View>
              <Paragraph>Modelo: {robo.modelo}</Paragraph>
              <Paragraph>Localização: {robo.localizacao}</Paragraph>
              <View style={styles.batteryContainer}>
                <Icon
                  name="battery"
                  size={24}
                  color={
                    robo.nivelBateria > 70
                      ? '#4CAF50'
                      : robo.nivelBateria > 30
                      ? '#FFC107'
                      : '#F44336'
                  }
                />
                <Paragraph>{robo.nivelBateria}%</Paragraph>
              </View>
              <View style={styles.actionsContainer}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setSelectedRobo(robo);
                    setLocalizacao(robo.localizacao);
                    setModalVisible(true);
                  }}
                >
                  Atualizar Localização
                </Button>
                <Button
                  mode="contained"
                  onPress={() =>
                    handleStatusChange(
                      robo.id,
                      robo.status === 'ATIVO' ? 'INATIVO' : 'ATIVO'
                    )
                  }
                >
                  {robo.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title>Atualizar Localização</Title>
          <TextInput
            label="Nova Localização"
            value={localizacao}
            onChangeText={setLocalizacao}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleLocalizacaoUpdate}>
            Salvar
          </Button>
        </Modal>
      </Portal>
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
  robosList: {
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
  statusChip: {
    marginLeft: 8,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
  },
});

export default RobosScreen; 