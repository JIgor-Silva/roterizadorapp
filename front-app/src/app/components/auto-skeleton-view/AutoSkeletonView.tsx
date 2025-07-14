import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../skeleton/Skeleton';
import { AutoSkeletonViewProps } from './AutoSkeletonView.types';
import { styles } from './AutoSkeletonView.styles';

const AutoSkeletonView: React.FC<AutoSkeletonViewProps> = ({ width = '100%', height = 16, style }) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      <Skeleton style={styles.skeleton} />
    </View>
  );
};

AutoSkeletonView.displayName = 'AutoSkeletonView';

export { AutoSkeletonView };
