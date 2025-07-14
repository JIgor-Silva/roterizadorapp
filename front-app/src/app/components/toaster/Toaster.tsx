import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Toast, { BaseToast, ErrorToast, type ToastConfig } from 'react-native-toast-message';
import { X, CheckCircle, AlertCircle } from 'lucide-react-native';
import { themeColors, styles } from './Toaster.styles';
import { ToastOptions, CustomToastProps } from './Toaster.types';

const toastConfig: ToastConfig = {
  info: ({ text1, text2, props }) => (
    <BaseToast
      {...props}
      style={styles.toastContainer}
      contentContainerStyle={styles.content}
      text1Style={styles.title}
      text2Style={styles.description}
      text1={text1}
      text2={text2}
    />
  ),

  success: ({ text1, text2, props }) => (
    <BaseToast
      {...props}
      style={styles.toastContainer}
      contentContainerStyle={styles.content}
      text1Style={styles.title}
      text2Style={styles.description}
      text1={text1}
      text2={text2}
      renderLeadingIcon={() => <CheckCircle size={20} color={themeColors.success} style={styles.icon} />}
    />
  ),

  error: ({ text1, text2, props }) => (
    <ErrorToast
      {...props}
      style={[styles.toastContainer, styles.destructiveToast]}
      contentContainerStyle={styles.content}
      text1Style={[styles.title, styles.destructiveText]}
      text2Style={[styles.description, styles.destructiveText]}
      text1={text1}
      text2={text2}
      renderLeadingIcon={() => <AlertCircle size={20} color={themeColors.destructiveForeground} style={styles.icon} />}
    />
  ),
};

const Toaster = () => {
  return <Toast config={toastConfig} />;
};

const toast = (message: string, options?: ToastOptions) => {
    Toast.show({
        type: 'info',
        text1: message,
        text2: options?.description,
        visibilityTime: options?.duration || 4000,
        props: { action: options?.action }
    });
};

toast.success = (message: string, options?: ToastOptions) => {
    Toast.show({
        type: 'success',
        text1: message,
        text2: options?.description,
        visibilityTime: options?.duration || 4000,
    });
};

toast.error = (message: string, options?: ToastOptions) => {
    Toast.show({
        type: 'error',
        text1: message,
        text2: options?.description,
        visibilityTime: options?.duration || 4000,
    });
};

export { Toaster, toast };
