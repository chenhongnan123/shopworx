import FlexSearch from 'flexsearch';

class SearchService {
  constructor(options) {
    this.instance = new FlexSearch(options);
  }

  add(items) {
    return this.instance.add(items);
  }

  search(searchOptions = {}) {
    return this.instance.search(searchOptions);
  }
}

export default SearchService;
