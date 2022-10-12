import { Box } from '@chakra-ui/react';
import { useQuery } from 'react-query'
import { getLoginUserFriendList } from '../../api/api';
import IFriendProps from '../interface/IFriendProps';
import FriendItem from './FriendItem';

function FriendList() {
	const { isLoading: isFriendListLoading, data: FriendList, error: FriendListError} = useQuery<IFriendProps[]>('Friend', getLoginUserFriendList, {refetchInterval: 1000});
	if ( isFriendListLoading ) return <h1>Loading</h1>;
	if ( FriendListError ) return <div>Error</div>;

	const fontStyle = {
		fontFamily : "Establish",
		fontSize : "25px",
	}

	return (
		<div>
			<Box style={fontStyle} margin="1" display="flex" justifyContent="center" alignItems="center">Friend</Box>
			{FriendList?.map((user) => {
				return (<FriendItem key={user.id} user={user} />);
		})}
		</div>
	);
}

export default FriendList;