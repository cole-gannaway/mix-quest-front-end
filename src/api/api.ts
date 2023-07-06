import axios, {isCancel, AxiosError} from 'axios';

const url = "192.168.0.11";

export async function getSessionCount() : Promise<number | null> {
    let count = null;
    try {
        const response = await axios.get("http://" + url + ":8080/getSessions");
        if (response.status === 200){
            const result : number = response.data
            count = result;
        }
    } catch (e){
        console.log(e);
    }
    return count;
}
