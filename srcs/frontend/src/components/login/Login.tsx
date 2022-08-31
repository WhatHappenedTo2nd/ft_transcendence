import { Button } from '@chakra-ui/react';

/**
 * 로그인 버튼 만드는 함수
 * 
 * @param title : 버튼 텍스트
 * @param onClick : 버튼 눌렀을 때 발생시킬 이벤트
 * @returns 로그인 버튼
 */
function LoginButton(props: { title: any; onClick: any; }) {
	const { title, onClick } = props;

	return <Button
			height="120px"
			width="500px"
			fontSize="36px"
			fontFamily="Establish"
			colorScheme="#53B7BA"
			textColor="black"
			backgroundColor="#53B7BA"
			border="2px"
			borderColor="#53B7BA"
			onClick={onClick}
			>
				{title}
			</Button>;
}

export default LoginButton;
