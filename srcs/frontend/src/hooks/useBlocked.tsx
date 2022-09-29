import React from 'react';
import { useQuery } from 'react-query';
import { getBlockList } from '../api/api';
import IFriendProps from '../components/interface/IFriendProps';

export default function useBlocked() {
  const { data, isLoading, error } = useQuery<IFriendProps[]>('block', getBlockList);
  const blocks = React.useMemo(() => {
    if (isLoading || error) {
      return [];
    }
    return data;
  }, [data, isLoading, error]);
  return blocks;
}
