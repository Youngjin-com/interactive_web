import { WIND_SPEED_UNITS, TIMEOUT } from './config.js';

const ELEMENT_NAMES = {
  ERROR: 'errorElement',
  LOADING: 'loadingElement',
  CONDITION: 'condition',
  TEMP: 'temp',
  CITY: 'city',
  LOCAL_TIME: 'localTime',
  WEATHER_ICON: 'weatherIcon',
  TEMP_MAX: 'tempMax',
  TEMP_MIN: 'tempMin',
  FEELS_LIKE: 'feelsLike',
  WIND: 'wind',
  HUMIDITY: 'humidity',
  PRESSURE: 'pressure',
};

export class WeatherUI {
  constructor($elements) {
    this.$elements = $elements;
    this.validateElements();
  }

  validateElements() {
    Object.values(ELEMENT_NAMES).forEach((name) => {
      if (!this.$elements[name]) {
        console.warn(`Element '${name}' not found in WeatherUI`);
      }
    });
  }

  updateWeather(weatherData, unit) {
    const {
      main,
      name,
      sys,
      weather: [weatherDetails],
      wind,
      dt,
      timezone,
    } = weatherData;
    this.updateTemperatures(main);
    this.updateCityInfo(name, sys.country);
    this.updateLocalTime(dt, timezone);
    this.updateWeatherIcon(weatherDetails.icon);
    this.updateWeatherDetails(weatherDetails, wind, main, unit);
  }

  /* Utils */
  formatTime(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    };
    return date.toLocaleString('ko-KR', options);
  }

  getElement(elementName) {
    return this.$elements[elementName];
  }

  updateElementContent(elementName, content) {
    const element = this.getElement(elementName);
    if (element) {
      element.textContent = content;
    }
  }

  updateElementWithUnit(elementName, value, unit) {
    this.updateElementContent(elementName, `${value} ${unit}`);
  }

  setElementStyle(elementName, style, value) {
    const element = this.getElement(elementName);
    if (element) {
      element.style[style] = value;
    }
  }

  toggleElementVisibility(elementName, isShow, duration = 0) {
    this.setElementStyle(elementName, 'opacity', isShow ? '1' : '0');
    if (duration > 0) {
      setTimeout(() => this.setElementStyle(elementName, 'opacity', '0'), duration);
    }
  }

  /* UI Update */
  updateTemperatures(main) {
    this.updateElementContent(ELEMENT_NAMES.TEMP, Math.round(main.temp));
    this.updateElementContent(ELEMENT_NAMES.TEMP_MAX, Math.round(main.temp_max));
    this.updateElementContent(ELEMENT_NAMES.TEMP_MIN, Math.round(main.temp_min));
  }

  updateCityInfo(name, country) {
    this.updateElementContent(ELEMENT_NAMES.CITY, `${name}, ${country}`);
  }

  updateLocalTime(date, timezone) {
    const localTime = new Date((date + timezone) * 1000);
    const formattedTime = this.formatTime(localTime);
    this.updateElementContent(ELEMENT_NAMES.LOCAL_TIME, formattedTime);
  }

  updateWeatherIcon(iconCode) {
    this.setElementStyle(ELEMENT_NAMES.WEATHER_ICON, 'backgroundImage', `url(../public/img/freesvg/weather/icn_${iconCode}.svg)`);
  }

  updateWeatherDetails(weather, wind, main, unit) {
    this.updateElementContent(ELEMENT_NAMES.CONDITION, weather.description);
    this.updateElementContent(ELEMENT_NAMES.FEELS_LIKE, `${Math.round(main.feels_like)}°`);
    this.updateElementWithUnit(ELEMENT_NAMES.HUMIDITY, main.humidity, '%');
    this.updateElementWithUnit(ELEMENT_NAMES.WIND, wind.speed, WIND_SPEED_UNITS[unit]);
    this.updateElementWithUnit(ELEMENT_NAMES.PRESSURE, main.pressure, 'hPa');
  }

  displayError(message) {
    this.updateElementContent(ELEMENT_NAMES.ERROR, message);
    this.toggleElementVisibility(ELEMENT_NAMES.ERROR, true, TIMEOUT.ERROR_DISPLAY_TIMEOUT);
  }

  showLoadingMessage(message) {
    this.updateElementContent(ELEMENT_NAMES.LOADING, message);
    this.toggleElementVisibility(ELEMENT_NAMES.LOADING, true);
  }

  hideLoadingMessage() {
    this.toggleElementVisibility(ELEMENT_NAMES.LOADING, false);
  }
}
