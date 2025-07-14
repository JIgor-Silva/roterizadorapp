import { ViewStyle, TextStyle } from 'react-native';

export const toastStyles: {
  base: ViewStyle;
  variants: {
    default: ViewStyle;
    destructive: ViewStyle;
  };
  textVariants: {
    default: {
      title: TextStyle;
      description: TextStyle;
    };
    destructive: {
      title: TextStyle;
      description: TextStyle;
    };
  };
  action: ViewStyle;
  actionText: TextStyle;
} = {
  base: {
    width: '90%',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  variants: {
    default: {
      backgroundColor: '#ffffff', 
      borderColor: '#e2e8f0', 
    },
    destructive: {
      backgroundColor: '#ef4444', 
      borderColor: '#dc2626', 
    },
  },
  textVariants: {
    default: {
      title: { color: '#020617' }, 
      description: { color: '#334155' },
    },
    destructive: {
      title: { color: '#ffffff' }, 
      description: { color: '#fecaca' },
    },
  },
  action: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionText: {
    fontWeight: '500',
    fontSize: 14,
  }
};
