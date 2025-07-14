import { CalendarProps as RNCalendarProps } from 'react-native-calendars';

export type CalendarProps = RNCalendarProps & {
  showOutsideDays?: boolean;
};
