import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, TextInput, ActivityIndicator, Button } from 'react-native';
import CoinDetailHeader from './components/CoinDetailedHeader';
import styles from './styles';
import { AntDesign } from '@expo/vector-icons';
import { LineChart, CandlestickChart } from 'react-native-wagmi-charts';
import { useRoute } from '@react-navigation/native';
import { getDetailedCoinData, getCoinMarketChart, getCandleChartData } from '../../services/requests'
import FilterComponent from './components/FilterComponents';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import storage from '@react-native-async-storage/async-storage'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  })
});

const CoinDetailedScreen = () => {

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [coin, setCoin] = useState(null);
  const [coinMarketData, setCoinMarketData] = useState(null);
  const [coinCandleChartData, setCoinCandleChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coinValue, setCoinValue] = useState("1");
  const [usdValue, setUsdValue] = useState("");
  const [selectedRange, setSelectedRange] = useState("1");
  const [isCandleChartVisible, setIsCandleChartVisible] = useState(false);

  const route = useRoute();
  const { params: { coinId } } = route;

  const fetchCoinData = async () => {
    setLoading(true);
    const fetchedCoinData = await getDetailedCoinData(coinId);
    setCoin(fetchedCoinData);
    setUsdValue(fetchedCoinData.market_data.current_price.usd.toString());
    setLoading(false);
  };

  const fetchMarketCoinData = async (selectedRangeValue) => {
    const fetchCoinMarketData = await getCoinMarketChart(coinId, selectedRangeValue);
    setCoinMarketData(fetchCoinMarketData);
  };

  const fetchCandleStickChartData = async (selectedRangeValue) => {
    const fetchedSelectedCandleChartData = await getCandleChartData(coinId, selectedRangeValue);
    setCoinCandleChartData(fetchedSelectedCandleChartData);
  };

  const getPermission = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Enable push notifications to use the app!');
        await storage.setItem('expopushtoken', "");
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      await storage.setItem('expopushtoken', token);
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  useEffect(() => {
    fetchCoinData();
    fetchMarketCoinData(1);
    fetchCandleStickChartData();
    
    //notifications
    getPermission();
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };

  }, []);

  const onSelectedRangeChange = (selectedRangeValue) => {
    setSelectedRange(selectedRangeValue);
    fetchMarketCoinData(selectedRangeValue);
    fetchCandleStickChartData(selectedRangeValue);
  };

  const memoOnSelectedRangeChange = React.useCallback(
    (range) => onSelectedRangeChange(range),
    []
  );

  if (loading || !coin || !coinMarketData || !coinCandleChartData) {
    return <ActivityIndicator size="large" />
  };

  const {
    id,
    name,
    symbol,
    image: { small },
    market_data: {
      market_cap_rank,
      current_price,
      price_change_percentage_24h,
    },
  } = coin;

  const { prices } = coinMarketData;

  const percentageColor = price_change_percentage_24h < 0 ? '#ea3943' : '#16c784' || 'white';
  const chartColor = current_price.usd > prices[0][1] ? "#16c784" : "#ea3943";
  const screenWidth = Dimensions.get('window').width;

  const formatCurrency = ({ value }) => {
    "worklet";
    if (value === "") {
      if (current_price.usd < 1) {
        return `$${current_price.usd}`;
      }
      return `$${current_price.usd.toFixed(2)}`
    }
    if (current_price.usd < 1) {
      return `$${parseFloat(value)}`;
    }
    return `$${parseFloat(value).toFixed(2)}`
  };
  const changeCoinValue = (value) => {
    setCoinValue(value);
    const floatValue = parseFloat(value.replace(',', '.')) || 0;
    setUsdValue((floatValue * current_price.usd).toString());
  };
  const changeUsdValue = (value) => {
    setUsdValue(value);
    const floatValue = parseFloat(value.replace(',', '.')) || 0;
    setCoinValue((floatValue / current_price.usd).toString());
  };

  const sendNotification = async (symbol, name, price_change_percentage_24h) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: name,
        body: `${symbol.toUpperCase()} has moved ${price_change_percentage_24h}% in the last 24h.`,
        data: { data: "data" }
      },
      trigger: { seconds: 1 }
    })
  };


  return (
    <View style={{ paddingHorizontal: 10 }}>
      <LineChart.Provider data={prices.map(([timestamp, value]) => ({ timestamp, value }))}>
        <CoinDetailHeader
          coinId={id}
          image={small}
          symbol={symbol}
          market_cap_rank={market_cap_rank}
        />
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <LineChart.PriceText style={styles.currentPrice} format={formatCurrency} />
          </View>
          <View style={{ backgroundColor: percentageColor, padding: 5, borderRadius: 5, flexDirection: 'row', height: 35 }}>
            <AntDesign
              name={price_change_percentage_24h < 0 ? 'caretdown' : 'caretup'}
              size={12}
              color={'white'}
              style={{ alignSelf: 'center', marginRight: 5 }}
            />
            <Text style={styles.priceChange}>
              {price_change_percentage_24h?.toFixed(2)}%
            </Text>
          </View>
        </View>
        <View style={styles.filtersContainer}>
          <FilterComponent filterDay="1" filterText="24H" selectedRange={selectedRange} setSelectedRange={memoOnSelectedRangeChange} />
          <FilterComponent filterDay="7" filterText="7D" selectedRange={selectedRange} setSelectedRange={memoOnSelectedRangeChange} />
          <FilterComponent filterDay="30" filterText="30D" selectedRange={selectedRange} setSelectedRange={memoOnSelectedRangeChange} />
          <FilterComponent filterDay="365" filterText="1Y" selectedRange={selectedRange} setSelectedRange={memoOnSelectedRangeChange} />
          <FilterComponent filterDay="max" filterText="All" selectedRange={selectedRange} setSelectedRange={memoOnSelectedRangeChange} />
          {isCandleChartVisible ? (
            <MaterialIcons name="show-chart" size={24} color="#16c784" onPress={() => setIsCandleChartVisible(false)} />
          ) : (
            <MaterialIcons name="waterfall-chart" size={24} color="#16c784" onPress={() => setIsCandleChartVisible(true)} />
          )}
        </View>
        <View>

          {isCandleChartVisible ? (
            <CandlestickChart.Provider
              data={coinCandleChartData.map(
                ([timestamp, open, high, low, close]) => ({ timestamp, open, high, low, close })
              )}
            >
              <CandlestickChart height={screenWidth / 2} width={screenWidth - 20}>
                <CandlestickChart.Candles />
                <CandlestickChart.Crosshair>
                  <CandlestickChart.Tooltip />
                </CandlestickChart.Crosshair>
              </CandlestickChart>
              <View style={styles.candleStickTextContainer}>
                <View>
                  <Text style={styles.candleStickTextLabel}>Open</Text>
                  <CandlestickChart.PriceText style={styles.candleStickText} type="open" />
                </View>
                <View>
                  <Text style={styles.candleStickTextLabel}>High</Text>
                  <CandlestickChart.PriceText style={styles.candleStickText} type="high" />
                </View>
                <View>
                  <Text style={styles.candleStickTextLabel}>Low</Text>
                  <CandlestickChart.PriceText style={styles.candleStickText} type="low" />
                </View>
                <View>
                  <Text style={styles.candleStickTextLabel}>Close</Text>
                  <CandlestickChart.PriceText style={styles.candleStickText} type="close" />
                </View>
              </View>
              <CandlestickChart.DatetimeText style={{ color: 'white', fontWeight: '700', margin: 10 }} />
            </CandlestickChart.Provider>
          ) : (
            <LineChart height={screenWidth / 2} width={screenWidth - 20}>
              <LineChart.Path color={chartColor}>
                <LineChart.Gradient color={chartColor} />
              </LineChart.Path>
              <LineChart.CursorCrosshair color={chartColor} />
            </LineChart>
          )}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Text style={{ color: 'white', alignSelf: 'center' }}>{symbol.toUpperCase()}</Text>
            <TextInput
              style={styles.input}
              value={coinValue}
              keyboardType="numeric"
              onChangeText={changeCoinValue}
            />
          </View>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Text style={{ color: 'white', alignSelf: 'center' }}>USD</Text>
            <TextInput
              style={styles.input}
              value={usdValue}
              keyboardType="numeric"
              onChangeText={changeUsdValue}
            />
          </View>
        </View>
        <View>
          <Button
            title={'Send Local Notification'}
            onPress={() => sendNotification(
              coin.symbol,
              coin.name, 
              coin.market_data.price_change_percentage_24h.toString(),
            )}
          />
        </View>
      </LineChart.Provider>
    </View >
  );
};

export default CoinDetailedScreen;