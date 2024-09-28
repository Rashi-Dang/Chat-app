// import { useState } from 'react'
import './App.css'
import List from './Components/List/List'
import Chat from './Components/Chat/Chat'
import Detail from './Components/Detail/Detail'
import Login from './Components/Login/Login'
import Notification from './Components/Notification/Notification'
import { useEffect } from 'react'
import {  onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { useUserStore } from './lib/userStore'
import { useChatStore } from './lib/chatStore'

function App() {
  
  // for showing login page true= not show , false= shows 
  // const user = false; 

  const {currentUser, isLoading, fetchUserInfo} = useUserStore();
  const {chatId} = useChatStore();

  useEffect(()=>{
    const unSub = onAuthStateChanged(auth, (user) => {
      // console.log(user.uid);
      fetchUserInfo(user?.uid);
    })
    return () =>{
      unSub();
    }
  },[fetchUserInfo]);

  console.log(currentUser);

  if (isLoading) return <div className="loading">Loading...</div>
  return (
    <>
      <div className="container">
        {
          currentUser ? (
          <>
            <List/>
            {chatId && <Chat/>}
            {chatId && <Detail/>}
          </>
          ) : (
          <Login/>
          )} 
          <Notification/>
      </div>
    </>
  )
}

export default App
