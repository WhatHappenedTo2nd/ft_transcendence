import { useQuery } from 'react-query'
import { getLoginUserData, getUserList } from '../../api/api';
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

interface UserProps {
	id: number;
	intra_id: string;
	nickname: string;
	avatar: string;
	is_online: boolean;
	now_playing: boolean;
	email: string;
}

function OnlineUserList() {
	const { isLoading: isUserListLoading, data: UserList, error: UserListError} = useQuery<UserListProps[]>('users', getUserList);
	const { isLoading: amILoading, data: Mydata, error: amIError } = useQuery<UserProps>('me', getLoginUserData);
	if (isUserListLoading || amILoading ) return <h1>Loading</h1>;
	if (UserListError || amIError ) return <div>Error</div>;
	return (
		<div>
			{UserList?.map((user) => {
				if (Mydata?.id !== user.id && user.is_online) {
					return (
						<Container key={user?.id} display='flex'>
							<Box boxSize='10' justifyContent='center'>
								<Avatar size='sm' src={user?.avatar}>
									{user.now_playing 
									? <AvatarBadge boxSize='1em' bg='yellow.500' /> 
									: <AvatarBadge boxSize='1em' bg='green.500' />}
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

export default OnlineUserList;