import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tickerTitle: {
    color: 'white', 
    fontWeight: 'bold', 
    marginHorizontal: 5,
    fontSize: 20,
  },
  rankContainer: {
    backgroundColor: '#585858',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  tickerRank: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 15,
  },
});

export default styles;