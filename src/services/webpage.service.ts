import { API } from "./base.service"

export const getContent = async ({url}: {url: string}) => {
    const response = await API('webpage', JSON.stringify({url}));
    return response
}