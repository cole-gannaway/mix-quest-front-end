import React, { useCallback, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectLogin } from '../login/loginSlice';
import { Message, addMessage, addSong, createNewSong, selectLobby, setUserCount } from './lobbySlice';
import { getSessionCount } from '../../api/api';
import QRCode from 'react-qr-code';
import { SongCard } from './SongCard';




const Lobby = () => {
  const dispatch = useAppDispatch();
  const login = useAppSelector(selectLogin);
  const username = login.username;
  const lobbyUUID = login.lobbyUUID;

  const lobby = useAppSelector(selectLobby);
  const messages = lobby.messages;
  const userCount = lobby.userCount;
  const songs = lobby.songs;
  const sortedSongs = [...songs].sort((a,b) => b.likes - a.likes);

  const [client, setClient] = useState<Client | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [songURL, setSongURL] = useState('');

  const hostname = window.location.hostname;

  const handleInputChange = (event : any) => {
    setMessageInput(event.target.value);
  };


  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const message : Message = {
        content: messageInput,
        username: username,
        timeMillis: Date.now()
      };

      if (client) {
        client.publish({destination: "/app/messages/" + lobbyUUID, body: JSON.stringify(message)});
      }

      setMessageInput('');
    }
  };


  const disconnectUser = useCallback(() => {
    if (client){
      client.deactivate();
      setClient(null);
    }
  }, [client])

  useEffect(() => {
    if (client === null) {
      console.log("creating client...")
      // create client
      const sockJsClient = new Client({
        connectionTimeout: 600000,
        connectHeaders : {
          username: username,
          lobbyUUID: lobbyUUID
        },
        disconnectHeaders: {
          username: username,
          lobbyUUID: lobbyUUID
        },
        debug: (msg) => console.debug(msg),
        onConnect: () => {

          sockJsClient.subscribe('/topic/messages.' + lobbyUUID, (message) => {
            console.log('Received message:', message.body);
            const msg : Message = JSON.parse(message.body);
            dispatch(addMessage(msg));
          });
    
          // listen to new users
          sockJsClient.subscribe('/topic/users.' + lobbyUUID, (message) => {
            console.log('Received message on /topic/users:', message.body);
            const count = parseInt(message.body);
            dispatch(setUserCount(count));
          });

          // retrieve session count
          const retrieveSessionCount = async () => {
            const count = await getSessionCount(hostname);
            if (count) dispatch(setUserCount(count));
          }
          retrieveSessionCount();

        },
        onDisconnect: () => {
        },
        webSocketFactory: () => {
          return new SockJS("http://" + hostname + ":8080/websocket");
        }
      });
      sockJsClient.activate();
      setClient(sockJsClient);
    }
    
    return () => {
      if (client) {
        disconnectUser()
      }
    };
  }, [client, lobbyUUID, dispatch, username, disconnectUser]);
  
  
  const qrCodeURL = hostname + ":3000/lobby/" + lobbyUUID;
  return (
    <div>
      <h1 className='text-3xl'>Chat App</h1>
      <div>{hostname}</div>
      <div>
        <QRCode value={qrCodeURL} className='mx-auto h-28' />
      </div>
      <div>Users: {userCount}</div>
      <div>
        <input
          type='text'
          placeholder='Input Spotify URL'
          value={songURL}
          onChange={(e) => { setSongURL(e.target.value) }}
        />
        <button onClick={() => {
          const newSong = createNewSong(songURL);
          dispatch(addSong(newSong))
        }}>Submit</button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          type="text"
          value={messageInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.username}:</strong> {message.content}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
        {sortedSongs.map((song, index) => (
          <div key={index} >
            <SongCard song={song}></SongCard>
          </div>
        ))}
        
      </div>
     <button onClick={disconnectUser}>Disconnect</button>
    </div>
  );
};

export default Lobby;

