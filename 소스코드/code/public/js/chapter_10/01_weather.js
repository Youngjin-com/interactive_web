import { WeatherAPI, WeatherStateManager, LocationManager, WeatherClassifier } from './modules/weatherCore.js';
import { WeatherUI } from './modules/weatherUI.js';
import { CityList } from './modules/cityList.js';
import { VideoBackground } from './modules/videoBackground.js';
import { EventHandler } from './modules/event.js';
import { get$ } from '../utils.js';
import { CITIES, WEATHER_RANGES } from './modules/config.js';

class WeatherApp {
  constructor() {
    this.weatherClassifier = new WeatherClassifier(WEATHER_RANGES);
    this.stateManager = new WeatherStateManager();
    this.init();
  }

  init() {
    this.cacheElements();
    this.initializeComponents();
    this.initializeWeather();
    this.bindEvents();
  }

  cacheElements() {
    this.$elements = {
      switchTemp: get$('.type_temperature'),
      errorElement: get$('.msg_error'),
      loadingElement: get$('.msg_loading'),
      searchForm: get$('.form_search'),
      searchInput: get$('.input_search'),
      cityList: get$('.city_list'),
      videoContainer: get$('.video_background'),
      condition: get$('[data-weather="type"]'),
      temp: get$('[data-weather="temperature"]'),
      city: get$('[data-weather="city"]'),
      localTime: get$('[data-weather="time"]'),
      weatherIcon: get$('[data-weather="icon"]'),
      tempMax: get$('[data-weather="max"]'),
      tempMin: get$('[data-weather="min"]'),
      feelsLike: get$('[data-weather="feel"]'),
      wind: get$('[data-weather="wind"]'),
      humidity: get$('[data-weather="humidity"]'),
      pressure: get$('[data-weather="pressure"]'),
    };
  }

  initializeComponents() {
    this.ui = new WeatherUI(this.$elements);
    this.eventHandler = new EventHandler(this);
    this.videoBackground = new VideoBackground(this.$elements.videoContainer);
    this.cityList = new CityList(CITIES, this.$elements.cityList);
    this.cityList.render();
  }

  displayWeather(weather) {
    this.ui.updateWeather(weather, this.stateManager.unit);
    this.ui.updateLocalTime(weather.dt, weather.timezone);
    this.updateBackground(weather.weather[0].id);
  }

  updateWeatherState(weather, cacheKey = '') {
    this.stateManager.updateWeatherState(weather, cacheKey);
    this.displayWeather(weather);
    this.$elements.searchInput.value = '';
  }

  bindEvents() {
    this.$elements.switchTemp.addEventListener('click', this.eventHandler.toggleTemperature.bind(this.eventHandler));
    this.$elements.searchInput.addEventListener('input', this.eventHandler.handleSearchInput.bind(this.eventHandler));
    this.$elements.searchInput.addEventListener('focus', this.eventHandler.handleSearchInput.bind(this.eventHandler));
    document.addEventListener('click', this.eventHandler.handleOutsideClick.bind(this.eventHandler));
    this.$elements.searchInput.addEventListener('keydown', this.eventHandler.handleKeyDown.bind(this.eventHandler));
    this.$elements.cityList.addEventListener('click', this.eventHandler.handleCitySelect.bind(this.eventHandler));
    this.$elements.searchForm.addEventListener('submit', this.eventHandler.handleSearch.bind(this.eventHandler));
  }

  async getWeatherByCoords(lat, lon) {
    try {
      const weather = await WeatherAPI.fetchWeatherData({ lat, lon }, this.stateManager.unit);
      this.updateWeatherState(weather);
    } catch (error) {
      this.ui.displayError(error.message);
    }
  }

  async getWeatherInfo(query) {
    const cacheKey = this.stateManager.getCacheKey(query);

    if (this.stateManager.isCachedDataValid(cacheKey)) {
      this.displayWeather(this.stateManager.getCachedWeatherData());
      return;
    }

    try {
      const weather = await WeatherAPI.fetchWeatherData(query, this.stateManager.unit);
      this.updateWeatherState(weather, cacheKey);
    } catch (error) {
      this.ui.displayError(error.message);
    }
  }

  async initializeWeather() {
    try {
      this.ui.showLoadingMessage('현재 위치를 받아오는 중...');
      const { lat, lon } = await LocationManager.getCurrentLocation();
      await this.getWeatherByCoords(lat, lon);
    } catch (error) {
      console.warn('위치 받아오기 실패 Error:', error);
      await this.getWeatherInfo('Seoul');
    } finally {
      this.ui.hideLoadingMessage();
    }
  }

  updateBackground(weatherId) {
    const weatherClass = this.weatherClassifier.getWeatherClass(weatherId);
    document.body.className = weatherClass;
    this.videoBackground.changeBackground(weatherClass);
  }
}

window.addEventListener('load', () => new WeatherApp());
