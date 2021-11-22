import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Card from './Card.js';

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick}) {
  const [userAvatar, setUserAvatar] = useState('');
  const [userName, setUserName] = useState('Жак-Ив Кусто');
  const [userDescription, setUserDescription] = useState('Исследователь океана');
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([api.getInitialProfile(), api.getInitialCards()])
      .then(([profile, cards]) => {
        setUserAvatar(profile.avatar);
        setUserName(profile.name);
        setUserDescription(profile.about);
        setCards(cards.map((item)=>({
          id: item._id,
          name: item.name,
          link: item.link,
          likes: item.likes.length,
        })));
      })
      .catch((err) => {console.log(err)}) // выведем ошибку в консоль
  
    }, []);


  return (
    <main classNameName="content">
      <section className="profile">
        <div className="profile__info">
          <div className="profile__container">
            <img className="profile__avatar"  alt="" style={{ backgroundImage: `url(${userAvatar})` }} />
            <div className="profile__overlay" onClick={onEditAvatar}>
              <div className="profile__edit-avatar" ></div>
            </div>
          </div>
          <div className="profile__text">
            <h1 className="profile__full-name">{userName}</h1>
            <button className="profile__edit" type="button" onClick={onEditProfile}></button>
            <p className="profile__description">{userDescription}</p>
          </div>
        </div>
        <button className="profile__add-card" type="button" onClick={onAddPlace}></button>
      </section>
      <section>
        <ul className="elements">
          { cards.map(({ id, ...props }) => <Card key={id} {...props} onCardClick={onCardClick}/>) }
        </ul>
      </section>
    </main>
  );

};

export default Main;