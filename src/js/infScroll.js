import InfiniteScroll from 'infinite-scroll';
import hitsListItemsTemplate from '../templates/gallery-list-items.hbs';

const baseUrl = 'https://pixabay.com/api/';
const key = '16133219-b7191e329ab916084dd10c777';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('#gallery-list'),
  loadMoreBtn: document.querySelector('button[data-action="load-more"]'),
};

refs.searchForm.addEventListener('submit', searchFormSubmitHandler);

const OptionInfScroll = {
  responseType: 'json',
  history: false,
  query: '',
  path() {
    return `https://cors-anywhere.herokuapp.com/${baseUrl}?image_type=photo&orientation=horizontal&q=${this.query}&page=${this.pageIndex}&per_page=12&key=${key}`;
  },
};

const infScrollInstance = new InfiniteScroll(
  refs.galleryContainer,
  OptionInfScroll,
);

// ===================

// infScrollInstance.on( 'error', function( error, path ) {...})
// infScrollInstance.on( 'last', function( response, path ) {...});
// infScrollInstance.on('last', function(response, path, items) { alert('last'); });

infScrollInstance.on('load', ({ hits }, url) => {
  console.group(url);
  console.log(hits);
  console.log('pageIndex: ', infScrollInstance.pageIndex);
  console.groupEnd(url);

  const markup = hitsListItemsTemplate(hits);
  const proxyEl = document.createElement('div');
  proxyEl.innerHTML = markup;

  const parsedItems = proxyEl.querySelectorAll('.gallery-card');
  infScrollInstance.appendItems(parsedItems);

  refs.loadMoreBtn.remove();
});

function searchFormSubmitHandler(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const input = form.elements.query;

  OptionInfScroll.query = input.value;

  refs.galleryContainer.innnerHTML = '';
  infScrollInstance.pageIndex = 1;
  infScrollInstance.option({
    path() {
      return `https://cors-anywhere.herokuapp.com/https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.query}&page=${this.pageIndex}&per_page=12&key=16133219-b7191e329ab916084dd10c777`;
    },
  });

  infScrollInstance.loadNextPage();
  return input.value;
}
