import { useQuery } from 'react-query'
import { getUserList } from '../../api/api';
import { Box, Avatar, AvatarBadge, Container } from '@chakra-ui/react'

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
				if (user.is_online) {
					return (
						<Container key={user?.id} display='flex'>
							<Box boxSize='10' justifyContent='center'>
								<Avatar size='sm' src={user?.avatar}>
									<AvatarBadge boxSize='1em' bg='green.500' />
								</Avatar>
							</Box>
							<Box justifyContent='flex-end'>
								<span>{user?.nickname}</span>
							</Box>
						</Container>
					);
				}
				})}
		</div>
	);
}

export default OnlineUserListItem;