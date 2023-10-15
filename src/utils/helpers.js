import * as authUtils from './auth';

export function config(key) {
	return import.meta.env['VITE_' + key];
}

export function apiRoute($url) {
	return config('API_URL') + $url;
}

export function getApiHeader(extraHeader = {}, checkAuth = true) {
	let headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	};

	if (checkAuth) {
		let accessToken = authUtils.getSessionToken();
		if (accessToken && accessToken.accessToken) {
			headers.Authorization = 'Bearer ' + accessToken.accessToken;
		}
	}

	return { ...headers, ...extraHeader };
}

export function getCurrentTimestamp() {
	return Date.now();
}

export function getCustomTimestamp(minute = 1) {
	return getCurrentTimestamp() + minute * 60 * 1000;
}
