export const API_CONFIG = {
  BASE_URL: 'http://api.openweathermap.org/data/2.5/weather',
  API_KEY: '본인의 API Key',
  LANG: 'kr',
};

export const TIMEOUT = {
  ERROR_DISPLAY_TIMEOUT: 3000,
  LOCATION_TIMEOUT: 10000,
  LOCATION_AGE_TIMEOUT: 60000,
  VIDEO_PRELOAD_TIMEOUT: 10000,
};

export const UNITS = {
  IMPERIAL: 'imperial',
  METRIC: 'metric',
};

export const WIND_SPEED_UNITS = {
  [UNITS.IMPERIAL]: 'mph',
  [UNITS.METRIC]: 'm/s',
};

export const WEATHER_RANGES = [
  { min: 200, max: 299, class: 'thunderstorm' },
  { min: 300, max: 499, class: 'drizzle' },
  { min: 500, max: 599, class: 'rainy' },
  { min: 600, max: 699, class: 'snow' },
  { min: 700, max: 799, class: 'atmosphere' },
  { min: 800, max: 800, class: 'clear' },
  { min: 801, max: 899, class: 'cloudy' },
];

export const CITIES = [
  // 한국
  { id: 1835848, name: '서울', englishName: 'Seoul' },
  { id: 1838524, name: '부산', englishName: 'Busan' },
  { id: 1835327, name: '대구', englishName: 'Daegu' },
  { id: 1843564, name: '인천', englishName: 'Incheon' },
  { id: 1841811, name: '광주', englishName: 'Gwangju' },
  { id: 1835235, name: '대전', englishName: 'Daejeon' },
  { id: 1835553, name: '수원', englishName: 'Suwon-si' },
  { id: 1846326, name: '창원', englishName: 'Changwon' },
  { id: 1846266, name: '제주', englishName: 'Jeju City' },
];
