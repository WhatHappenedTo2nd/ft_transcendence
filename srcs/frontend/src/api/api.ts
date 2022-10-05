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
	//TODO: get 할 정보 수정 필요
	const { data: chat } = await axios.get('/chat', {
		method: "GET",
		headers: {
			Authorization: 'Bearer ' + getCookie("accessToken")
		}
	});
	return chat;
}

export const getGameHistory = async (id: number) => {
	const { data: gameHistory } = await axios.get(`/api/games/${id}`);
	return gameHistory;
}

/**
 * 2022/09/28
 * hkwon - 게임 히스토리 api작성
 */
