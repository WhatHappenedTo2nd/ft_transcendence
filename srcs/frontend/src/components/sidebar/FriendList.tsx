import { useQuery } from 'react-query'
import { getLoginUserData, getLoginUserFriendList, getUserList } from '../../api/api';
import { Box, Avatar, AvatarBadge, Container } from '@chakra-ui/react'

interface FriendListProps {
	id: number;
	user_id: string;
	friend_id: string;
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

function FriendList() {
	const { isLoading: isFriendListLoading, data: FriendList, error: FriendListError} = useQuery<FriendListProps[]>('Friend', getLoginUserFriendList);
	const { isLoading: amILoading, data: Mydata, error: amIError } = useQuery<UserProps>('me', getLoginUserData);
	if (isFriendListLoading || amILoading ) return <h1>Loading</h1>;
	if (FriendListError || amIError ) return <div>Error</div>;
	return (
		<div>
			{FriendList?.map((user) => {
				if (Mydata?.nickname === user.friend_id) {
					return (
						<Container key={user?.id} display='flex'>
							<Box boxSize='10' justifyContent='center'>
								<Avatar size='sm'> {/* Frienddata가 foreign key로 바뀐 이후에 아바타 링크 걸어줘야함 */}
									<AvatarBadge boxSize='1em' bg='green.500' /> {/* Frienddata가 foreign key로 바뀐 이후에 로그인 유무 확인해서 바꿔줘야함 */}
								</Avatar>
							</Box>
							<Box justifyContent='flex-end'>
								<span>{user?.user_id}</span> {/* Frienddata가 foreign key로 바뀐 이후에 foreign key 따라 값 변경해줘야함 */}
							</Box>
						</Container>
					);
				}
				})}
		</div>
	);
}

export default FriendList;