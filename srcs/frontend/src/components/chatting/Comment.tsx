import { Avatar, Grid, GridItem, Text } from '@chakra-ui/react';

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