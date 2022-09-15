import axios from 'axios';

export const getUserList = async () => {
	const { data: user } = await axios.get('//localhost:9633/user');
	return user;
}

export const getLoginUserData = async() => {
	const { data: me } = await axios.get('/data/loginuserdata.json');
	return me;
}

export const getLoginUserFriendList = async() => {
	const { data: friend } = await axios.get('/data/frienddata.json');
	return friend;
}
export const getChatList = async () => {
	const { data: chat } = await axios.get('/data/chatdata.json');
	return chat;
}
