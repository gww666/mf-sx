import _axios from "./_axios";

export const autoLogin = () => {
    let options = {
        url: "api/cAutoLogin",
        method: "GET",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
}