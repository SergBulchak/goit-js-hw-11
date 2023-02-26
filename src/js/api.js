const { default: axios } = require('axios');

const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '33947577-64f3aa4661b9b744dbf9c7c1d';


const options = {
  headers: {
    'X-API_KEY': '33947577-64f3aa4661b9b744dbf9c7c1d',
  },
};

export default class SearchImagesApi {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.currentHits = 0;
  }
  async getImages() {
    const URL = `${ENDPOINT}?key=${API_KEY}&q=${this.searchQuery}&orientation=horizonal&image_type=photo&safesearch=true&per_page=40&page=${this.page}`;

    const response = await axios.get(URL);

    this.nextPage();

    return response.data;
  }
  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}