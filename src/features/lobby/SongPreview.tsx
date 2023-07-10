
interface SongPreviewProps {
    embededUrl: string
}
export function SongPreview(props: SongPreviewProps){
    return <iframe 
                src={(props.embededUrl)} 
                className="mx-auto holds-the-iframe" 
                style={{ width: "100%", height: 80 }} 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
        </iframe>
}