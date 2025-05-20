import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   ActivityIndicator,
   TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRobotById } from '../services/robotService';

const RobotDetailScreen = ({ route, navigation }) => {
   const { robotId } = route.params;
   const [robot, setRobot] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      loadRobotDetails();
   }, [robotId]);

   // Modificar apenas a função loadRobotDetails no RobotDetailScreen.js
   const loadRobotDetails = async () => {
      try {
         setLoading(true);
         setError(null);
         const data = await getRobotById(robotId);
         setRobot(data);
      } catch (err) {
         setError(err.message || 'Falha ao carregar detalhes do robô. Verifique se o backend está rodando.');
         console.error(err);

         // Mostrar alerta para o usuário
         Alert.alert(
            "Erro de Conexão",
            "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080/api",
            [
               { text: "OK" },
               {
                  text: "Tentar Novamente",
                  onPress: () => loadRobotDetails()
               }
            ]
         );
      } finally {
         setLoading(false);
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

   if (loading) {
      return (
         <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Carregando detalhes...</Text>
         </View>
      );
   }

   if (error) {
      return (
         <View style={styles.centerContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadRobotDetails}>
               <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
         </View>
      );
   }

   if (!robot) {
      return (
         <View style={styles.centerContainer}>
            <Ionicons name="help-circle-outline" size={48} color="#95a5a6" />
            <Text style={styles.errorText}>Robô não encontrado</Text>
            <TouchableOpacity
               style={styles.retryButton}
               onPress={() => navigation.goBack()}
            >
               <Text style={styles.retryButtonText}>Voltar</Text>
            </TouchableOpacity>
         </View>
      );
   }

   return (
      <ScrollView style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.robotName}>{robot.nome}</Text>
            <View style={styles.statusContainer}>
               <View
                  style={[
                     styles.statusIndicator,
                     { backgroundColor: getStatusColor(robot.status) }
                  ]}
               />
               <Text style={styles.statusText}>{getStatusText(robot.status)}</Text>
            </View>
         </View>

         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Gerais</Text>
            <View style={styles.infoCard}>
               <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                     <Ionicons name="battery-half" size={24} color="#3498db" />
                     <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Bateria</Text>
                        <Text style={styles.infoValue}>{robot.bateria}%</Text>
                     </View>
                  </View>
                  <View style={styles.infoItem}>
                     <Ionicons name="location" size={24} color="#3498db" />
                     <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Localização</Text>
                        <Text style={styles.infoValue}>{robot.localizacao}</Text>
                     </View>
                  </View>
               </View>
               <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                     <Ionicons name="calendar" size={24} color="#3498db" />
                     <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Última Manutenção</Text>
                        <Text style={styles.infoValue}>{robot.ultimaManutencao}</Text>
                     </View>
                  </View>
                  <View style={styles.infoItem}>
                     <Ionicons name="id-card" size={24} color="#3498db" />
                     <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>ID</Text>
                        <Text style={styles.infoValue}>{robot.id}</Text>
                     </View>
                  </View>
               </View>
            </View>
         </View>

         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ações</Text>
            <View style={styles.actionsContainer}>
               <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="refresh" size={24} color="white" />
                  <Text style={styles.actionButtonText}>Atualizar Status</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                  <Ionicons name="construct" size={24} color="white" />
                  <Text style={styles.actionButtonText}>Agendar Manutenção</Text>
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
   robotName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 8,
   },
   statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   statusIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
   },
   statusText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#7f8c8d',
   },
   section: {
      marginTop: 20,
      paddingHorizontal: 16,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 12,
   },
   infoCard: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
   },
   infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
   },
   infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
   },
   infoTextContainer: {
      marginLeft: 12,
   },
   infoLabel: {
      fontSize: 12,
      color: '#7f8c8d',
   },
   infoValue: {
      fontSize: 16,
      fontWeight: '500',
      color: '#2c3e50',
   },
   actionsContainer: {
      flexDirection: 'column',
      marginBottom: 20,
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

export default RobotDetailScreen;