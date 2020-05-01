import newsService from './services/apiService';
import { infScrollObserver } from './ObserverInfScroll';
import spinner from './spinner';
import hitsListItemsTemplate from '../templates/gallery-list-items.hbs';

import { alert, notice, info, success, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/BrightTheme.css';
import '@pnotify/core/Material.css';

import 'material-design-icons/iconfont/material-icons.css';

import * as basicLightbox from 'basiclightbox';
import 'basicLightbox/dist/basicLightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryList: document.querySelector('#gallery-list'),
  target: document.querySelector('#sentinel'),
  // loadMoreBtn: document.querySelector('button[data-action="load-more"]'),
};

refs.searchForm.addEventListener('submit', searchFormSubmitHandler);
// refs.loadMoreBtn.addEventListener('click', loadMoreBtnHandler);

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
  infScrollObserver(refs.target);
  // fetchArticles();
  input.value = '';
}

function loadMoreBtnHandler() {
  loadArticles();
}

function loadArticles() {
  spinner.show();

  newsService
    .fetchArticles()
    .then(data => {
      if (!data.length) {
        error({
          text: 'Search NOT FIND!',
        });
      }
      return data;
    })
    .then(
      showArticles(),
      success({
        text: 'Search New!',
      }),
    )

    .catch(error => {
      error({
        text: 'ERROR!',
      });

      console.warn(error);
    });
}

function showArticles(hits) {
  const position = refs.target.innerHeight;
  // const position = window.scrollY + window.innerHeight;

  return hits => {
    spinner.hide();
    insertListItems(hits);
    window.scrollTo({
      top: position,
      behavior: 'smooth',
    });
  };
}

function insertListItems(items) {
  const markup = hitsListItemsTemplate(items);
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
}

function clearListItems() {
  refs.galleryList.innerHTML = '';
}

export { loadArticles, showArticles, insertListItems };
