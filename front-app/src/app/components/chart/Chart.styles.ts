import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  tooltipShadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  textStyle: {
  }
});

export default styles;
