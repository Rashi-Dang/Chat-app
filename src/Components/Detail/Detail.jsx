import React from 'react'
import './Detail.css'
import { auth, db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore(); 
  const { currentUser } = useUserStore();

  const handleBlock = async () =>{
    if(!user) return;

    const userDocRef = doc(db, "users", currentUser.id)

    try{
      await updateDoc(userDocRef,{
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    }
    catch(err){
      console.log(err);
    }
  }
  return (
    <div className='detail'>
      <div className="detail-user">
       <img src={user?.avatar || "./src/images/avatar.png"} alt="" />
       <h3>{user?.username}</h3>
       <p>Lorem ipsum dolor, sit amet.</p>
      </div>
      <div className="detail-info">

      <div className="detail-option">
        <div className="detail-title">
          <span>Chat Settings</span>
          <img src="./src/images/arrowUp.png" alt="" />
        </div>
      </div>

      <div className="detail-option">
        <div className="detail-title">
          <span>Chat Settings</span>
          <img src="./src/images/arrowUp.png" alt="" />
        </div>
      </div>

      <div className="detail-option">
        <div className="detail-title">
          <span>Privacy & help</span>
          <img src="./src/images/arrowUp.png" alt="" />
        </div>
      </div>

      <div className="detail-option">
        <div className="detail-title">
          <span>Shared Photos</span>
          <img src="./src/images/arrowDown.png" alt="" />
        </div>
      </div>

      <div className="detail-photos">

       <div className="detail-photoItem">
        <div className="detail-photodetail">
        <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
        <span>photo_2024_2.png</span>
        </div>
       <img src="./src/images/download.png" alt="" className='detail-icons'/>
       </div>

       <div className="detail-photoItem">
        <div className="detail-photodetail">
        <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
        <span>photo_2024_2.png</span>
        </div>
       <img src="./src/images/download.png" alt="" className='detail-icons' />
       </div>

      </div>

      <div className="detail-option">
        <div className="detail-title">
          <span>Shared files</span>
          <img src="./src/images/arrowUp.png" alt="" />
        </div>
      </div>
      <button className='detail-blockbtn' onClick={handleBlock}>
        {
          isCurrentUserBlocked ? "You are Blocked!" : isReceiverBlocked ? "User Blocked" : "Block User"
        }
        </button>
      <button className='detail-logoutbtn' onClick={()=>auth.signOut()}>Logout</button>

      </div>
    </div>
  )
}

export default Detail
