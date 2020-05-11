import React from 'react';
import './logIn.css';

import Register from './register/register';
import RegisterMerchant from './registerMechant/registerMerchant';
import Home from '../home/home';
import MerchantHome from '../merchantHome/merchantHome';


class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: { text: '', val: '' },
      password: { text: '' },
      loginVal: '',
      user: '',
      login: true,
      registerUser: false,
      registerMerchant: false,
      auth: false,
      type: 'user'
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.leaveTextbox = this.leaveTextbox.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.regMerchant = this.regMerchant.bind(this);
    this.regUser = this.regUser.bind(this);
    this.merchantlogin = this.merchantlogin.bind(this);

  }

  handleChange(event) {
    this.setState({ [event.target.name]: { text: event.target.value } })
  }


  leaveTextbox(event) {
    if (!event.target.value) {
      this.setState({ [event.target.name]: { val: '' } })
    }
    return;
  }

  handleLogin(event) {
    const userToLogin = {
      email: this.state.email.text,
      password: this.state.password.text,
      type: this.state.type
    }
    if (!userToLogin.password && !userToLogin.email) {
      this.setState({
        password: { text: this.state.password.text, val: 'please provide your password' },
        email: { text: this.state.password.text, val: 'please provide your email' }
      })
    }
    if (!userToLogin.password) {
      this.setState({ password: { text: this.state.password.text, val: 'please provide your password' } })
    } else if (!userToLogin.email) {
      this.setState({ email: { text: this.state.password.text, val: 'please provide your email' } })
    } else if (!userToLogin.email.includes("@")) {
      this.setState({ email: { text: this.state.email.text, val: 'please provide a valid email' } })
    } else {
      let status;
      fetch('http://localhost:3005/api/login',
        { method: 'POST', body: JSON.stringify(userToLogin), mode: 'cors', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
        .then(res => {
          status = res.status
          return res.json()
        })
        .then(data => {
          console.log(data)
          if (status == 200) {
            return this.setState({ user: data, auth: true })
          } else {
            this.setState({ loginVal: data.message })
          }
        })
        .catch(err => {
          this.setState({ loginVal: 'we encountered an error' })
        })

    }
  }

  checkLogin() {
    let status;
    console.log('checkLogin')
    fetch('http://localhost:3005/api/login/authenticate',
      { method: 'POST', mode: 'cors', credentials: 'include' })
      .then(res => {
        status = res.status
        return res.json()
      })
      .then(data => {
        if (status == 200) {

          return this.setState({ auth: true, user: data.user, type: data.user.type })
        }
      })
      .catch(err => {
        this.setState({ loginVal: 'we encountered an error' })
      })
  }

  logout() {
    fetch('http://localhost:3005/api/login/',
      { method: 'Delete', mode: 'cors', credentials: 'include' })
      .then(res => {
        if (res.status == 200) {
          return this.setState({
            email: { text: '', val: '' },
            password: { text: '' },
            loginVal: '',
            user: '',
            login: true,
            registerUser: false,
            registerMerchant: false,
            auth: false,
            type: 'user'
          })

        } else {
          console.log('error')
        }
      })
  }
  regUser() {
    this.setState({ login: false, registerUser: true })
  }
  regMerchant() {
    this.setState({ login: false, registerMerchant: true })
  }
  merchantlogin(event) {
    if (this.state.type == 'user') {
      this.setState({ type: 'merchant' })
    } else {
      this.setState({ type: 'user' })
    }
  }
  componentDidMount() {
    this.checkLogin()
  }

  render() {
    if (this.state.auth && this.state.type == 'user') {
      return (
        <div>
          <Home logout={this.logout}/>
        </div>
      )

    } else if (this.state.auth && this.state.type == 'merchant') {
      return (
        <div>
          <MerchantHome />
          <button onClick={this.logout}>Logout</button>
        </div>
      )

    } else {
      if (this.state.login) {
        return (
          <div id="login">

            <div className="head">
              <h1>thrift<span className="green">r</span></h1>
            </div>

            <div className="merchantLoginIndicator">
              {this.state.type == 'merchant' ? <h2>merchan<span className="green">t</span></h2> : ' '}
            </div>

            <div className="loginInputs">
              <p className="val">{this.state.email.val}</p>
              <input type="text"
              className="email"
                name="email"
                value={this.state.email.text}
                onChange={this.handleChange}
                onFocus={this.handleFirstClick}
                onBlur={this.leaveTextbox}
                placeholder="email" >
              </input>

              <p className="val">{this.state.password.val}</p>
              <input type="password"
              className="password"
                name="password"
                value={this.state.password.text}
                onChange={this.handleChange}
                onFocus={this.handleFirstClick}
                onBlur={this.leaveTextbox}
                placeholder="password" >
              </input>
            </div>

            <div className="loginButton">
              <button onClick={this.handleLogin}>login</button>
              <p>{this.state.loginVal}</p>
            </div>

            <div className="loginAsMerchant">
              <label className="checkmarkContainer">login as merchant
                <input type="checkbox" onClick={this.merchantlogin} value={true} ></input>
                <span className="checkmark"></span>
              </label>
            </div>


            <div className="registerButton">
              <button onClick={this.regUser}>register as a new user</button>
              <button onClick={this.regMerchant}>register as a new merchant</button>
            </div>

          </div>
        )
      } if (this.state.registerUser) {
        return (
          <div>
            <Register />
          </div>
        )
      }
      if (this.state.registerMerchant) {
        return (
          <div>
            <RegisterMerchant />
          </div>
        )
      }

    }


  }
}

export default Login;