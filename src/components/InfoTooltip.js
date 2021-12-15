import React from "react";
import imageNo from "../images/no.png";
import imageOk from "../images/ok.png";

function InfoTooltip ({ registerOk, isOpen, onClose }) {
    isOpen = true;
    registerOk = false;
    return (
        <section className={ `info-tooltip popup ${isOpen ? 'popup_opened' : ''}` }>
            <div className="info-tooltip__content popup__content">
                <button className="popup__close" type="button" onClick={ onClose }></button>
                <div className="info-tooltip__image" style={ { backgroundImage: `url(${registerOk ? imageOk : imageNo})` } }/>
                <h2 className="info-tooltip__title popup__title">{ `${registerOk ?"Вы успешно зарегистрировались!":"Что-то пошло не так! Попробуйте ещё раз."}`}</h2>
            </div>
        </section>
    );
};

export default InfoTooltip;