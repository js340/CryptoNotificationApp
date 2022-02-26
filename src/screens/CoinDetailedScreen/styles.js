import { StyleSheet } from "react-native";
import { backgroundColor, borderBottomColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const styles = StyleSheet.create({
  currentPrice: {
    color: 'white',
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: 1,
  },
  name: {
    color: 'white',
    fontSize: 15,
  },
  priceContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceChange: {
    color: 'white',
    fontSize: 17,
    fontWeight: '500',
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    width: 130,
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    padding: 10,
    fontSize: 16,
    color: 'white',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2b2b2b',
    paddingVertical: 5,
    borderRadius: 5,
    margin: 12,
  },
  filtersText: {
    color: 'white',
  },
  candleStickTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 20,
  },
  candleStickText: {
    color: 'white',
    fontWeight: '700',
  },
  candleStickTextLabel: {
    color: 'grey',
    fontSize: 13,
  }
});

export default styles;