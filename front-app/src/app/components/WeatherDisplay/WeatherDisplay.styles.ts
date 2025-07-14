import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  noDataText: {
    color: '#9ca3af',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  carouselContainer: {
    height: 85,
    paddingHorizontal: 16,
  },
  carouselContentContainer: {
    alignItems: 'center',
    paddingRight: 16,
  },
  carouselCard: {
    width: width - 48, 
    height: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContentCentered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    flexDirection: 'column',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  dayOfWeekText: {
    fontSize: 14,
    color: '#d1d5db',
    textTransform: 'capitalize',
  },
  descriptionText: {
    fontSize: 14,
    color: '#d1d5db',
    textTransform: 'capitalize',
  },
  precipitationText: {
    fontSize: 14,
    color: '#d1d5db',
  },
  iconContainer: {
    alignItems: 'center',
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  weatherIconLarge: {
    width: 40,
    height: 40,
  },
  temperatureText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardMainMetric: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardSecondaryMetric: {
    fontSize: 12,
    color: '#d1d5db',
  },
  cardSmallText: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
