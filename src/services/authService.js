import axios from 'axios';
import { apiRoute, getApiHeader } from '../utils/helpers';
import { checkSessionToken, removeSessionToken } from '../utils/auth';

class AuthService {
    static login(LoginName, LoginPwd) {
        const requestOptions = {
            headers: getApiHeader(null, false),
        };

        const body = JSON.stringify({ LoginName, LoginPwd });

        return axios.post(apiRoute('/v2/auth'), body, requestOptions);
    }

    static logout() {
        if(checkSessionToken()){
            removeSessionToken()

            return true;
        }
        
        return false;
    }
}

export default AuthService;