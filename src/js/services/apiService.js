const baseUrl = 'https://pixabay.com/api/';
const key = '16133219-b7191e329ab916084dd10c777';

export default {
  page: 1,
  query: '',
  fetchArticles() {
    const requestParams = `?image_type=photo&orientation=horizontal&q=${this.query}&page=${this.page}&per_page=12&key=${key}`;

    return fetch(baseUrl + requestParams)
      .then(response => response.json())
      .then(parsedResponse => {
        this.incrementPage();
        return parsedResponse.hits;
      });
  },
  get searchQuery() {
    return this.query;
  },
  set searchQuery(string) {
    this.query = string;
  },
  incrementPage() {
    this.page += 1;
  },
  resetPage() {
    this.page = 1;
  },
};
