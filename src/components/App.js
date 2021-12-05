import Header from "./Header.js";
import Footer from "./Footer.js";
import Main from "./Main.js";
import ImagePopup from "./ImagePopup.js";
import PopupWithForm from "./PopupWithForm.js";
import EditProfilePopup from "./EditProfilePopup.js";
import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
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

  useEffect(() => {
    api.getInitialProfile()
      .then((profile) => {
        setCurrentUser({
          avatar: profile.avatar,
          name: profile.name,
          about: profile.about,
          id: profile._id
        })
      })
      .catch((err) => { console.log(err) }) // выведем ошибку в консоль
  }, []);


  // закрытие всех попапов в одном обработчике
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({ name: '', link: '' });
  };

  //
  const handleUpdateUser = (profile) => {
    api.addProfileToServer(profile)
    .then((profile) => {
      setCurrentUser({
        avatar: profile.avatar,
        name: profile.name,
        about: profile.about,
        id: profile._id
      })
    })
    .catch((err) => { console.log(err) }); // выведем ошибку в консоль
    closeAllPopups();
  }

  return (
    <CurrentUserContext.Provider value={ currentUser }>
      <div className="page">
        <div className="page__container">
          <Header />
          <Main
            onEditAvatar={ () => setIsEditAvatarPopupOpen(true) }
            onEditProfile={ () => setIsEditProfilePopupOpen(true) }
            onAddPlace={ () => setIsAddPlacePopupOpen(true) }
            // пробрасываем через модуль Main обработчик открытия попапа - Большая картинка
            onCardClick={ setSelectedCard }
          />
          <Footer />
          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
          <PopupWithForm title='Новое место' name='card' button='Создать' isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}>
            <div className="popup__block-input"><input id="card-title" className="popup__input" type="text" name="name"
              placeholder="Название" required minLength="1" maxLength="30" />
              <span id="card-title-error" className="popup__error"></span>
            </div>
            <div className="popup__block-input"><input id="card-link" className="popup__input" type="url" name="link"
              placeholder="Ссылка на картинку" required />
              <span id="card-link-error" className="popup__error"></span>
            </div>
          </PopupWithForm>
          {/* передаем состояние и данные в модуль через пропс - card
        и забираем сигнал закрытия попапа через пропс - onClose */}
          <ImagePopup card={ selectedCard } onClose={ closeAllPopups } />
          <PopupWithForm title='Вы уверены?' name='delit' button='Да' />
          <PopupWithForm title='Обновить аватар' name='avatar' button='Сохранить' onUpdateUser={handleUpdateUser} isOpen={ isEditAvatarPopupOpen } onClose={ closeAllPopups }>
            <div className="popup__block-input"><input id="avatar-link" className="popup__input" type="url" name="avatar"
              placeholder="Ссылка на аватар" required />
              <span id="avatar-link-error" className="popup__error"></span>
            </div>
          </PopupWithForm>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
