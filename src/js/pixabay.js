import newsService from './services/apiService';
import spinner from './spinner';
import hitsListItemsTemplate from '../templates/gallery-list-items.hbs';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import * as basicLightbox from 'basiclightbox';
import 'basicLightbox/dist/basicLightbox.min.css';

const instance = basicLightbox.create(`
	<h1>Dynamic Content</h1>
	<p>You can set the content of the lightbox with JS.</p>
`);

// console.log(basicLightbox);

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryList: document.querySelector('#gallery-list'),
  photoCard: document.querySelector('.js-photo-card'),
  loadMoreBtn: document.querySelector('button[data-action="load-more"]'),
};

refs.searchForm.addEventListener('submit', searchFormSubmitHandler);
refs.loadMoreBtn.addEventListener('click', loadMoreBtnHandler);

refs.galleryList.addEventListener('click', galleryClickHandler);

function galleryClickHandler(e) {
  e.preventDefault();

  if (e.target.nodeName === 'IMG') {
    const imagURL = e.target.getAttribute('data-src');
    basicLightbox
      .create(`<img width="1400" height="900" src="${imagURL}">`)
      .show();
  }
}

function searchFormSubmitHandler(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const input = form.elements.query;

  clearListItems();

  newsService.resetPage();
  newsService.searchQuery = input.value;
  fetchArticles();
  input.value = '';
}

function loadMoreBtnHandler() {
  fetchArticles();
}

function fetchArticles() {
  spinner.show();

  newsService
    .fetchArticles()
    .then(showArticles(), toastr.success('Search New!'))
    .catch(error => {
      toastr.error('ERROR!');
      console.warn(error);
    });
}

function showArticles(hits) {
  return hits => {
    spinner.hide();
    insertListItems(hits);
  };
}

function insertListItems(items) {
  const markup = hitsListItemsTemplate(items);
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
}

function clearListItems() {
  refs.galleryList.innerHTML = '';
}
