import React, { useEffect, useState } from 'react';
import { Image, Container, Box } from '@chakra-ui/react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { getLoginUserData } from '../../api/api';

interface UserProps {
	id: number;
	intra_id: string;
	nickname: string;
	avatar: string;
	is_online: boolean;
	now_playing: boolean;
	email: string;
}

function MyPage() {
	const {isLoading: amILoading, data:Mydata, error: amIError} = useQuery<UserProps>('me', getLoginUserData);
	if (amILoading) return <h1>Loading</h1>;
	if (amIError) return <h1>Error</h1>;
	// const [users, setUsers] = useState<any>([]);

	// 	useEffect(() => {
	// 		axios.get('/data/userdata.json')
	// 			.then(response => {
	// 				setUsers(response.data);
	// 			});
	// 	}, []);

	return (
		<>
			<Image
				borderRadius='full'
				boxSize='300px'
				src='https://cdn.pixabay.com/photo/2018/05/14/21/43/british-shorthair-3401683_1280.jpg'
				alt='british short hair'
			/>
			<h1>{Mydata?.nickname}</h1>
		{/* <ul>
			{users.map((user: any) => (
				<li key={user.id}>
					{user.nickname}
				</li>
			))}
		</ul> */}
		</>
	);
}

export default MyPage;