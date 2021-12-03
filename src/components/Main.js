import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Card from './Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick }) {
  // Подписываемся на контекст CurrentUserContext
  const currentUser = React.useContext(CurrentUserContext);
  // стейт для хранения карточек
  const [cards, setCards] = useState([]);

  // Получаем данные карточек с сервера 
  useEffect(() => {
    api.getInitialCards()
      .then((cards) => {
        setCards(cards.map((card) => ({
          key: card._id,
          id: card._id,
          idOwner: card.owner._id,
          name: card.name,
          link: card.link,
          likes: card.likes,
        })));
      })
      .catch((err) => { console.log(err) }) // выведем ошибку в консоль 
  }, []);

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

  // обработчик удаления карточки
  const handleCardDelete = ({id}) => {
    console.log(id)
    api.deleteCardToServer(id)
    .then(() => {
      const newCard = cards.filter((c)=>{
        return id !== c.id
      })
      // Обновляем стейт
      setCards(newCard);
    })
    .catch((err) => { console.log(err) }) // выведем ошибку в консоль
  }


  return (
    <main className="content">
      <section className="profile">
        <div className="profile__info">
          <div className="profile__container">
            <div className="profile__avatar" style={{ backgroundImage: `url(${currentUser.avatar})` }}></div>
            <div className="profile__overlay" onClick={onEditAvatar}>
              <div className="profile__edit-avatar" ></div>
            </div>
          </div>
          <div className="profile__text">
            <h1 className="profile__full-name">{currentUser.name}</h1>
            <button className="profile__edit" type="button" onClick={onEditProfile}></button>
            <p className="profile__description">{currentUser.about}</p>
          </div>
        </div>
        <button className="profile__add-card" type="button" onClick={onAddPlace}></button>
      </section>
      <section>
        <ul className="elements">
          {cards.map(({ key, ...props }) => (<Card key={key} {...props} onCardClick={onCardClick} onCardLike={handleCardLike} onCardDelete={handleCardDelete} />))}
        </ul>
      </section>
    </main>
  );

};

export default Main;
