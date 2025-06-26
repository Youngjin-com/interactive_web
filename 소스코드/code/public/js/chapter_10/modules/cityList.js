export class CityList {
  constructor(cities, $listElement) {
    this.cities = cities;
    this.$listElement = $listElement;
    this.filteredCities = [];
    this.selectedIndex = -1;
    this.isVisible = false;
  }

  show() {
    this.$listElement.style.display = 'block';
    this.isVisible = true;
    return this;
  }

  hide() {
    this.$listElement.style.display = 'none';
    this.isVisible = false;
    this.filteredCities = [];
    this.selectedIndex = -1;
    return this;
  }

  render() {
    const citiesToRender = this.filteredCities.length > 0 ? this.filteredCities : this.cities;
    const fragment = document.createDocumentFragment();

    citiesToRender.forEach((city, index) => {
      const $li = document.createElement('li');
      $li.dataset.id = city.id;
      $li.textContent = `${city.name} (${city.englishName})`;
      if (index === this.selectedIndex) $li.classList.add('selected');
      fragment.appendChild($li);
    });

    this.$listElement.innerHTML = '';
    this.$listElement.appendChild(fragment);
    return this;
  }

  updateSelectedIndex(direction) {
    if (!this.isVisible) {
      this.show().render();
    }

    const citiesToUse = this.filteredCities.length > 0 ? this.filteredCities : this.cities;
    const length = citiesToUse.length;

    if (length === 0) return this;

    let newIndex = this.selectedIndex + direction;

    if (newIndex < 0) {
      newIndex = length - 1;
    } else if (newIndex >= length) {
      newIndex = 0;
    }

    this.selectedIndex = newIndex;
    this.render();

    const selectedCity = this.$listElement.querySelector('.selected');
    if (selectedCity) {
      selectedCity.scrollIntoView({ block: 'nearest' });
    }
    return this;
  }

  getSelectedCity() {
    const cities = this.$listElement.children;
    return cities[this.selectedIndex] || null;
  }

  findCityByName(name) {
    return this.cities.find((city) => city.name.toLowerCase() === name.toLowerCase() || city.englishName.toLowerCase() === name.toLowerCase()) || null;
  }

  filterCities(searchTerm) {
    this.filteredCities = this.cities.filter((city) => city.name.toLowerCase().includes(searchTerm.toLowerCase()) || city.englishName.toLowerCase().includes(searchTerm.toLowerCase()));
    this.selectedIndex = -1;
    return this.render();
  }
}
