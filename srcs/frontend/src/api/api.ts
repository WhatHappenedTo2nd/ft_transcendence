import axios from 'axios';
import { getCookie } from './cookieFunc';

export const getUserList = async () => {
	const { data: user } = await axios.get('/user', {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("token")
		}
	});
	return user;
}

export const getLoginUserData = async() => {
	const { data: me } = await axios.get('/user/me', {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("token")
		}
	});
	return me;
}

export const getLoginUserFriendList = async() => {
	const { data: friend } = await axios.get('/friend/friendlist', {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("token")
		}
	});
	return friend;
}

export const getBlockList = async() => {
	const { data: block } = await axios.get('/friend/blocklist', {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("token")
		}
	});
	return block;
}

export const getChatList = async () => {
	const { data: chat } = await axios.get('/data/chatdata.json');
	return chat;
}
