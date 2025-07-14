import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { toastStyles } from './Toast.styles';
import { CustomToastProps, ToastProviderProps, ToastComponentProps, ToastTitleProps, ToastDescriptionProps, ToastActionProps } from './Toast.types';

const CustomToast = ({ text1, text2, type, props, ...rest }: CustomToastProps) => {
  const variantStyles = toastStyles.variants[type || 'default'];
  const textVariantStyles = toastStyles.textVariants[type || 'default'];
  const { action } = props || {};

  return (
    <View style={[toastStyles.base, variantStyles]}>
      <View style={{ flex: 1 }}>
        {text1 && <Text style={[{ fontSize: 16, fontWeight: '600' }, textVariantStyles.title]}>{text1}</Text>}
        {text2 && <Text style={[{ fontSize: 14, marginTop: 4 }, textVariantStyles.description]}>{text2}</Text>}
      </View>
      {action && (
         <TouchableOpacity style={toastStyles.action} onPress={action.onPress}>
            <Text style={[toastStyles.actionText, textVariantStyles.title]}>{action.label}</Text>
         </TouchableOpacity>
      )}
    </View>
  );
};

export const toastConfig = {
  default: (props: any) => <CustomToast {...props} type="default" />,
  destructive: (props: any) => <CustomToast {...props} type="destructive" />,
};

export const ToastProvider = ({ children }: ToastProviderProps) => <>{children}</>;
export const Toast = ({ children }: ToastComponentProps) => <View>{children}</View>;
export const ToastTitle = ({ children }: ToastTitleProps) => <Text>{children}</Text>;
export const ToastDescription = ({ children }: ToastDescriptionProps) => <Text>{children}</Text>;
export const ToastAction = ({ children }: ToastActionProps) => <TouchableOpacity>{children}</TouchableOpacity>;
export const ToastClose = () => <Icon name="x" size={18} />;
