import React from 'react';
import { View } from 'react-native';
import { 
  Calendar as RNCFCalendar, 
  CalendarProps as RNCalendarProps, 
  LocaleConfig,
} from 'react-native-calendars';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { themeColors } from '../../styles/theme';
import { CalendarProps } from './Calendar.types';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

type CalendarTheme = NonNullable<React.ComponentProps<typeof RNCFCalendar>['theme']>;

const calendarTheme: CalendarTheme = {
  backgroundColor: themeColors.background,
  calendarBackground: themeColors.background,
  textSectionTitleColor: themeColors.mutedForeground,
  selectedDayBackgroundColor: themeColors.primary,
  selectedDayTextColor: themeColors.primaryForeground,
  todayTextColor: themeColors.accentForeground,
  todayBackgroundColor: themeColors.accent,
  dayTextColor: themeColors.primary,
  textDisabledColor: themeColors.mutedForeground,
  dotColor: themeColors.primary,
  selectedDotColor: themeColors.primaryForeground,
  arrowColor: themeColors.primary,
  disabledArrowColor: themeColors.mutedForeground,
  monthTextColor: themeColors.primary,
  indicatorColor: themeColors.primary,
  textDayFontWeight: '400',
  textMonthFontWeight: '600',
  textDayHeaderFontWeight: '500',
  textDayFontSize: 14,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 12,
};

function Calendar({
  style,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <View style={style}>
      <RNCFCalendar
        hideExtraDays={!showOutsideDays}
        {...props}
        theme={calendarTheme}
        renderArrow={(direction: 'left' | 'right') => 
          direction === 'left' ? (
            <ChevronLeft size={20} color={themeColors.primary} />
          ) : (
            <ChevronRight size={20} color={themeColors.primary} />
          )
        }
      />
    </View>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
