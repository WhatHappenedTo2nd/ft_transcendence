import { useQuery } from 'react-query'
import { getUserList } from '../../api/api';

interface UserListProps {
	id: number;
	intra_id: string;
	nickname: string;
	avatar: string;
	is_online: boolean;
	now_playing: boolean;
	email: string;
}

function OnlineUserListItem() {
	const { isLoading: isUserListLoading, data: UserList, error: UserListError} = useQuery<UserListProps[]>('users', getUserList);
	if (isUserListLoading) return <h1>Loading</h1>;
	if (UserListError) return <div>Error</div>;
	return (
		<div>
			{UserList?.map((user) => {
				if (user.is_online === true) {
					return (
						<div key={user?.id}>
							<img alt="UserAvatar" src={user?.avatar} />
							<div>
								<span>{user?.nickname}</span>
							</div>
						</div>
					);
				}
				})}
		</div>
	);
}

export default OnlineUserListItem;