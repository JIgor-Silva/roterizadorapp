import { Platform } from 'react-native';

export const PRIMARY_COLOR = '#007bff';
export const INPUT_COLOR = '#e9ecef';
export const THUMB_COLOR_ON = Platform.OS === 'android' ? '#f4f3f4' : '#ffffff';
export const THUMB_COLOR_OFF = Platform.OS === 'android' ? '#f4f3f4' : '#ffffff';
