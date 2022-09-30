import React from 'react';
import { useQuery } from 'react-query';
import UserProps from '../interface/IUserProps';
import { getUserByNickname, getLoginUserData } from '../../api/api';
import { useParams } from 'react-router';
import { Badge, Flex } from '@chakra-ui/react';


function AchieveBadge(){
	const params = useParams();
	const {data: userdata} = useQuery<UserProps>(['usernick', params.nickname], () => getUserByNickname(params.nickname));
	const {data:Mydata} = useQuery<UserProps>('me', getLoginUserData);

	// const wins: number = userdata?.wins;
	return (
		<Flex>
			{/* { (wins > 0) ? <Badge marginRight={2}>Default</Badge> : null}  */}
			<Badge>hi</Badge>
		</Flex>
	);
} 

export default AchieveBadge;