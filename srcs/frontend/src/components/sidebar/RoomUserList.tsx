import { Divider } from '@chakra-ui/react';
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom';
import { getLoginUserData,  getRoomUser } from '../../api/api';
import EditButton from '../chatting/EditButton';
import IUserChatProps from '../interface/IUserChatProps';
import IUserProps from '../interface/IUserProps';
import UserItem from './UserItem';

export default function RoomUserList() {
	const location = useLocation();
	const locationhandler = location.pathname.substring(6);
	const { isLoading, data, error } = useQuery<IUserChatProps[]>(['roomuser', locationhandler], () => getRoomUser(locationhandler));
	const { isLoading: amILoading, data: Mydata, error: amIError } = useQuery<IUserProps>('me', getLoginUserData);
	const role = data?.filter((r) => r.id === Mydata?.id).pop();
	if ( isLoading || amILoading ) return <h1>Loading</h1>;
	if ( error || amIError ) return <div>Error</div>;

	return (
		<div>
			{data?.map((user) => {
				if (Mydata?.id !== user.id) {
					return (<UserItem key={user.id} user={user} mode='chat' targetrole={user.role} myrole={role?.role} muted={user.is_muted} />);
				}
				else { return null; }
			})}
			{role?.role === "HOST" && data?.length && data?.length > 1 ? <Divider borderColor="black" /> : null}
			{role?.role === "HOST" ? <EditButton /> : null }
		</div>
	);
}
