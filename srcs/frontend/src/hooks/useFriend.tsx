import React from 'react';
import { useQuery } from 'react-query';
import { getLoginUserFriendList } from '../api/api';
import IFriendProps from '../components/interface/IFriendProps';

export default function useFriends() {
  const { data, isLoading, error } = useQuery<IFriendProps[]>('Friend', getLoginUserFriendList, {refetchInterval: 1000});
  const friends = React.useMemo(() => {
    if (isLoading || error) {
      return [];
    }
    return data;
  }, [data, isLoading, error]);
  return friends;
}
