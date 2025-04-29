import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Avatar, Title, Caption, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawerContent = (props) => {
  const { signOut } = props;
  const theme = useTheme();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={{
              uri: 'https://ui-avatars.com/api/?name=Admin&background=2196F3&color=fff',
            }}
            size={50}
          />
          <Title style={styles.title}>Admin</Title>
          <Caption style={styles.caption}>admin@logitrack.com</Caption>
        </View>

        <DrawerItemList {...props} />

        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sair"
          onPress={signOut}
          style={styles.logoutButton}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
  },
  title: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  logoutButton: {
    marginTop: 'auto',
  },
});

export default CustomDrawerContent; 