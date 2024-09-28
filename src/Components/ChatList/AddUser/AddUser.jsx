// chat list m h add user
// chat list k (+) icon p click krne se aega or jaega
import React, { useState } from 'react'
import "./AddUser.css"
import { collection, getDoc, getDocs, query, serverTimestamp, setDoc, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useUserStore } from '../../../lib/userStore';

const AddUser = () => {
 const [user, setUser] = useState(null);

 const {currentUser} = useUserStore();

  const handleSearch = async (e) =>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try{
      const userRef = collection(db, "users");

      // create a query against the collection
      const q = query (userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if(!querySnapShot.empty){
         setUser(querySnapShot.docs[0].data());
      }
    }
    catch(err){
      console.log(err);
    }
  };

  const handleAdd = async ()=>{
      const chatRef = collection(db, "chats")
      const userChatsRef = collection(db, "userchats")

    try{
      // console.log("User:", user);
    // console.log("Current User:", currentUser);

      const newChatRef = doc(chatRef)

      await setDoc(newChatRef, {
        createdAt : serverTimestamp(),
        messages: [],
      });
      
      await updateDoc(doc(userChatsRef, user.id),{
        chats:arrayUnion({
          chatId: newChatRef.id,
          lastMessage:"",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id),{
        chats:arrayUnion({
          chatId: newChatRef.id,
          lastMessage:"",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
      // console.log(newChatRef.id);
      // console.log("User added to chat!");
    }
    catch(err){
      console.log(err);
    }
  };
  return (
    <div className='adduser'>
      <form onSubmit={handleSearch}>
       <input type="text" placeholder='Username' name="username"/>
       <button>Search</button>
      </form>

      {user && <div className="user-adduser">
       <div className="detail-adduser">
        <img src={user.avatar|| "./src/images/avatar.png"} alt="" />
        <span>{user.username}</span>
       </div>
       <button className='adduserbtn' onClick={handleAdd}>Add User</button>
      </div>
      }
    </div>
  )
}

export default AddUser
