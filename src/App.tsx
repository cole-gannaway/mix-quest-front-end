import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import {CompatClient, Stomp} from '@stomp/stompjs';

interface Message {
  username:string;
  content:string;
}

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [client, setClient] = useState<CompatClient | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [userName, setUserName] = useState('');


  function deepCopy<Type>(obj : Type): Type{
    return JSON.parse(JSON.stringify(obj));
  }
  const handleInputChange = (event : any) => {
    setMessageInput(event.target.value);
  };

  const handleUsernameChange = (event: any) => {
    setUserName(event.target.value);
  }

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const message = {
        content: messageInput,
        username: userName,
        password: 'root'
      };

      if (client) {
        client.send("/topic/messages",{},JSON.stringify(message));
      }

      setMessageInput('');
    }
  };


  useEffect(() => {
    const stompClient = Stomp.over(() => {
      return new SockJS('http://localhost:8080/websocket'); // Replace with your Spring Boot server URL
    });

    console.log("trying....")
    stompClient.connect({}, (frame: any) => {
      console.log('Connected to WebSocket');


      stompClient.subscribe('/topic/messages', (message) => {
        // console.log('Received message:', message.body);
        const msg : Message = JSON.parse(message.body);
        messages.push(msg);
        const newMessages = deepCopy(messages);
        setMessages(newMessages)
        // Handle the received message in your React component
      });
    });

    setClient(stompClient);

    return () => {
      stompClient.disconnect();
      setClient(null);
    };
  }, []);
  return (
    <div>
      <h1>Chat App</h1>
      <input
        type='text'
        value={userName}
        onChange={handleUsernameChange}
        placeholder='Type your username...'
      >
      </input>
      <br></br>
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
     
    </div>
  );
};

export default App;


