import _axios from "../../utils/_axios";
import md5 from 'js-md5';

export const loginRequest = (username, password) => {
    let options = {
        url: "/api/cLogin",
        method: "POST",
        data: JSON.stringify({
            account: username,
            password: md5(password)
        })
    };
    return _axios(options);
};