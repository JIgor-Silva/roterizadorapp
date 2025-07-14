import { ViewProps, TextProps } from 'react-native';
import {
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

export type SimpleComponentProps = {
  children: React.ReactNode;
};

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

export interface FormItemContextValue {
  id: string;
}

export interface FormControlProps {
  children: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
}

export interface FormProps {
  children: React.ReactNode;
}
