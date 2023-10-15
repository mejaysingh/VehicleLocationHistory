import CryptoJS from 'crypto-js';
import * as config from './config';

export function encryptLocal(stringValue) {
	const aesKey = config.get('LOCAL_SECRET_KEY');

	if (aesKey) {
		return CryptoJS.AES.encrypt(stringValue, aesKey).toString();
	}

	return stringValue;
}

export function decryptLocal(encryptedValue) {
	const aesKey = config.get('LOCAL_SECRET_KEY');

	if (aesKey) {
		return CryptoJS.AES.decrypt(encryptedValue, aesKey).toString(
			CryptoJS.enc.Utf8
		);
	}

	return encryptedValue;
}
