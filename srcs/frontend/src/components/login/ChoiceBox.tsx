import { Box } from '@chakra-ui/layout';

/**
 * 로그인에 성공하면 나오는 페이지에서 사용하는 프로필/채팅 컴포넌트
 * 
 * @param title : 박스 텍스트
 * @param onClick : 클릭 시 발생하는 이벤트
 * @returns 
 */
function ChoiceBox(props: { title: any; onClick: any; }) {
	const { title, onClick } = props;

	return <Box
			as='button'
			bg='white'
			color='black'
			h='sm'
			fontSize={'5xl'}
			onClick={onClick}
			fontFamily="Establish"
			backgroundColor="#53B7BA"
			width={500}
			height={200}
			borderRadius={10}
			border="2px"
			borderColor="#53B7BA"
			_hover={{ bg: '#ebedf0' }}
			_active={{
			  bg: '#dddfe2',
			  transform: 'scale(0.98)',
			  borderColor: '#53B7BA',
			}}
			>
				{title}
			</Box>
}

export default ChoiceBox;
