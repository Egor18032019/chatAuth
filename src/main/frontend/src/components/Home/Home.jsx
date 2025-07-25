import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from "../../providers/AuthProvider"
const Home = () => {
  const { state, dispatch } = useContext(AuthContext)
  const navigate = useNavigate()

  const onButtonClick = () => {
    // You'll update this function later
    console.log("onButtonClick")
    if (state.isLoggedIn) {
      localStorage.removeItem('user')
      dispatch({
        type: 'LOGOUT',
        payload: {
          email: "",
          token: ""
        }
      });
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="mainContainer">
      <div className={'titleContainer'}>
        <div>Welcome!</div>
      </div>
      <div>This is the home page.</div>
      <div className={'buttonContainer'}>
        <input
          className={'inputButton'}
          type="button"
          onClick={onButtonClick}
          value={state.isLoggedIn ? 'Log out' : 'Log in'}
        />
        {state.isLoggedIn ? <p>Your email address is {state.email}</p> : <div />}
      </div>
    </div>
  )
}

export default Home