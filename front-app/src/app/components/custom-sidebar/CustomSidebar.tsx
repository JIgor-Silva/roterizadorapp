// src/app/components/custom-sidebar/CustomSidebar.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Feather';
import { styles } from './CustomSidebar.styles';
import {
  SimpleComponentProps,
  SidebarMenuButtonProps,
  CustomSidebarProps,
} from './CustomSidebar.types';

type RootStackParamList = {
  [key: string]: undefined; // Permite qualquer nome de rota
};

export const SidebarHeader = ({ children }: SimpleComponentProps) => <View style={styles.header}>{children}</View>;
export const SidebarContent = ({ children }: SimpleComponentProps) => <ScrollView style={styles.content}>{children}</ScrollView>;
export const SidebarFooter = ({ children }: SimpleComponentProps) => <View style={styles.footer}>{children}</View>;

// --- Componentes de Menu ---
export const SidebarMenu = ({ children }: SimpleComponentProps) => <View style={styles.menu}>{children}</View>;
export const SidebarMenuItem = ({ children }: SimpleComponentProps) => <View style={styles.menuItem}>{children}</View>;

export const SidebarMenuButton = ({ routeName, label, iconName, isActive = false }: SidebarMenuButtonProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  return (
    <TouchableOpacity
      style={[styles.menuButton, isActive && styles.menuButtonActive]}
      onPress={() => navigation.navigate(routeName)}
    >
      {iconName && <Icon name={iconName} size={20} color={isActive ? '#FFF' : '#333'} />}
      <Text style={[styles.menuButtonText, isActive && styles.menuButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

export function CustomSidebar(props: CustomSidebarProps) {
  const { state } = props;
  const activeRouteName = state.routes[state.index].name;

  return (
    <View style={{ flex: 1 }}>
      <SidebarHeader>
        <Text style={styles.headerText}>Meu App</Text>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              routeName="Home"
              label="Início"
              iconName="home"
              isActive={activeRouteName === 'Home'}
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              routeName="Profile"
              label="Perfil"
              iconName="user"
              isActive={activeRouteName === 'Profile'}
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              routeName="Settings"
              label="Configurações"
              iconName="settings"
              isActive={activeRouteName === 'Settings'}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        {}
         <SidebarMenuButton
            routeName="Logout"
            label="Sair"
            iconName="log-out"
          />
      </SidebarFooter>
    </View>
  );
}
