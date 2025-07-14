import { ToastConfig } from 'react-native-toast-message';

export type ToastOptions = {
    description?: string;
    duration?: number;
    action?: {
        label: string;
        onPress: () => void;
    };
};

export interface CustomToastProps {
  text1?: string;
  text2?: string;
  props?: any; // This will be refined if we have a more specific type for props from react-native-toast-message
}
