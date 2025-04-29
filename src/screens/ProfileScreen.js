import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../App';

const ProfileScreen = () => {
   const { signOut } = useContext(AuthContext);
   const [userData, setUserData] = React.useState({ name: 'Usuário', username: '' });

   React.useEffect(() => {
      const getUserData = async () => {
         try {
            const userDataString = await AsyncStorage.getItem('user_data');
            if (userDataString) {
               const userData = JSON.parse(userDataString);
               setUserData(userData);
            }
         } catch (e) {
            console.log('Erro ao recuperar dados do usuário', e);
         }
      };

      getUserData();
   }, []);

   const handleLogout = () => {
      signOut();
   };

   return (
      <View style={styles.container}>
         <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
               <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
            </View>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userRole}>Administrador</Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações da Conta</Text>
            <View style={styles.infoCard}>
               <View style={styles.infoItem}>
                  <Ionicons name="person" size={20} color="#3498db" />
                  <View style={styles.infoContent}>
                     <Text style={styles.infoLabel}>Nome de Usuário</Text>
                     <Text style={styles.infoValue}>{userData.username || 'admin'}</Text>
                  </View>
               </View>
               <View style={styles.infoItem}>
                  <Ionicons name="mail" size={20} color="#3498db" />
                  <View style={styles.infoContent}>
                     <Text style={styles.infoLabel}>Email</Text>
                     <Text style={styles.infoValue}>admin@logitrack.com</Text>
                  </View>
               </View>
               <View style={styles.infoItem}>
                  <Ionicons name="call" size={20} color="#3498db" />
                  <View style={styles.infoContent}>
                     <Text style={styles.infoLabel}>Telefone</Text>
                     <Text style={styles.infoValue}>(11) 99999-9999</Text>
                  </View>
               </View>
            </View>
         </View>

         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferências</Text>
            <View style={styles.infoCard}>
               <TouchableOpacity style={styles.menuItem}>
                  <Ionicons name="notifications" size={20} color="#3498db" />
                  <Text style={styles.menuItemText}>Notificações</Text>
                  <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.menuItem}>
                  <Ionicons name="lock-closed" size={20} color="#3498db" />
                  <Text style={styles.menuItemText}>Segurança</Text>
                  <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.menuItem}>
                  <Ionicons name="language" size={20} color="#3498db" />
                  <Text style={styles.menuItemText}>Idioma</Text>
                  <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
               </TouchableOpacity>
            </View>
         </View>

         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="white" />
            <Text style={styles.logoutButtonText}>Sair</Text>
         </TouchableOpacity>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 16,
   },
   profileHeader: {
      alignItems: 'center',
      marginBottom: 24,
   },
   avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#3498db',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
   },
   avatarText: {
      fontSize: 40,
      fontWeight: 'bold',
      color: 'white',
   },
   userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2c3e50',
   },
   userRole: {
      fontSize: 16,
      color: '#7f8c8d',
      marginTop: 4,
   },
   section: {
      marginBottom: 24,
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
   infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
   },
   infoContent: {
      marginLeft: 12,
      flex: 1,
   },
   infoLabel: {
      fontSize: 14,
      color: '#7f8c8d',
   },
   infoValue: {
      fontSize: 16,
      color: '#2c3e50',
      fontWeight: '500',
   },
   menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
   },
   menuItemText: {
      fontSize: 16,
      color: '#2c3e50',
      marginLeft: 12,
      flex: 1,
   },
   logoutButton: {
      backgroundColor: '#e74c3c',
      borderRadius: 8,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
   },
   logoutButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
      marginLeft: 8,
   },
});

export default ProfileScreen;