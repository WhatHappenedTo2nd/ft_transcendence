import axios from 'axios';

export const getUserList = async () => {
	const { data: user } = await axios.get('/data/userdata.json');
	return user;
}
