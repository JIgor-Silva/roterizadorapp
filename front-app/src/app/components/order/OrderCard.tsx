import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { Order } from '../../types';
import { OrderCardProps } from './OrderCard.types';
import { getStatusStyles } from './OrderCard.helpers';
import { styles } from './OrderCard.styles';

import { Card, CardHeader, CardContent } from '../card/Card';
import { Badge } from '../badge/Badge';

export const OrderCard = ({ order, onOrderSelect, onUpdateStatus }: OrderCardProps) => {
  if (!order || !order.id) {
    return (
      <Card style={[styles.glassEffect, styles.loadingCard]}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.textWhite}>Carregando pedido...</Text>
      </Card>
    );
  }

  const status = getStatusStyles(order);

  const handleAcceptOrder = () => {
    if (order.id) {
      onUpdateStatus(order.id, 'in_route');
    }
  };

  return (
    <Card style={[styles.glassEffect, styles.card]}>
      <CardHeader style={styles.cardHeader}>
        <View style={styles.left}>
          <Text style={styles.title}>Pedido #{order.id}</Text>
          <Badge variant={status.variant} style={{ marginTop: 6 }}>{status.text}</Badge>
        </View>
        <View style={styles.right}>
          <Text style={styles.total}>R$ {parseFloat(order.total)?.toFixed(2) ?? '0.00'}</Text>
          <View style={styles.deliveryTime}>
            <Feather name="clock" size={14} color="#fff" />
            <Text style={styles.deliveryText}>Chegada: {order.estimated_delivery}</Text>
          </View>
          {order.distance && (
            <View style={styles.deliveryTime}>
              <Feather name="map" size={14} color="#fff" />
              <Text style={styles.deliveryText}>Distância: {(order.distance / 1000).toFixed(2)} km</Text>
            </View>
          )}
        </View>
      </CardHeader>

      <CardContent style={styles.cardContent}>
        <View style={styles.row}>
          <Feather name="user" size={18} color="#34d399" />
          <View>
            <Text style={styles.textWhite}>{order.client.name}</Text>
            <Text style={styles.textWhite}>{order.client.phone}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Feather name="map-pin" size={18} color="#34d399" style={{ marginTop: 2 }} />
          <Text style={[styles.textWhite, { flex: 1 }]}>{order.address}</Text>
        </View>

        {(order.status === 'pending' || order.status === 'ready_for_pickup') && (
          <TouchableOpacity onPress={handleAcceptOrder}>
            <View style={styles.actionButton}>
              <View style={styles.actionButtonBg1} />
              <View style={styles.actionButtonBg2} />
              <Feather name="check-circle" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Aceitar Pedido</Text>
            </View>
          </TouchableOpacity>
        )}

        {(order.status === 'in_route' || order.status === 'delivered') && (
          <TouchableOpacity onPress={() => onOrderSelect(order)}>
            <View style={styles.actionButton}>
              <View style={styles.actionButtonBg1} />
              <View style={styles.actionButtonBg2} />
              <Feather name="navigation" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Ver Rota no Mapa</Text>
            </View>
          </TouchableOpacity>
        )}
      </CardContent>
    </Card>
  );
};

OrderCard.displayName = 'OrderCard';
