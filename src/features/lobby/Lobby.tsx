import React, { useCallback, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectLogin } from '../login/loginSlice';
import { Song, addSong, bulkAddSongRequestAndDislikes, convertURLToEmbeddedURL, createNewSong, createNewSongUUID, handleSongRequestUpdate, selectLobby, setUserCount } from './lobbySlice';
import { getSessionCount, getSongRequestDislikesByLobby, getSongRequestsByLobby, sendSongRequest } from '../../api/api';
import QRCode from 'react-qr-code';
import { SongCard } from './SongCard';
import { SongPreview } from './SongPreview';
import { SongRequestCombinedMessage } from '../../model/Messages';

const Lobby = () => {
  const dispatch = useAppDispatch();
  const login = useAppSelector(selectLogin);
  const username = login.username;
  const lobbyUUID = login.lobbyUUID;

  const lobby = useAppSelector(selectLobby);
  const userCount = lobby.userCount;
  const songs = lobby.songs;
  const sortedSongs = [...songs].sort((a,b) => b.likes - a.likes);

  const [client, setClient] = useState<Client | null>(null);
  const [songURL, setSongURL] = useState('');

  const hostname = window.location.hostname;

  async function handleSubmitSongRequest(){
    const newSong = createNewSong(songURL);
    if (newSong){
      sendSongRequest(hostname,{
        songUUID: newSong.uuid,
        lobbyUUID: lobbyUUID,
        username: username,
        isLike: true
      });
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
      console.log("Connecting to server...")
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
          console.log("Connected!")

          sockJsClient.subscribe('/topic/song_request_update.' + lobbyUUID, (message) => {
            const msg : SongRequestCombinedMessage[] = JSON.parse(message.body);
            dispatch(handleSongRequestUpdate(msg))
          });
    
          // listen to new users
          sockJsClient.subscribe('/topic/users.' + lobbyUUID, (message) => {
            const count = parseInt(message.body);
            dispatch(setUserCount(count));
          });

          // retrieve initial session count
          const retrieveSessionCount = async () => {
            const count = await getSessionCount(hostname, lobbyUUID);
            if (count) dispatch(setUserCount(count));
          }
          retrieveSessionCount();

          // retrieve inital data
          const retrieveSongRequestsByLobby = async() => {
            const songRequests =  await getSongRequestsByLobby(hostname, lobbyUUID)
            if (songRequests) dispatch(bulkAddSongRequestAndDislikes(songRequests))
          }
          retrieveSongRequestsByLobby();

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
  
  const qrCodeURL = "http://" + hostname + ":3000/lobby/" + lobbyUUID;
  const embeddedUrlPreview = convertURLToEmbeddedURL(songURL);
  return (
    <div>
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
      </div>
      <div className="grid grid-cols-1 gap-2 my-4 md:grid-cols-3 md:gap-4">
        <div></div>
        { embeddedUrlPreview ? 
            <div>
              <SongPreview embededUrl={embeddedUrlPreview}></SongPreview>
              <button 
                onClick={handleSubmitSongRequest}
                className='p-2 bg-gray-300 rounded-xl'
              >Submit</button> 
            </div>
            : 
              <div> </div>
        }
        <div></div>
      </div>
      <div></div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
        {sortedSongs.map((song, index) => (
          <div key={index} >
            <SongCard song={song}></SongCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lobby;

