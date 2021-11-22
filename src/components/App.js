import Header from "./Header.js";
import Footer from "./Footer.js";
import Main from "./Main.js";
import ImagePopup from "./ImagePopup.js";
import PopupWithForm from "./PopupWithForm.js";
import React, { useState } from 'react';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);

  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState('');

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard('');
  };

  return (
    <body className="page">
      <div className="page__container">
        <Header />
        <Main
          onEditAvatar={() => setIsEditAvatarPopupOpen(true)}
          onEditProfile={() => setIsEditProfilePopupOpen(true)}
          onAddPlace={() => setIsAddPlacePopupOpen(true)}
          onCardClick={setSelectedCard}
        />
        <Footer />
        <PopupWithForm title='Редактировать профиль' name='profile' button='Сохранить' isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}>
          <div className="popup__block-input"><input id="full-name" className="popup__input" type="text" name="fullname"
            required minlength="2" maxlength="40" />
            <span id="full-name-error" className="popup__error"></span>
          </div>
          <div className="popup__block-input"><input id="description" className="popup__input" type="text" name="description"
            required minlength="2" maxlength="200" />
            <span id="description-error" className="popup__error"></span>
          </div>
        </PopupWithForm>
        <PopupWithForm title='Новое место' name='card' button='Создать' isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}>
          <div className="popup__block-input"><input id="card-title" className="popup__input" type="text" name="name"
            placeholder="Название" required minlength="1" maxlength="30" />
            <span id="card-title-error" className="popup__error"></span>
          </div>
          <div className="popup__block-input"><input id="card-link" className="popup__input" type="url" name="link"
            placeholder="Ссылка на картинку" required />
            <span id="card-link-error" className="popup__error"></span>
          </div>
        </PopupWithForm>
        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
        <PopupWithForm title='Вы уверены?' name='delit' button='Да' />
        <PopupWithForm title='Обновить аватар' name='avatar' button='Сохранить' isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}>
          <div className="popup__block-input"><input id="avatar-link" className="popup__input" type="url" name="avatar"
            placeholder="Ссылка на аватар" required />
            <span id="avatar-link-error" className="popup__error"></span>
          </div>
        </PopupWithForm>
      </div>
    </body>
  );
}

export default App;
