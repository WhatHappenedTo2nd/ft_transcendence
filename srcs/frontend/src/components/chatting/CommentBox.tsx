import { Avatar, IconButton, Grid, GridItem, Text } from "@chakra-ui/react";
import { Input } from '@chakra-ui/react';
import { IoMdSend } from 'react-icons/io';

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