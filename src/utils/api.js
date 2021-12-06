// импортируем ключ авторзации на сервере
import {authorization} from './utils.js'

// используем готовый класс из прошлой работы для получения данных с сервера
class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _handlerError = (res) => {
    if (res.ok) {
      return res.json();
    }
    // если ошибка, отклоняем промис
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  // запрос карточек из базы данных
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._handlerError);
  }

  // запрос данных профиля с сервера
  getInitialProfile() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._handlerError);
  }

  // запись новой карточки на сервер
  addCardToServer(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data)
    })
      .then(this._handlerError);
  }

  // запись данных профиля на серве
  updateProfileToServer(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data)
    })
      .then(this._handlerError);
  }

  // запись данных  автара на серве
  updateAvatarToServer(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data)
    })
      .then(this._handlerError);
  }

  // спереключатель лайков на сервере
  changeLikeCardStatus(id, isLiked) {
    return isLiked ?  this._addLikesToServer(id) :this._deleteLikesToServer(id)
  }

  // добавить лайк на сервер
  _addLikesToServer(id) {
    return fetch(`${this._baseUrl}/cards/likes/${id}`, {
      method: 'PUT',
      headers: this._headers,
    })
      .then(this._handlerError);
  }

  // удалить лайк с сервера
  _deleteLikesToServer(id) {
    return fetch(`${this._baseUrl}/cards/likes/${id}`, {
      method: 'DELETE',
      headers: this._headers,
    })
      .then(this._handlerError);
  }

  // удалить карту с сервера
  deleteCardToServer(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: this._headers,
    })
      .then(this._handlerError);
  }

}

// создаем экземпляр класса Api и экспоортируем его
export const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-29',
  headers: {
    authorization: authorization,
    'Content-Type': 'application/json'
  }
});
