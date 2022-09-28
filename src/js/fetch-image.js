import axios from 'axios';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30180728-0211963a138fccfc4d4cb75fc';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  
  async fetchImage() {    
    const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
    const { data } = await axios.get(url);
    return data;  
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get currentpage() {
    return this.page;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}