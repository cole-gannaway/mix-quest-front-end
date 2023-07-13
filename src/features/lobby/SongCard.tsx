import { sendSongRequest, sendSongRequestDislike } from "../../api/api";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLogin } from "../login/loginSlice";
import { SongPreview } from "./SongPreview";
import { Song, likeSong } from "./lobbySlice"

interface SongCardProps {
    song:Song,
}
export function SongCard(props: SongCardProps){
    const dispatch = useAppDispatch();
    const hostname = window.location.hostname;
    const login = useAppSelector(selectLogin);

    return <div className="border border-black rounded-lg">
        <div>
            <SongPreview embededUrl={props.song.embededUrl}></SongPreview>
        </div>
        <div className="grid grid-cols-2 text-center">
            <button className="relative h-16 w-16 m-auto" onClick={() => sendSongRequest(hostname, {
                songUUID: props.song.uuid,
                lobbyUUID : login.lobbyUUID,
                username : login.username,
                isLike: true
            })}>
                <img src="/images/thumbs-up-line-icon.svg" style={{width:"100%"}}></img>
                <div className="absolute top-0 right-0 h-6 w-6 bg-gray-200 border rounded-lg">{props.song.likes}</div>
            </button>
            <button className="relative h-16 w-16 m-auto" onClick={() => sendSongRequestDislike(hostname, {
                songUUID: props.song.uuid,
                lobbyUUID : login.lobbyUUID,
                username : login.username,
                isLike: false
            })}>
                <img src="/images/thumbs-down-line-icon.svg" style={{width:"100%"}}></img>
                <div className="absolute top-0 right-0 h-6 w-6 bg-gray-200 border rounded-lg">{props.song.dislikes}</div>
            </button>
        </div>
    </div>
}