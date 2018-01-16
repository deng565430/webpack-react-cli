import { getboardnewtable, getClientInfo, getContact } from '../api/user';
import { message } from 'antd';
import { timeFormat } from '../util/util'

message.config({
  top: 120,
  duration: 1,
});

const GETTABLEDATA = 'GETTABLEDATA';
const GETUSERINFO = 'GETUSERINFO';
const GETCONTANCTLIST = 'GETCONTANCTLIST';
const SELECTTABLEDATA = 'SELECTTABLEDATA';
const UPDATACLIENT = 'UPDATACLIENT';

const initState = {
  data: [],
  recordsTotal: '',
  urlPath: '',
  page: 1,
  clientInfo: {},
  contactList: []
}

export function userdata(state = initState, action) {
  switch (action.type) {
    case GETTABLEDATA:
      return { ...state, ...action.payload}
    case GETUSERINFO:
      return { ...state, ...action.clientInfo }
    case GETCONTANCTLIST:
      return { ...state, ...action.contactList }
    case UPDATACLIENT:
      state.clientInfo[action.msg] = action.select
      return { ...state}
    case SELECTTABLEDATA:
      filterData(state.data, action)
      return { ...state, selectUserPhone: action.select }
    default:
      return state  
  }
}

function filterData(data, action) {
  return data.filter(item => {
    if (item.phone === action.select) {
      item.rowClassName= 'background-name'
      if (action.msg) {
        const msg = action.msg.length > 10 ? action.msg.substr(0, 8) + '...' : action.msg
        item.isSelect = true
        item.msg = msg
        item.createtime = timeFormat('yyyy-MM-dd', new Date())
      }
    } else {
      if (item.isSelect) {
        item.rowClassName = 'color-name'
      } else {
        item.rowClassName = null
      }
    }
    return item
  })
}

function updataClientInfo(client) {
  const data = []
  client.practiceStatuses.filter(v => {
    v.label = v.value
    if (v.status) {
      data.push(v.value)
    }
    return v
  })
  client.checkOptionsDefaultValue = data
  return client
}

function authSuccess(data) {
  return { type: GETTABLEDATA, payload: data }
}

// 获取点击的用户信息
function getclientInfo(data) {
  return { type: GETUSERINFO, clientInfo: data }
}

// 获取聊天详情
function getContactList(data) {
  return { type: GETCONTANCTLIST, contactList: data }
}

// 选择指定的table行
export function selectTableList(data, msg) {
  return { type: SELECTTABLEDATA, select: data, msg }
}
// 更新从业状态和自定义标签
export function updata(data, msg) {
  return { type: UPDATACLIENT, select: data, msg }
}

// 获取table 列表数据
export function getTable(data) {
  message.destroy()
  message.loading('加载中', 0)
  data = Object.assign({}, {
    phone: null,
    label: null,
    day: '7',
    start: 0,
    length: 20,
    sign: 'all'
  }, { ...data })
  const urlPath = (data && data.sign) ? data.sign : 'all'
  const page = (data && data.start) ? data.start + 1 : 1
  return dispatch => {
    getboardnewtable(data).then(res => {
      let data = [], recordsTotal, clientInfo, selectUserPhone;
      if (res.data.draw === 0) {
        recordsTotal = res.data.recordsTotal
        if (res.data.data.length > 0) {
          const datalist = res.data.data
          for (let i = 0; i < datalist.length; i++) {
            const msg = datalist[i].msg ? (datalist[i].msg.length > 18 ? datalist[i].msg.substr(0, 16) + '...' : datalist[i].msg) : null
            const username = datalist[i].username ? (datalist[i].username.length > 5 ? datalist[i].username.substr(0, 3) + '...' : datalist[i].username) : null
            data.push({
              createtime: datalist[i].createtime,
              phone: datalist[i].phone,
              username: username,
              rowClassName: '',
              key: i,
              msg
            })
          }
          data[0].rowClassName = 'background-name'
          selectUserPhone = data[0].phone
          getClientInfo(selectUserPhone).then(clientres => {
            clientInfo = updataClientInfo(clientres.data.data)
            const contactData = {
              phone: selectUserPhone,
              status: 1,
              start: 0,
              length: 100
            }
            getContact(contactData).then(contactRes => {
              message.destroy()
              const contactList = contactRes.data.data
              dispatch(authSuccess({ data, recordsTotal,selectUserPhone, urlPath, page, clientInfo, contactList }))
            })
          }).catch(res => {
            console.log(res)
          })
        } else {
          message.destroy()
          dispatch(authSuccess({ data: [], recordsTotal: '', selectUserPhone: '', urlPath, page, clientInfo: {}, contactList: [] }))
        }
      }
    })
  }
}

// 获取用户详细信息
export function showDataList(phone) {
  return dispatch => {
    getClientInfo(phone).then(res => {
      if (res.data.code === 0) {
        dispatch(getclientInfo({ clientInfo: updataClientInfo(res.data.data) }))
      }
    }).catch(res => {
      console.log(res)
    })
  }
}

// 获取用户聊天详情
export function userContactList(phone, status = 1) {
  const data = {
      phone,
      status,
      start: 0,
      length: 100
    }
  return dispatch => {
    getContact(data).then(res => {
      if (res.data.draw === 1) {
        dispatch(getContactList({ contactList: res.data.data }))
      }
    })
  }
}

