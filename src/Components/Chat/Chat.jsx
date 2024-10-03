import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import upload from '../../lib/upload';

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [chat, setChat] = useState();
  const [img, setImg] = useState({
    file: null,
    url: ''
  });

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.messages]);

  // Fetch chat data and listen to real-time updates
  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleSend = async () => {
    if (text.trim() === '' && !img.file) return; // Prevent sending empty message

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file); // Upload the image and get its URL
        console.log('Image URL:', imgUrl);
      }

      // Update Firestore with new message
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }) // Add img URL if available
        }),
      });

      // Update user chats for both users
      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, 'userchats', id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });

      // Clear the input after sending
      setImg({
        file: null,
        url: ''
      });
      setText('');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='chat'>
      <div className='top'>
        <div className='user'>
          <img src={user?.avatar || "./src/images/avatar.png"} alt='' />
          <div className='texts'>
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor, sit amet.</p>
          </div>
        </div>
        <div className='icons'>
          <img src='./src/images/phone.png' alt='' />
          <img src='./src/images/video.png' alt='' />
          <img src='./src/images/info.png' alt='' />
        </div>
      </div>

      <div className='center'>
        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser?.id ? 'message own' : 'message'} key={message?.createdAt}>
            <div className='texts'>
              {message.img && <img src={message.img} alt='' />} {/* Display image if available */}
              <p>{message.text}</p>
            </div>
          </div>
        ))}

        {img.url && (
          <div className='message own'>
            <div className='texts'>
              <img src={img.url} alt='' /> {/* Display preview of selected image */}
            </div>
          </div>
        )}

        <div ref={endRef}></div> {/* Scroll to bottom */}
      </div>

      <div className='bottom'>
        <div className='icons'>
          <label htmlFor='file'>
            <img src='./src/images/img.png' alt='' />
          </label>
          <input type='file' id='file' style={{ display: 'none' }} onChange={handleImg} />
{/*           <img src='./src/images/camera.png' alt='' /> */}
          <i class="fa-solid fa-camera"></i>
          <img src='./src/images/mic.png' alt='' />
        </div>

        <input
          type='text'
          placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message" : 'Type a message...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />

        <div className='emoji'>
          <img src='./src/images/emoji.png' alt='' onClick={() => setOpen((prev) => !prev)} />
          {open && (
            <div className='picker'>
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <button className='sendbtn' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}> 
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
