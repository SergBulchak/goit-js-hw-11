import SearchImagesApi from './api.js';
import Notiflix, { Notify } from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';

const simpleLightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionDelay: 250,
});

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const searchImagesApi = new SearchImagesApi();

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', fetchImagesCards);

function createMarkup(hits) {
  return `
 <div class="photo-card">
  <a href=${hits.largeImageURL}><img src=${hits.webformatURL} alt=${hits.tags} class="image" width="300" height="270" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${hits.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${hits.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${hits.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${hits.downloads}</b>
    </p>
  </div>
 </div>
  `;
}
function addCards(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
}
function clearGallery() {
  gallery.innerHTML = '';
}

function onSubmit(evt) {
  evt.preventDefault();

  const inputValue = evt.currentTarget.elements.searchQuery.value.trim();
  if (inputValue.length === 0) {
    return;
  }
  searchImagesApi.searchQuery = inputValue;
  searchImagesApi.currentHits = 0;

  searchImagesApi.resetPage();

  clearGallery();
  fetchImagesCards();
  loadMoreBtn.classList.remove('hidden');
}

async function fetchImagesCards() {
  try {
    const imageCards = await searchImagesApi.getImages();
    if (imageCards.totalHits === 0) {
      loadMoreBtn.classList.add('hidden');
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      Notify.success(
        `Hooray! We found ${
          imageCards.totalHits - searchImagesApi.currentHits
        } images.`
      );
      const markup = imageCards.hits.reduce(
        (acc, card) => createMarkup(card) + acc,
        ''
      );
      addCards(markup);
      simpleLightbox.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      searchImagesApi.currentHits += imageCards.hits.length;

      if (searchImagesApi.currentHits >= imageCards.totalHits) {
        loadMoreBtn.classList.add('hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

