
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Order, OrderStatus } from '../../app/types/index';
import { User } from '../../app/context/AuthContext';

const StatCard = ({ icon, label, value, color, onPress }: { icon: any; label: string; value: string; color: string; onPress?: () => void }) => (
  <TouchableOpacity style={[styles.statCard, styles.glassEffect]} onPress={onPress} disabled={!onPress}>
    <Feather name={icon} size={22} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </TouchableOpacity>
);

interface DashboardStatsProps {
  user: User | null;
  orders: Order[];
  onSelectStatus: (status: OrderStatus | 'all') => void;
}

const DashboardStats = ({ user, orders, onSelectStatus }: DashboardStatsProps) => {
  if (!user) {
    return null;
  }

  const statsContainer = (
    <View style={styles.statsGrid}>
      {user.role === 'admin' ? (
        <>
          <StatCard icon="box" label="Pedidos Hoje" value={orders.length.toString()} color="#3b82f6" onPress={() => onSelectStatus('all')} />
          <StatCard icon="truck" label="Em Rota" value={orders.filter(o => o.status === 'in_route').length.toString()} color="#16a34a" onPress={() => onSelectStatus('in_route')} />
          <StatCard icon="alert-triangle" label="Atrasados" value={orders.filter(o => o.is_late).length.toString()} color="#ef4444" onPress={() => onSelectStatus('all')} />
        </>
      ) : (
        <>
          <StatCard icon="box" label="Cancelados" value={orders.filter(o => o.status === 'canceled').length.toString()} color="#ef4444" onPress={() => onSelectStatus('canceled')} />
          <StatCard icon="truck" label="Em Rota" value={orders.filter(o => o.status === 'in_route').length.toString()} color="#16a34a" onPress={() => onSelectStatus('in_route')} />
          <StatCard icon="check-circle" label="Entregues" value={orders.filter(o => o.status === 'delivered').length.toString()} color="#10b981" onPress={() => onSelectStatus('delivered')} />
        </>
      )}
    </View>
  );

  return statsContainer;
};

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    gap: 4,
    minHeight: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 5,
    borderRadius: 12,
    paddingHorizontal: 0,
  },
  statCard: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  statLabel: {
    fontSize: 9,
    color: '#9ca3af'
  },
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1
  },
});

export default DashboardStats;
