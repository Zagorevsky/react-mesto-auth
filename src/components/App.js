import React, { useState, useEffect } from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import Header from "./Header.js";
import Footer from "./Footer.js";
import Main from "./Main.js";
import ImagePopup from "./ImagePopup.js";
import PopupWithForm from "./PopupWithForm.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import Login from './Login.js';
import Register from './Register.js';
import ProtectedRoute from './ProtectedRoute.js'
import { api } from '../utils/api.js';
import * as auth from '../utils/auth.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function App() {
  // стейт для хранения состояния попап редактировать профиль пользователя
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  // стейт для хранения состояния попап Новая картинка
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  // стейт для хранения состояния попап аватар
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  // стейт для хранения состояния и данных попапа - Большая картинка
  const [selectedCard, setSelectedCard] = useState({ name: '', link: '' });
  // стейт для хранения данных пользователя
  const [currentUser, setCurrentUser] = useState({ avatar: '', name: '', about: '', id: '' });

  // стейт для хранения карточек
  const [cards, setCards] = useState([]);

  // стейт для хранения состояния авторизации
  const [loggedIn, setLoggedIn] = useState(false);

  // стейт для хранения логина - е-маила
  const [login, setLogin] = useState('')

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    handleTokenCheck(location.pathname)
  }, [])

  // установка состояния авторизованный пользователь
  const handleLogin = () => {
    setLoggedIn(true)
  }

  // проверка текущей авторизации
  const handleTokenCheck = (path) => {
    if (localStorage.getItem('token')) {
      auth
        .checkToken(localStorage.getItem('token'))
        .then(res => {
          if (res) {
            setLogin(res.data.email)
            setLoggedIn(true)
            navigate(path)
          }
        })
    }
  }

  // выход - сброс авторизации
  const handleLogout = (event) => {
    event.preventDefault()
    localStorage.removeItem('token')
    setLoggedIn(false)
    navigate('/sign-in')
  }

  // Первичная загрузка всех данных с сервера
  useEffect(() => {
    Promise.all([api.getInitialProfile(), api.getInitialCards()])
      .then(([profile, cards]) => {
        setCurrentUser({
          avatar: profile.avatar,
          name: profile.name,
          about: profile.about,
          id: profile._id
        })
        setCards(cards.map((card) => ({
          key: card._id,
          id: card._id,
          idOwner: card.owner._id,
          name: card.name,
          link: card.link,
          likes: card.likes,
        })));
      })
      .catch((err) => { console.log(err); })
  }, []);

  // Добавить-удалить лайк на сервер
  const handleCardLike = (card) => {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser.id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card.id, !isLiked)
      .then((newCard) => {
        // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
        const newCards = cards.map((c) => c.id === card.id ? {
          key: newCard._id,
          id: newCard._id,
          idOwner: newCard.owner._id,
          name: newCard.name,
          link: newCard.link,
          likes: newCard.likes,
        } : c);
        // Обновляем стейт
        setCards(newCards);
      })
      .catch((err) => { console.log(err) }) // выведем ошибку в консоль
  }

  // Удаление своей карточки с сервера
  const handleCardDelete = ({ id }) => {
    api.deleteCardToServer(id)
      .then(() => {
        const newCard = cards.filter((c) => {
          return id !== c.id
        })
        // Обновляем стейт
        setCards(newCard);
      })
      .catch((err) => { console.log(err) }) // выведем ошибку в консоль
  }

  // закрытие всех попапов в одном обработчике
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({ name: '', link: '' });
  };

  const handleUpdateUser = (profile) => {
    api.updateProfileToServer(profile)
      .then((newProfile) => {
        setCurrentUser({
          avatar: newProfile.avatar,
          name: newProfile.name,
          about: newProfile.about,
          id: newProfile._id
        })
        closeAllPopups();
      })
      .catch((err) => { console.log(err) }); // выведем ошибку в консоль
  }

  const handleUpdateAvatar = (profile) => {
    api.updateAvatarToServer(profile)
      .then((newProfile) => {
        setCurrentUser({
          avatar: newProfile.avatar,
          name: newProfile.name,
          about: newProfile.about,
          id: newProfile._id
        })
        closeAllPopups();
      })
      .catch((err) => { console.log(err) }); // выведем ошибку в консоль
  }

  const handleAddPlaceSubmit = (card) => {
    api.addCardToServer(card)
      .then((newCard) => {
        setCards([{
          key: newCard._id,
          id: newCard._id,
          idOwner: newCard.owner._id,
          name: newCard.name,
          link: newCard.link,
          likes: newCard.likes,
        }, ...cards]);
        closeAllPopups();
      })
      .catch((err) => { console.log(err) }); // выведем ошибку в консоль
  }

  return (
    <CurrentUserContext.Provider value={ currentUser }>
      <div className="page">
        <div className="page__container">
          <Header loggedIn={loggedIn} logOut={handleLogout} login={login}/>
          <Routes>
            <Route path="/" element={ <ProtectedRoute loggedIn={loggedIn}>
                <Main
                  onEditAvatar={ () => setIsEditAvatarPopupOpen(true) }
                  onEditProfile={ () => setIsEditProfilePopupOpen(true) }
                  onAddPlace={ () => setIsAddPlacePopupOpen(true) }
                  onCardClick={ setSelectedCard }
                  cards={ cards }
                  onCardLike={ handleCardLike }
                  onCardDelete={ handleCardDelete }
                />
              </ProtectedRoute>} />
            <Route path="/sign-up" element={ <Register /> } />
            <Route path="/sign-in" element={ <Login onLogin={ handleLogin } /> } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
          <EditProfilePopup isOpen={ isEditProfilePopupOpen } onClose={ closeAllPopups } onUpdateUser={ handleUpdateUser } />
          <AddPlacePopup isOpen={ isAddPlacePopupOpen } onClose={ closeAllPopups } onAddPlace={ handleAddPlaceSubmit } />
          <ImagePopup card={ selectedCard } onClose={ closeAllPopups } />
          <PopupWithForm title='Вы уверены?' name='delit' button='Да' />
          <EditAvatarPopup isOpen={ isEditAvatarPopupOpen } onClose={ closeAllPopups } onUpdateAvatar={ handleUpdateAvatar } />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
