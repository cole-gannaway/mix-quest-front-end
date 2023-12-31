
interface SongPreviewProps {
    embededUrl: string
}
export function SongPreview(props: SongPreviewProps){
    return <iframe 
                src={(props.embededUrl)} 
                className="mx-auto" 
                style={{ width: "100%", height: "100%" }} 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
        </iframe>
}