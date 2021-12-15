import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as auth from '../utils/auth';

export default function Register() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(v => ({
      ...v,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (values.password !== '') {
      auth
        .register(values.password, values.email)
        .then(res => {
          if (res.statusCode !== 400 && res.statusCode !== 401) {
            navigate('/sign-in')
          }
        })
        .catch(err => console.log(err))
    }
  }

  return (
    <div className="auth">
      <p className="auth__title">
        Регистрация
      </p>
      <form onSubmit={ handleSubmit } className="register__form">
        <input className="auth__input" id="email" name="email" type="email"
        value={ values.email } onChange={ handleChange } />
        <input className="auth__input" id="password" name="password" type="password"
        value={ values.password } onChange={ handleChange } />
        <button className="auth__button" type="submit" onSubmit={ handleSubmit }>Зарегистрироваться</button>
      </form>
      <div className="auth__menu">
        <p className="auth__menu-text">Уже зарегистрированы?</p>
        <Link to="/sign-in" className="auth__menu-link">Войти</Link>
      </div>
    </div>
  )
}
