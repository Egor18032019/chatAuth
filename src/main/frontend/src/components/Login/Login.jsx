import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { url, BASE_URL_API, auth, login } from '../../utils/const';
import './Login.css';
const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      setEmail('');
      setPassword('');
      setEmailError('');
      setPasswordError('');
    };
  }, []);

  const onButtonClick = () => {
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Please enter your email');
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if (!password) {
      setPasswordError('Please enter a password');
      return;
    }

    if (password.length < 4) {
      setPasswordError('The password must be at least 4 characters');
      return;
    }

    logIn();
  };

  const logIn = () => {
    fetch(url + BASE_URL_API + auth + login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.token) {
          localStorage.setItem('user', JSON.stringify({ email, token: data.token }));

          dispatch({
            type: 'LOGIN',
            payload: {
              email,
              token: data.token,
            },
          });

          navigate('/');
        } else {
          window.alert('Wrong email or password');
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        window.alert('An error occurred during login.');
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onButtonClick();
    }
  };

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={'inputBox'}
          onKeyDown={handleKeyDown}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
          type="password"
          onKeyDown={handleKeyDown}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          className={'inputButton'}
          type="button"
          onClick={onButtonClick}
          value={'Log in'}
        />
      </div>
    </div>
  );
};

export default Login;