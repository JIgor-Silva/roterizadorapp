import React, { createContext, useContext } from 'react';
import { View, Text, StyleSheet, type ViewProps, type TextProps } from 'react-native';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import { styles } from './Form.styles';
import { themeColors } from '../../styles/theme';
import {
  FormProps,
  FormFieldContextValue,
  FormItemContextValue,
  FormControlProps,
  SimpleComponentProps,
} from './Form.types';

// --- Componentes ---
const Form = FormProvider;

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    ...fieldState,
  };
};

const FormItem = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View ref={ref} style={[styles.formItem, style]} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<Text, TextProps>(({ style, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <Text
      ref={ref}
      style={[styles.formLabel, !!error && styles.formLabelError, style]}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = ({ children }: FormControlProps) => {
  const { error } = useFormField();

  return React.cloneElement(children, {
    accessibilityState: { ...(children.props.accessibilityState || {}), invalid: !!error },
    style: [children.props.style, !!error && styles.formControlError],
  });
};
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<Text, TextProps>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.formDescription, style]} {...props} />
));
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<Text, TextProps>(
  ({ style, children, ...props }, ref) => {
    const { error } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <Text ref={ref} style={[styles.formMessage, style]} {...props}>
        {body}
      </Text>
    );
  }
);
FormMessage.displayName = 'FormMessage';

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
