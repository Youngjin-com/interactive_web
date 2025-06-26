import { Temperature } from './weatherCore.js';

export class EventHandler {
  constructor(app) {
    this.app = app;
  }

  handleSearchInput(event) {
    const searchTerm = event.target.value.toLowerCase();
    this.app.cityList.filterCities(searchTerm);
    this.app.cityList.show();
  }

  handleOutsideClick(event) {
    if (!this.app.$elements.searchInput.contains(event.target) && !this.app.$elements.cityList.contains(event.target)) {
      this.app.cityList.hide();
    }
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.app.cityList.updateSelectedIndex(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.app.cityList.updateSelectedIndex(-1);
        break;
      case 'Enter':
        this.handleEnterKey(event);
        break;
      case 'Escape':
        this.app.cityList.hide();
        break;
    }
  }

  handleEnterKey(event) {
    const selectedCity = this.app.cityList.getSelectedCity();
    if (selectedCity) {
      this.handleCitySelect({ target: selectedCity });
      event.preventDefault();
    }
  }

  handleCitySelect(event) {
    const cityId = event.target.dataset.id;
    this.app.getWeatherInfo({ id: cityId });
    this.app.$elements.searchInput.value = event.target.textContent.split(' (')[0];
    this.app.cityList.hide();
  }

  handleSearch(event) {
    event.preventDefault();
    const searchTerm = this.app.$elements.searchInput.value.trim();
    if (searchTerm) {
      const cityInfo = this.app.cityList.findCityByName(searchTerm);
      if (cityInfo) {
        this.app.getWeatherInfo({ id: cityInfo.id });
      } else {
        this.app.getWeatherInfo(searchTerm);
      }
    }
    this.app.cityList.hide();
  }

  toggleTemperature(event) {
    const $clickedElement = event.target.closest('li');
    if (!$clickedElement) return;

    const newUnit = $clickedElement.dataset.type;
    if (newUnit === this.app.stateManager.unit) return;

    $clickedElement.parentElement.querySelectorAll('li').forEach((li) => {
      li.classList.toggle('active', li.dataset.type === newUnit);
    });

    this.app.ui.updateTemperatures(newUnit);
    this.app.stateManager.unit = newUnit;

    const cachedData = this.app.stateManager.getCachedWeatherData();
    if (cachedData) {
      const convertedData = Temperature.convertTemperatures(cachedData, newUnit);
      this.app.displayWeather(convertedData);
    } else {
      const city = this.app.$elements.city.textContent.split(',')[0];
      if (city) this.app.getWeatherInfo(city);
    }
  }
}
