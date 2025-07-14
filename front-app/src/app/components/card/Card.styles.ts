import { StyleSheet, Platform } from 'react-native';
import { themeColors } from '../../styles/theme';

const styles = StyleSheet.create({
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardTitleColor: {
    color: themeColors.cardForeground,
  },
  cardDescriptionColor: {
    color: themeColors.mutedForeground,
  },
  textStyle: {
  }
});

export default styles;
