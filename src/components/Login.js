import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as auth from '../utils/auth.js';


export default function Login({ onLogin }) {
  const [values, setValues] = useState({
    username: '',
    password: '',
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues(v => ({
      ...v,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.username || !values.password) {
      return
    }

    auth
      .authorize(values.password, values.username)
      .then(res => {
        if (res.token) {
          setValues({ username: '', password: '' });
          localStorage.setItem('token', res.token);
          onLogin();
          navigate('/')
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="auth">
      <p className="auth__title">Вход</p>
      <form onSubmit={ handleSubmit } className="auth__form">
        <input className="auth__input" required id="username" name="username"
          placeholder="Email" type="email" value={ values.username } onChange={ handleChange } />
        <input className="auth__input" required id="password" name="password"
          placeholder="Пароль" type="password" value={ values.password } onChange={ handleChange } />
        <div className="login__button-container">
          <button type="submit" className="auth__button">Войти</button>
        </div>
      </form>
    </div>
  )
}
