import _axios from "./_axios";

export const autoLogin = () => {
    let options = {
        url: "api/cAutoLogin",
        method: "GET"
    };
    return _axios(options);
}