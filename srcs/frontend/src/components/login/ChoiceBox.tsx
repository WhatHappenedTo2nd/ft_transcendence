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
			>
				{title}
			</Box>
}

export default ChoiceBox;
