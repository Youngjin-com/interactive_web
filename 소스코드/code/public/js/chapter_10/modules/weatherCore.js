import { API_CONFIG, TIMEOUT, UNITS } from './config.js';

export class WeatherAPI {
  static async fetchWeatherData(query, unit) {
    const url = this.buildUrl(query, unit);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT.LOCATION_TIMEOUT);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`날씨 정보를 가져오는데 실패했습니다. (상태 코드: ${response.status})`);
      }
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('요청 시간이 초과되었습니다.');
      }
      console.error('Weather API Error:', error);
      throw new Error('날씨 정보를 가져올 수 없습니다.');
    }
  }

  static buildUrl(query, unit) {
    const { BASE_URL, API_KEY, LANG } = API_CONFIG;
    const baseParams = `units=${unit}&appid=${API_KEY}&lang=${LANG}`;

    if (typeof query === 'string') {
      return `${BASE_URL}?q=${encodeURIComponent(query)}&${baseParams}`;
    }
    if (query.lat && query.lon) {
      return `${BASE_URL}?lat=${query.lat}&lon=${query.lon}&${baseParams}`;
    }
    if (query.id) {
      return `${BASE_URL}?id=${query.id}&${baseParams}`;
    }

    throw new Error('검색 조건을 확인 하세요.');
  }
}

export class WeatherClassifier {
  constructor(weatherRanges) {
    this.weatherRanges = weatherRanges;
  }

  getWeatherClass(weatherId) {
    const range = this.weatherRanges.find((range) => weatherId >= range.min && weatherId <= range.max);
    return range ? range.class : 'unknown';
  }
}

export class WeatherStateManager {
  #currentUnit = UNITS.METRIC;
  constructor() {
    this.lastRequestedCity = 'Seoul';
    this.cachedWeatherData = null;
  }

  get unit() {
    return this.#currentUnit;
  }

  set unit(newUnit) {
    if (!Object.values(UNITS).includes(newUnit)) {
      throw new Error('잘못된 단위 형식');
    }
    this.#currentUnit = newUnit;
  }

  updateWeatherState(weather, cacheKey = '') {
    this.cachedWeatherData = weather;
    this.lastRequestedCity = cacheKey || weather.name;
  }

  isCachedDataValid(cacheKey) {
    return cacheKey === this.lastRequestedCity && this.cachedWeatherData;
  }

  getCacheKey(query) {
    if (typeof query === 'string') return query;
    if (query.lat && query.lon) return `${query.lat},${query.lon}`;
    if (query.id) return query.id.toString();
    return '';
  }

  getCachedWeatherData() {
    return this.cachedWeatherData;
  }
}

export class Temperature {
  static celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
  }

  static fahrenheitToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
  }

  static msToMph(ms) {
    return ms * 2.23694;
  }

  static mphToMs(mph) {
    return mph / 2.23694;
  }

  static convertTemperatures(weatherData, toUnit) {
    const main = weatherData.main;
    const windSpeed = weatherData.wind.speed;
    const converter = toUnit === UNITS.METRIC ? this.fahrenheitToCelsius : this.celsiusToFahrenheit;
    const temperatureKeys = ['temp', 'feels_like', 'temp_min', 'temp_max'];

    temperatureKeys.forEach((key) => {
      main[key] = Number(converter(main[key]).toFixed(1));
    });

    weatherData.wind.speed = toUnit === UNITS.METRIC ? Number(this.mphToMs(windSpeed)).toFixed(2) : Number(this.msToMph(windSpeed)).toFixed(2);

    return weatherData;
  }
}

export class LocationManager {
  static getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation이 지원되지 않습니다.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('getCurrentLocation Error:', error);
          reject(new Error('위치 정보를 가져올 수 없습니다.'));
        },
        {
          timeout: TIMEOUT.LOCATION_TIMEOUT,
          maximumAge: TIMEOUT.LOCATION_AGE_TIMEOUT,
        },
      );
    });
  }
}
