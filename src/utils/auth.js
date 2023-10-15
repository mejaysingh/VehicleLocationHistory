import * as encryptUtils from './encrypt';
import { getCurrentTimestamp, getCustomTimestamp } from './helpers';

export const setSessionToken = (data) => {
    let accessExpiresAt = getCustomTimestamp(30);

    const stringValue = JSON.stringify({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessExpiresAt: accessExpiresAt
    });

    const encryptedValue = encryptUtils.encryptLocal(stringValue);
    localStorage.setItem('_session', encryptedValue);
}

export const getSessionToken = () => {
    const encryptedValue = localStorage.getItem('_session');

    if (encryptedValue) {
        const stringValue = encryptUtils.decryptLocal(encryptedValue);
        return JSON.parse(stringValue);
    }

    return false;
}

export const checkSessionToken = () => {
    if (localStorage.getItem('_session')) {
        return true;
    }

    return false;
}

export const checkTokenValid = () => {
    if(checkSessionToken()){
        if( ( getSessionToken().accessExpiresAt - getCurrentTimestamp() ) <= 0 ){
            return false
        }
        return true;
    }

    return false;
}

export const removeSessionToken = () => {
    localStorage.removeItem('_session');
}