import axios from 'axios';

export const getUserList = async () => {
	const { data: user } = await axios.get('/data/userdata.json');
	return user;
}

export const getChatList = async () => {
	const { data: chat } = await axios.get('/data/chatdata.json');
	return chat;
}
