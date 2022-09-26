import { useQuery } from 'react-query'
import { getLoginUserData, getUserList } from '../../api/api';
import IUserProps from '../interface/IUserProps'
import UserItem from './UserItem';

function OnlineUserList() {
	const { isLoading: isUserListLoading, data: UserList, error: UserListError} = useQuery<IUserProps[]>('users', getUserList);
	const { isLoading: amILoading, data: Mydata, error: amIError } = useQuery<IUserProps>('me', getLoginUserData);
	if (isUserListLoading || amILoading ) return <h1>Loading</h1>;
	if (UserListError || amIError ) return <div>Error</div>;

	return (
		<div>
			{UserList?.map((user) => {
				if (Mydata?.id !== user.id && user.is_online) {
					return (<UserItem key={user.id} user={user} />);
				}
			})}
		</div>
	);
}

export default OnlineUserList;