import { useQuery } from 'react-query'
import { getLoginUserFriendList } from '../../api/api';
import FriendProps from '../interface/IFriendProps';
import FriendItem from './FriendItem';

function FriendList() {

	const { isLoading: isFriendListLoading, data: FriendList, error: FriendListError} = useQuery<FriendProps[]>('Friend', getLoginUserFriendList);
	if ( isFriendListLoading ) return <h1>Loading</h1>;
	if ( FriendListError ) return <div>Error</div>;
	return (
		<div>
			{FriendList?.map((user) => {
				return (<FriendItem key={user.id} user={user}/>);
		})}
		</div>
	);
}

export default FriendList;
