import axios from 'axios';

export async function getSessionCount(hostname : string) : Promise<number | null> {
    let count = null;
    try {
        const response = await axios.get("http://" + hostname + ":8080/getSessions");
        if (response.status === 200){
            const result : number = response.data
            count = result;
        }
    } catch (e){
        console.error(e);
    }
    return count;
}
