import React from 'react'
import './UserInfo.css'
import { useUserStore } from '../../../lib/userStore';

const UserInfo = () => {
  const {currentUser} = useUserStore();

  return (
    <div className='userinfo'>
      <div className="user">
        <img src={currentUser.avatar || "./src/images/avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
{/*         <img src="./src/images/more.png" alt="" /> */}
  <i class="fa-solid fa-ellipsis"></i>
{/*         <img src="./src/images/video.png" alt="" /> */}
        <i class="fa-solid fa-video"></i>
{/*         <img src="./src/images/edit.png" alt="" /> */}
        <i class="fa-solid fa-pen"></i>
      </div>
    </div>
  )
}

export default UserInfo
