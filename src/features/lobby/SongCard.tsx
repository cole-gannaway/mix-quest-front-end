import { useAppDispatch } from "../../app/hooks";
import { Song, likeSong } from "./lobbySlice"

interface SongCardProps {
    song:Song
}
export function SongCard(props: SongCardProps){
    const dispatch = useAppDispatch();

    return <div className="border border-black rounded-lg">
        <div>
            <iframe src={(props.song.url)} className="mx-auto" style={{width:"100%", height:80}} frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager">
            </iframe>
        </div>
        <div className="grid grid-cols-2">
            <button className="grid grid-cols-2" onClick={() => {dispatch(likeSong(props.song.uuid))}}>
                <img src="images/thumbs-up-line-icon.svg" style={{width:"100%"}}></img>
                {props.song.likes}
            </button>
            <button className="grid grid-cols-2">
                <img src="images/thumbs-down-line-icon.svg" style={{width:"100%"}}></img>
                {props.song.dislikes}
            </button>
        </div>
    </div>
}