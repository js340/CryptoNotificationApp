import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import CoinDetailHeader from './components/CoinDetailedHeader';
import styles from './styles';
import { AntDesign } from '@expo/vector-icons';
import { ChartDot, ChartPath, ChartPathProvider, ChartYLabel } from '@rainbow-me/animated-charts';
import { useRoute } from '@react-navigation/native';
import { getDetailedCoinData, getCoinMarketChart } from '../../services/requests'
import FilterComponent from './components/FilterComponents';


const CoinDetailedScreen = () => {

  const [coin, setCoin] = useState(null);
  const [coinMarketData, setCoinMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coinValue, setCoinValue] = useState("1");
  const [usdValue, setUsdValue] = useState("");
  const [selectedRange, setSelectedRange] = useState("1");

  const route = useRoute();
  const {params: { coinId }} = route;

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

  useEffect(() => {
    fetchCoinData();
    fetchMarketCoinData(1);
  }, []);

  if (loading || !coin || !coinMarketData) {
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


  const formatCurrency = (value) => {
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
    const floatValue  = parseFloat(value.replace(',', '.')) || 0;
    setUsdValue((floatValue * current_price.usd).toString());
  };
  const changeUsdValue = (value) => {
    setUsdValue(value);
    const floatValue  = parseFloat(value.replace(',', '.')) || 0;
    setCoinValue((floatValue / current_price.usd).toString());
  };

  const onSelectedRangeChange = (selectedRangeValue) => {
    setSelectedRange(selectedRangeValue);
    fetchMarketCoinData(selectedRangeValue);
  }

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <ChartPathProvider
        data={{
          points: prices.map(([x, y]) => ({ x, y })),
        }}
      >
        <CoinDetailHeader
          coinId={id}
          image={small}
          symbol={symbol}
          market_cap_rank={market_cap_rank}
        />
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <ChartYLabel
              format={formatCurrency}
              style={styles.currentPrice}
            />
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
          <FilterComponent filterDay="1" filterText="24H" selectedRange={selectedRange} setSelectedRange={onSelectedRangeChange}/>
          <FilterComponent filterDay="7" filterText="7D" selectedRange={selectedRange} setSelectedRange={onSelectedRangeChange}/>
          <FilterComponent filterDay="30" filterText="30D" selectedRange={selectedRange} setSelectedRange={onSelectedRangeChange}/>
          <FilterComponent filterDay="365" filterText="1Y" selectedRange={selectedRange} setSelectedRange={onSelectedRangeChange}/>
          <FilterComponent filterDay="max" filterText="All" selectedRange={selectedRange} setSelectedRange={onSelectedRangeChange}/>
        </View>
        <View>
          <ChartPath 
            strokeWidth={2}
            height={screenWidth / 2}
            stroke={chartColor} 
            width={screenWidth-20} 
          />
          <ChartDot style={{ backgroundColor: chartColor }} />
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={{color: 'white', alignSelf: 'center'}}>{symbol.toUpperCase()}</Text>
            <TextInput 
              style={styles.input}
              value={coinValue}
              keyboardType="numeric"
              onChangeText={changeCoinValue}
            />
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={{color: 'white', alignSelf: 'center'}}>USD</Text>
            <TextInput 
              style={styles.input}
              value={usdValue}
              keyboardType="numeric"
              onChangeText={changeUsdValue}
            />          
          </View>
        </View>
      </ChartPathProvider>
    </View >
  );
};

export default CoinDetailedScreen;