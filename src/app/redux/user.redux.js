import axios from 'axios';
import browserCookie from 'browser-cookies';
import { error } from '../components/message/message'
import { baseUrl } from '../api/config';

const LOGIN = 'LOGIN';
const LOGINOUT = 'LOGINOUT';
const LOAD_DATA = 'LOAD_DATA';
const ERROR_MSG = 'ERROR_MSG';

const initState = {
  username: '',
  phone: '',
  msg: '',
  userinfo: false,
  redirectTo: ''
}

export function user(state = initState, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, ...action.payload, redirectTo: '/' }
    case LOAD_DATA:
        return { ...state, ...action.payload }
    case ERROR_MSG:
      return { ...state, isAuth: false, msg: action.msg }
    case LOGINOUT:
      return { ...initState, redirectTo: '/login' }
    default:
      return state
  }
}

function authSuccess(obj) {
  const {password, ...data} = obj;
  return { type: LOGIN, payload: data }
}

function errorMsg(msg) {
  return { msg, type: ERROR_MSG }
}

//登录
export function login({ username, password, remember }) {
  return dispatch => {
    axios.post(`${baseUrl}/clientboard/login`, { loginName: username, password })
      .then(res => {
        if (res.status === 200 && res.data.code === 0) {
          if (remember) {
            browserCookie.set('phone', res.data.data.phone, { expires: 1 });
            browserCookie.set('username', res.data.data.username, { expires: 1 });
          }
          dispatch(authSuccess(res.data.data))
        } else {
          error(res.data.msg)
          dispatch(errorMsg(res.data.msg))
        }
      })
  }
}
// 是否登录
export function loadData(data) {
  return { type: LOAD_DATA, payload: data }
}
// 退出登录
export function logoutSubmit() {
  return { type: LOGINOUT}
}
