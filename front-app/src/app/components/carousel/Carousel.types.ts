import React from 'react';
import { 
  ViewProps, 
  type ViewToken,
  type PressableStateCallbackType,
  FlatList,
} from 'react-native';
import { ButtonProps } from '../button/Button.types';

export type CarouselContextProps = {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactNode;
  flatListRef: React.RefObject<FlatList<any> | null>;
  currentIndex: number;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation?: 'horizontal' | 'vertical';
  onViewableItemsChanged: (info: { viewableItems: Array<ViewToken> }) => void;
  viewabilityConfig: { itemVisiblePercentThreshold: number };
};

export type CarouselProps = {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
  className?: ViewProps['className'];
  style?: ViewProps['style'];
};

export interface CarouselItemProps extends ViewProps {}

export interface CarouselPreviousProps extends ButtonProps {}

export interface CarouselNextProps extends ButtonProps {}
