import React, { JSX, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    ScrollView,
    useWindowDimensions,
    PermissionsAndroid,
    TouchableOpacity,
} from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { dh, dw } from '../constants/Dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface WeatherData {
    current_weather?: {
        temperature: number;
        weather_code: number;
    };
    daily?: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
    hourly?: {
        time: string[];
        temperature_2m: number[];
    };
    [key: string]: any;
}

interface HourlyForecast {
    key: string;
    displayTime: string;
    temp: number;
}

interface DailyForecast {
    date: string;
    weatherCode: number;
    maxTemp: number;
    minTemp: number;
}

export default function WeatherCard(): JSX.Element {
    const [weatherData, setWeatherData] = useState < WeatherData | null > (null);
    const [error, setError] = useState < string > ('');
    const [currentLocation, setCurrentLocation] = useState < string > ('Fetching location...');
    const [currentTime, setCurrentTime] = useState < Date > (new Date());
    const [isRefetching, setIsRefetching] = useState < boolean > (false);
    const { width, height } = useWindowDimensions();

    const tempUnit = useSelector((state: RootState) => state.weather.unit);

    const toFahrenheit = (celsius: number): number => (celsius * 9) / 5 + 32;

    const getPlaceName = async (latitude: number, longitude: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&format=json`
            );
            const data = await response.json();
            const address = data.address || {};

            const city =
                address.city ||
                address.town ||
                address.village ||
                address.suburb ||
                address.state_district;

            const country = address.country;
            const state = address.state;

            if (city && country) {
                return `${city}, ${country}`;
            } else if (state && country) {
                return `${state}, ${country}`;
            } else if (country) {
                return country;
            } else {
                return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            }
        } catch (error) {
            console.error('Error fetching location name:', error);
            return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        }
    };

    const getWeatherDescription = (code: number, currentTemp: number): string => {
        const descriptions: Record<number, string> = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            4: 'Cloudy',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            56: 'Light Freezing Drizzle',
            57: 'Dense Freezing Drizzle',
            61: 'Slight Rain',
            63: 'Moderate Rain',
            65: 'Heavy Rain',
            66: 'Light Freezing Rain',
            67: 'Heavy Freezing Rain',
            71: 'Slight Snow Fall',
            73: 'Moderate Snow Fall',
            75: 'Heavy Snow Fall',
            77: 'Snow Grains',
            80: 'Rain Showers',
            81: 'Heavy Rain Showers',
            82: 'Violent Rain Showers',
            85: 'Slight Snow Showers',
            86: 'Heavy Snow Showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with Slight Hail',
            99: 'Thunderstorm with Heavy Hail',
        };

        const tempInC = tempUnit === 'F' ? ((currentTemp - 32) * 5) / 9 : currentTemp;

        if (descriptions[code]) return descriptions[code];

        if (tempInC > 35) return 'Very Hot Weather';
        if (tempInC >= 28) return 'Warm & Pleasant Weather';
        if (tempInC >= 20) return 'Mild Weather';
        if (tempInC >= 10) return 'Cool Weather';
        if (tempInC >= 0) return 'Chilly Weather';
        return 'Freezing Cold';
    };

    const getDynamicWeatherIcon = (code: number, currentTemp?: number): string => {
        const icons: Record<number, string> = {
            0: '☀️',
            1: '🌤️',
            2: '⛅',
            3: '☁️',
            4: '☁️',
            45: '🌫️',
            48: '🌫️',
            51: '🌦️',
            53: '🌧️',
            55: '🌧️',
            56: '🌨️',
            57: '🌨️',
            61: '☔',
            63: '🌧️',
            65: '⛈️',
            66: '🌧️',
            67: '🌧️',
            71: '🌨️',
            73: '❄️',
            75: '🥶',
            77: '🌨️',
            80: '🌧️',
            81: '⛈️',
            82: '⚡',
            85: '🌨️',
            86: '🌨️',
            95: '🌩️',
            96: '⛈️',
            99: '🌪️',
        };

        if (icons[code]) return icons[code];

        if (currentTemp !== undefined && currentTemp !== null) {
            const tempInC = tempUnit === 'F' ? ((currentTemp - 32) * 5) / 9 : currentTemp;
            if (tempInC > 35) return '🔥';
            if (tempInC >= 28) return '☀️';
            if (tempInC >= 20) return '🌡️';
            if (tempInC >= 10) return '🧥';
            if (tempInC >= 0) return '❄️';
            return '🧊';
        }

        return '❓';
    };

    const refetchWeatherData = async () => {
        setIsRefetching(true);
        setError('');
        setWeatherData(null);

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                setError('Permission to access location denied');
                setIsRefetching(false);
                return;
            }

            Geolocation.getCurrentPosition(
                async (position: GeoPosition) => {
                    const { latitude, longitude } = position.coords;
                    const placeName = await getPlaceName(latitude, longitude);
                    setCurrentLocation(placeName);

                    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
                    const response = await fetch(API_URL);
                    const data: WeatherData = await response.json();

                    console.log('weather data:', JSON.stringify(data));

                    setWeatherData(data);
                    setIsRefetching(false);
                },
                (error) => {
                    console.error(error);
                    setError('Failed to get location');
                    setIsRefetching(false);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } catch (err) {
            console.error('Error fetching weather:', err);
            setError('Failed to load weather data. Please try again.');
            setIsRefetching(false);
        }
    };

    useEffect(() => {
        refetchWeatherData();
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    if (error) {
        return (
            <View style={[styles.cardContainer, styles.errorCard, { width: width * 0.95, height: height * 0.4 }]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!weatherData) {
        return (
            <View style={[styles.cardContainer, { width: width * 0.95, height: height * 0.4 }]}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Loading weather data...</Text>
            </View>
        );
    }

    const { current_weather, daily, hourly } = weatherData;
    const currentTempInC = current_weather?.temperature || 0;
    const currentTemp = tempUnit === 'F' ? Math.round(toFahrenheit(currentTempInC)) : Math.round(currentTempInC);

    const currentDescription = getWeatherDescription(current_weather?.weather_code ?? 0, currentTempInC);
    const currentIcon = getDynamicWeatherIcon(current_weather?.weather_code ?? 0, currentTempInC);

    const hourlyForecast: HourlyForecast[] = [];
    const nowHour = currentTime.getHours();
    let startIndex = 0;

    if (hourly?.time) {
        for (let i = 0; i < hourly.time.length; i++) {
            const date = new Date(hourly.time[i]);
            if (date.getHours() === nowHour && date.getDate() === currentTime.getDate()) {
                startIndex = i;
                break;
            }
        }
    }

    if (hourly?.time && hourly.temperature_2m) {
        for (let i = 0; i < 24; i++) {
            const dataIndex = startIndex + i;
            if (dataIndex < hourly.time.length) {
                const hourlyDate = new Date(hourly.time[dataIndex]);
                const displayHour = hourlyDate.getHours();
                const displayTime = (displayHour % 12 || 12) + (displayHour < 12 ? 'a' : 'p') + 'm';

                const tempInC = hourly.temperature_2m[dataIndex];
                const displayTemp = tempUnit === 'F' ? Math.round(toFahrenheit(tempInC)) : Math.round(tempInC);

                hourlyForecast.push({
                    key: hourly.time[dataIndex],
                    displayTime,
                    temp: displayTemp,
                });
            } else break;
        }
    }

    const nextSixDaysForecast: DailyForecast[] =
        daily?.time?.slice(1, 6).map((date, index) => {
            const maxTempInC = daily.temperature_2m_max[index + 1];
            const minTempInC = daily.temperature_2m_min[index + 1];

            const maxTemp = tempUnit === 'F' ? Math.round(toFahrenheit(maxTempInC)) : Math.round(maxTempInC);
            const minTemp = tempUnit === 'F' ? Math.round(toFahrenheit(minTempInC)) : Math.round(minTempInC);

            return {
                date,
                weatherCode: daily.weather_code[index + 1],
                maxTemp,
                minTemp,
            };
        }) || [];

    return (
        <View style={[styles.cardContainer, { width: width * 0.95, height: height * 0.4 }]}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={refetchWeatherData} style={styles.locationContainer} disabled={isRefetching}>
                    <Text style={styles.locationText}>{currentLocation}</Text>
                    {isRefetching && (
                        <ActivityIndicator size="small" color="#2196F3" style={styles.activityIndicator} />
                    )}
                </TouchableOpacity>
                <Text style={styles.timeText}>{formattedTime}</Text>
            </View>

            <View style={styles.currentWeatherSummary}>
                <Text style={styles.currentIconSmall}>{currentIcon}</Text>
                <View style={styles.tempAndDesc}>
                    <Text style={styles.currentTempSmall}>
                        {currentTemp}°{tempUnit}
                    </Text>
                    <Text style={styles.currentDescriptionSmall}>{currentDescription}</Text>
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
                {hourlyForecast.map(hourData => (
                    <View key={hourData.key} style={[styles.hourlyItemSmall, { width: width * 0.15 }]}>
                        <Text style={styles.hourlyTimeSmall}>{hourData.displayTime}</Text>
                        <Text style={styles.hourlyTempSmall}>{hourData.temp}°</Text>
                    </View>
                ))}
            </ScrollView>

            <FlatList
                horizontal
                data={nextSixDaysForecast}
                keyExtractor={item => item.date}
                renderItem={({ item }) => (
                    <View style={[styles.dailyItemSmall, { width: width * 0.18 }]}>
                        <Text style={styles.dailyDateSmall}>
                            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </Text>
                        <Text style={styles.dailyIconSmall}>
                            {getDynamicWeatherIcon(item.weatherCode)}
                        </Text>
                        <Text style={styles.dailyTempRangeSmall}>
                            {item.maxTemp}°/{item.minTemp}°
                        </Text>
                    </View>
                )}
                showsHorizontalScrollIndicator={false}
                style={styles.dailyScroll}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 18,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 7,
        elevation: 5,
        margin: 5,
    },
    errorCard: {
        backgroundColor: '#FFEBEE',
        borderColor: '#EF5350',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#B71C1C',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
    },
    activityIndicator: {
        marginLeft: 8,
    },
    timeText: {
        fontSize: 15,
        color: '#666666',
    },
    currentWeatherSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    currentIconSmall: {
        fontSize: 48,
        marginRight: 15,
    },
    tempAndDesc: {
        flexDirection: 'column',
    },
    currentTempSmall: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#333333',
    },
    currentDescriptionSmall: {
        fontSize: 18,
        color: '#666666',
    },
    hourlyScroll: {
        flexGrow: 0,
        height: dh / 10,
        marginBottom: 15,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 10,
    },
    hourlyItemSmall: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    hourlyTimeSmall: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 6,
    },
    hourlyTempSmall: {
        fontSize: 22,
        fontWeight: '500',
        color: '#333333',
    },
    dailyScroll: {
        flexGrow: 0,
        height: dh / 6,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    dailyItemSmall: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dailyDateSmall: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666666',
    },
    dailyIconSmall: {
        fontSize: 28,
    },
    dailyTempRangeSmall: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
    },
});