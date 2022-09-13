import { Avatar, Grid, GridItem, Text } from '@chakra-ui/react';

/**
 * 작성한 댓글 하나를 보여주는 컴포넌트
 * @param avatar 작성자 프로필 이미지
 * @param name 작성자 닉네임
 * @param text 작성된 댓글 내용
 * @returns 작성자 프로필 이미지, 닉네임, 댓글 내용을 묶고 있는 Grid
 */
function Comment(props: { avatar: any; name: string; text: string; }) {
	const { avatar, name, text } = props;

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
			<GridItem colSpan={7} bg='papayawhip'>
				<Text>{text}</Text>
			</GridItem>
		</Grid>
}

export default Comment;