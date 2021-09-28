import React, {useState,useContext,useEffect} from 'react';

const connect = (Component) => {
  return (props) => {
    const {state,setState} = useContext(appContext)
    const [,update] = useState({})
    //只在第一次订阅
    useEffect(() => {
      store.subscribe(()=>{
        update({})
      })
    }, [])
    const dispatch = (action) => {
      setState(reducer(state,action))
      // update({})
    }
    // 高阶组件
    return <Component {...props} dispatch={dispatch} state={state} />
  }
}
const appContext = React.createContext(null)

const store = {
  state: {
    user:{name:'lu',age:18}
  },
  setState(newState){
    store.state = newState
    store.listeners.map(fn=>fn(store.state))
  },
  listeners: [],
    // 订阅
  subscribe(fn){
    store.listeners.push(fn)
    return ()=>{
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index,1)
    }
  }
}
export const App = () => {
  return (
    <appContext.Provider value={store}>
      <大儿子 />
      <二儿子 />
      <小儿子 />
    </appContext.Provider>
  )
}
const 大儿子 = () => <section>大儿子<User/></section>
const 二儿子 = () => <section>二儿子<Wrapper>内容</Wrapper></section>
const 小儿子 = () => <section>小儿子</section>
const User = connect(({state}) => {
  return <div>User:{state.user.name}</div>
})
const reducer = (state,{type,payload}) => {
  if(type === 'updateUser') {
    return {
      ...state,
      user:{
        ...state.user,
        ...payload
      }
    }
  }else{
    return state
  }
}
//使组件和全局状态连接起来
//高阶组件：一个函数接收一个组件返回一个新的组件

const Wrapper = connect(({dispatch,state,children}) => {
  const onChange = (e) => {
    dispatch({type:'updateUser',payload:{name:e.target.value}})
  }
  return <div>
    {children}
    <input value={state.user.name} onChange={onChange}>
    </input>
  </div>
})
export default App;
