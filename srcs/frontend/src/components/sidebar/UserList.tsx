import { Box } from '@chakra-ui/react';
import { useQuery } from 'react-query'
import { getLoginUserData, getJustOnlineUser } from '../../api/api';
import IUserProps from '../interface/IUserProps'
import UserItem from './UserItem';

function OnlineUserList() {
	const { isLoading: isUserListLoading, data: UserList, error: UserListError} = useQuery<IUserProps[]>('online', getJustOnlineUser);
	const { isLoading: amILoading, data: Mydata, error: amIError } = useQuery<IUserProps>('me', getLoginUserData);
	if (isUserListLoading || amILoading ) return <h1>Loading</h1>;
	if (UserListError || amIError ) return <div>Error</div>;
	
	const fontStyle = {
		fontFamily : "Establish",
		fontSize : "25px",
	}

	return (
		<div>
			<Box style={fontStyle} margin="1" display="flex" justifyContent="center" alignItems="center">Online</Box>
			{UserList?.map((user) => {
				if (Mydata?.id !== user.id && user.is_online) {
					return (<UserItem key={user.id} user={user} mode='online' />);
				}
				else { return null; }
			})}
		</div>
	);
}

export default OnlineUserList;