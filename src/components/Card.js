import React from "react";

function Card({ name, link, likes, onCardClick }) {
    const handleCardClick = () => {
        onCardClick({ name, link });
    };

    return (
        <li className="element">
            <button className="element__trash" type="button"></button>
            <div className="element__foto" style={{ backgroundImage: `url(${link})` }} onClick={handleCardClick} />
            <div className="element__blok">
                <h2 className="element__title">{name}</h2>
                <div className="element__blok-likes">
                    <button className="element__like" type="button"></button>
                    <div className="element__number-likes" >{likes}</div>
                </div>
            </div>
        </li>
    );

};

export default Card;