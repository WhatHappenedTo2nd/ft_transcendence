import { Avatar, IconButton, Grid, GridItem, Text } from "@chakra-ui/react";
import { Input } from '@chakra-ui/react';
import { IoMdSend } from 'react-icons/io';

/**
 * 댓글 작성하는 부분 컴포넌트
 * @param avatar 작성자 프로필 이미지
 * @param name 작성자 닉네임
 * @returns 댓글 작성하는 부분을 묶고 있는 Grid
 */
function CommentBox(props: { avatar: any; name: string; }) {
	const { avatar, name } = props;

	return <Grid
			h='50px'
			templateRows='repeat(1, 1fr)'
			templateColumns='repeat(10, 1fr)'
			gap={4}
			>
			<GridItem rowSpan={1} colSpan={1} bg='tomato'>
				<Avatar name={name} src={avatar} backgroundColor='black' />
			</GridItem>
			<GridItem colSpan={2} bg='papayawhip'>
				<Text fontWeight='bold'>{name}</Text>
			</GridItem>
			<GridItem colSpan={6} bg='yellow'>
				<Input placeholder='댓글을 입력하세요.' />
			</GridItem>
			<GridItem colSpan={1} bg='yellow'>
				<IconButton
					colorScheme='yellow'
					aria-label='Search database'
					icon={<IoMdSend />}
				/>
			</GridItem>
		</Grid>

}

export default CommentBox;