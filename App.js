import { ActivityIndicator, FlatList, Text, View, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';

export default function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>{new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}</Text>
      <Image style={styles.icon} source={{ uri: item.icon }} />
      <Text>End Time: {new Date(item.endTime).toLocaleString()}</Text>
      <Text>Temperature: {item.temperature}{item.temperatureUnit} {item.temperatureTrend ? `(${item.temperatureTrend})` : ''}</Text>
      {item.probabilityOfPrecipitation && !item.probabilityOfPrecipitation.value && (
        <Text>Chance of Precipitation: {item.probabilityOfPrecipitation.value}%</Text>
      )}
      <Text>Wind: {item.windSpeed} from the {item.windDirection}</Text>
      <Text>Forecast: {item.shortForecast}</Text>
      <Text>Detailed Forecast: {item.detailedForecast}</Text>
    </View>
  );


  const getWeather = async () => {
    try {
      const response = await fetch('https://api.weather.gov/gridpoints/SEW/145,17/forecast');
      if (!response.ok) {
        throw new Error('Unable to fetch weather data');
      }
      const data = await response.json()
      setData(data);
    }
    catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeather()
  }, []);

  return (
    <View style={styles.container}>
      {error ? (
        <Text>{error}</Text>
      ) : isLoading ? (
        <ActivityIndicator size={100} color="#0000ff"/>
      ) : (
        <FlatList
          data={data.properties.periods}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          keyExtractor={(item) => item.number.toString()}
        />
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
  },
  icon: {
    width: 50,
    height: 50,
  },
});
