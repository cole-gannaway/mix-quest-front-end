import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectLogin } from '../login/loginSlice';
import { Message, addMessage, selectLobby, setUserCount } from './lobbySlice';
import { getSessionCount } from '../../api/api';
import QRCode from 'react-qr-code';




const Lobby = () => {
  const dispatch = useAppDispatch();
  const login = useAppSelector(selectLogin);
  const username = login.username;
  const lobbyUUID = login.lobbyUUID;

  const lobby = useAppSelector(selectLobby);
  const messages = lobby.messages;
  const userCount = lobby.userCount;

  const [client, setClient] = useState<Client | null>(null);
  const [messageInput, setMessageInput] = useState('');

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



  useEffect(() => {
    if (client === null) {
      console.log("creating client...")
      // create client
      const url = "192.168.0.11"
      
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
            const count = await getSessionCount();
            if (count) dispatch(setUserCount(count));
          }
          retrieveSessionCount();

        },
        onDisconnect: () => {
        },
        webSocketFactory: () => {
          return new SockJS("http://" + url + ":8080/websocket");
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
  }, [lobbyUUID]);

  function disconnectUser(): void {
    if (client){
      client.deactivate();
      setClient(null);
    }
  }

  const data = "http://192.168.0.15:3000/lobby/" + lobbyUUID;
  return (
    <div>
      <h1>Chat App</h1>
      <QRCode value={data} style={{width: "5rem", height: "5rem"}} />
      <div>Users: {userCount}</div>
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
     <button onClick={disconnectUser}>Disconnect</button>
    </div>
  );
};

export default Lobby;

