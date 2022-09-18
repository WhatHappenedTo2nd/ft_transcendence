import { useQuery } from 'react-query'
import { getLoginUserFriendList } from '../../api/api';
import { Box, Avatar, AvatarBadge, Container } from '@chakra-ui/react'

export enum Status {
	PLAYING = 'PLAYING',
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE',
}

interface FriendListProps {
	id: number;
	nickname: string;
	avatar: string;
	isblock: boolean;
	status: Status;
}

function FriendList() {
	const { isLoading: isFriendListLoading, data: FriendList, error: FriendListError} = useQuery<FriendListProps[]>('Friend', getLoginUserFriendList);
	if ( isFriendListLoading ) return <h1>Loading</h1>;
	if ( FriendListError ) return <div>Error</div>;
	return (
		<div>
			{FriendList?.map((user) => {
				return (
					<Container key={user?.id} display='flex'>
						<Box boxSize='10' justifyContent='center'>
							<Avatar size='sm' src={user?.avatar}>
								{user.status === Status.PLAYING ? <AvatarBadge boxSize='1em' bg='yellow.500' /> : null}
								{user.status === Status.ONLINE ? <AvatarBadge boxSize='1em' bg='green.500' /> : null}
								{user.status === Status.OFFLINE ? <AvatarBadge boxSize='1em' bg='grey' /> : null }
							</Avatar>
						</Box>
						<Box justifyContent='flex-end'>
							<span>{user.nickname}</span>
						</Box>
					</Container>
				);
			})}
		</div>
	);
}

export default FriendList;