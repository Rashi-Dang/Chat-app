import React from 'react'
import './List.css'
import ChatList from '../ChatList/ChatList'
import UserInfo from './UserInfo/UserInfo'

const List = () => {
  return (
    <div className='list'>
      <UserInfo/>
      <ChatList/>
    </div>
  )
}

export default List
