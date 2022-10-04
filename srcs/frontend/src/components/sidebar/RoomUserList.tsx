import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom';
import { getLoginUserData,  getRoomUser } from '../../api/api';
import IUserProps from '../interface/IUserProps'
import UserItem from './UserItem';

export default function RoomUserList() {
	const location = useLocation();
	const locationhandler = location.pathname.substring(6);
	const { isLoading, data, error } = useQuery<IUserProps[]>(['roomuser', locationhandler], () => getRoomUser(locationhandler));
	const { isLoading: amILoading, data: Mydata, error: amIError } = useQuery<IUserProps>('me', getLoginUserData);
	if ( isLoading || amILoading ) return <h1>Loading</h1>;
	if ( error || amIError ) return <div>Error</div>;

	return (
		<div>
			{data?.map((user) => {
				if (Mydata?.id !== user.id) {
					return (<UserItem key={user.id} user={user} />);
				}
				else { return null; }
			})}
		</div>
	);
}
