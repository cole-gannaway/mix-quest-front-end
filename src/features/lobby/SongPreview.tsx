
interface SongPreviewProps {
    url: string
}
export function SongPreview(props: SongPreviewProps){
    return <iframe 
                src={(props.url)} 
                className="mx-auto" 
                style={{ width: "100%", height: 80 }} 
                frameBorder="0"
                allowFullScreen={true} 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="eager">
        </iframe>
}