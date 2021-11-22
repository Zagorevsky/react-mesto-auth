import React from "react";

function PopupWithForm({ title, name, children, button, isOpen, onClose }) {
    return (
        <section className={`popup popup_${name} ${isOpen ? 'popup_opened' : ''}`}>
            <div className={`popup__content popup__content_${name}`}>
                <button className="popup__close" type="button" onClick={onClose}></button>
                <h2 className="popup__title">{title}</h2>
                <form className="popup__form" name={`${name}`} novalidate>
                    {children}
                    <button className="popup__button" type="submit">{button}</button>
                </form>
            </div>
        </section>
    );

};

export default PopupWithForm;