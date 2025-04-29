export const API = async (path: string, body?: BodyInit) => {
    const response = await fetch(`${window.location.href}/api/${path}`, {
        method: 'POST',
        body
    });
    return response.ok ? await response.blob() : await response.json();
}