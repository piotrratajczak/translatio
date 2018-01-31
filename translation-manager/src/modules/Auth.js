import jwt from 'jsonwebtoken';

class Auth {
	static setToken(token) {
		localStorage.setItem('token', token);
	}

	static removeToken() {
		return localStorage.removeItem('token');
	}

	static deauthenticateUser() {
		console.log('TODO deauthenticateUser'); //localStorage.removeItem('token');
	}

	static getToken() {
		return localStorage.getItem('token');
	}

	static checkTokenValidity(token) {
		return jwt.decode(token).exp * 1000 > new Date().getTime();
	}

	static getTokenData(token) {
		return jwt.decode(token);
	}
}

export default Auth;
