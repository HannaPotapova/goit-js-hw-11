// import './sass/index.scss';
import ApiService from './js/fetch-image';
import getRefs from './js/get-refs';
import imgMarkup from './js/markupPhotoCard';

import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
var lightbox = new SimpleLightbox(".gallery a", {
        captions: true,
        captionsData: "alt",
        captionDelay: 250,
});

import { Report } from 'notiflix/build/notiflix-report-aio';

const refs = getRefs();
const apiService = new ApiService();

let totalPages = 0;

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

loadMoreIsHidden();

function onSearch(event) {
  event.preventDefault();
  onLoadMore();
  clearMurkup();
  apiService.resetPage();
  apiService.searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  
  if (apiService.searchQuery === '') {
    Report.failure(       
      'Please try again.',
      '',
      'Okay'
    );
    return;
  }

  apiService.fetchImage()
    .then(appendCardMarkup);
  visibilityIsHidden();  
}

function onLoadMore() {
  apiService.incrementPage();
  apiService.fetchImage().then(data => {
    appendCardMarkup(data);
  });
  lightbox.refresh();  
}

function appendCardMarkup(data) {
  totalPages = Math.ceil(data.totalHits / 40);
  if (apiService.currentpage === totalPages) {
    loadMoreIsHidden();
    Report.info("",
         "We're sorry, but you've reached the end of search results.", 'Okay'
    );
  };
  
  refs.galleryEl.insertAdjacentHTML('beforeend', imgMarkup(data));
  
  Report.success(
      `Hooray! We found ${data.total} images.`, '','Go watch!'
    );  
  lightbox.refresh();
  smoothScroll();
} 

function loadMoreIsHidden() {
  refs.loadMoreBtn.classList.add('is-hidden');
}
function visibilityIsHidden() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function clearMurkup() {
  refs.galleryEl.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 0.2,
    behavior: "smooth",
  });
}