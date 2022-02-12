import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useWatchlist } from '../../contexts/WatchlistContext';
import CoinItem from '../../components/coinItem';
import { getWatchlistedCoins } from '../../services/requests' 

const WatchListScreen = () => {
  const {watchlistCoinIds} = useWatchlist();

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const transformCoinIds = () => watchlistCoinIds.join('%2C');

  const fetchWatchlistedCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const watchlistedCoinsData = await getWatchlistedCoins(1, transformCoinIds());
    setCoins(watchlistedCoinsData);
    setLoading(false);
  };

  useEffect(() => {
    if (watchlistCoinIds.length > 0) {
      fetchWatchlistedCoins();
    }
  }, [watchlistCoinIds]);

  return (
    <FlatList 
      data = {coins}
      renderItem = {({ item }) => <CoinItem marketCoin={item} />}
      refreshControl={
        <RefreshControl 
          refreshing={loading}
          tintColor='white'
          onRefresh={fetchWatchlistedCoins}
        />
      }
    />
  );
}

export default WatchListScreen;