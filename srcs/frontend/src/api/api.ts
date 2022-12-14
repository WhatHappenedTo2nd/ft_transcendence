import axios from 'axios';
import { getCookie } from './cookieFunc';

export const getUserList = async () => {
	const { data: user } = await axios.get('/user', {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return user;
}

export const getLoginUserData = async() => {
	const { data: me } = await axios.get('/user/me', {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return me;
}

export const getJustOnlineUser = async() => {
	const { data: online } = await axios.get('/user/online', {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return online;
}

export const getRoomUser = async(path: string | undefined) => {
	const { data: roomuser } = await axios.get(`/chat/${path}`, {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return roomuser;
}

export const getLoginUserFriendList = async() => {
	const { data: friend } = await axios.get('/friend/friendlist', {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return friend;
}

export const getUserByNickname = async (nickname: string | undefined) => {
	const { data: usernick } = await axios.get(`/user/profile/${nickname}`, {
	method: "GET",
	headers: {
		Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return usernick;
}

export const getUserByIntraid = async (intra_id: string | undefined) => {
	const { data: intraID } = await axios.get(`/user/profile/${intra_id}`, {
	method: "GET",
	headers: {
		Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return intraID;
}

export const getBlockList = async() => {
	const { data: block } = await axios.get('/friend/blocklist', {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return block;
}

export const getChatList = async () => {
	const { data: chat } = await axios.get('/chat', {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return chat;
}

export const getGameHistory = async (id: number | undefined) => {
	const { data: gameHistory } = await axios.get(`/games/${id}`, {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return gameHistory;
}

export const getAllGameHistory = async () => {
	const { data: allGameHistory } = await axios.get('/games/all');
	return allGameHistory;
}

export const getWhereAreYou = async (target: string | undefined) => {
	const { data: chat } = await axios.get(`/chat/find/${target}`, {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return chat;
}

export const getWhereAreYouByIntraId = async (target: string | undefined) => {
	const { data: chat } = await axios.get(`/chat/find/intra/${target}`, {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return chat;
}



/**
 * 2022/09/28
 * hkwon - ?????? ???????????? api??????
 */
