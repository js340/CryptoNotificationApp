import React from 'react';
import styles from './styles';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWatchlist } from '../../../../contexts/WatchlistContext';

const CoinDetailHeader = (props) => {
  const {
    coinId,
    image,
    symbol,
    market_cap_rank,
  } = props;

  const navigation = useNavigation();

  const { watchlistCoinIds, storeWatchlistCoinId, removeWatchlistCoinId } = useWatchlist();

  const checkIfCoinIsWatchlisted = () => watchlistCoinIds.some((coinIdValue) => coinIdValue === coinId);

  const andleWatchlistCoin = () => {
    if (checkIfCoinIsWatchlisted()) {
      return removeWatchlistCoinId(coinId);
    }
    return storeWatchlistCoinId(coinId);
  };

  return (
    <View style={styles.headerContainer}>
      <Ionicons
        name="chevron-back-sharp"
        size={30}
        color="white"
        onPress={() => navigation.goBack()}
      />
      <View style={styles.tickerContainer}>
        <Image source={{ url: image }} style={{ width: 25, height: 25 }} />
        <Text style={styles.tickerTitle}>{symbol.toUpperCase()}</Text>
        <View style={styles.rankContainer}>
          <Text style={styles.tickerRank}>#{market_cap_rank}</Text>
        </View>
      </View>
      <FontAwesome 
        name={checkIfCoinIsWatchlisted() ? "star" : "star-o"} 
        size={25} 
        color={checkIfCoinIsWatchlisted() ? "#ffbf00" : "white"}
        onPress={andleWatchlistCoin} 
      />
    </View>
  );
};

export default CoinDetailHeader;