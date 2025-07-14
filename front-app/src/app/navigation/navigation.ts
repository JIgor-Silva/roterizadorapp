import type { Order } from '../types';

export type RootStackParamList = {
  Login: undefined;
  Orders: undefined;
  Map: { order: Order };
};
