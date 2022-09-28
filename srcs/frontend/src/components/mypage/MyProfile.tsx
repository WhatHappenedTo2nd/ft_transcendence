import React, { useCallback, useEffect, useState } from 'react';
import { Image, Button, Container, Box, useDisclosure, Text } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getLoginUserData } from '../../api/api';
import MyPageModal from '../mypage/MyPageModal';
import styled from 'styled-components';
import CheckTFA from '../mypage/tfa';
import CheckTFACode from '../mypage/tfaCodeCheck';
import UserProps from '../interface/IUserProps';

function MyProfile(){
  const [buttonState, setButtonState] = useState(false);

  const changeButton = () => {
    setButtonState((check: boolean) => check);
  }
  
  const {isLoading: amILoading, data:Mydata, error: amIError} = useQuery<UserProps>('me', getLoginUserData);
	if (amILoading) return <h1>Loading</h1>;
	if (amIError) return <h1>Error</h1>;
  
	return (
    <Main>
			<Image
				borderRadius='full'
				boxSize='200px'
				src={Mydata?.avatar}
				alt='intra profile avatar'
        />
			<Text fontSize='30px' color='#53B7BA' as='b'>{Mydata?.nickname}</Text>
			<MyPageModal />
			<CheckTFA />
      <CheckTFACode />
		</Main>
	);
}


const Main = styled.main`
  width: 100%;
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  text-align: center;
`;

const DialogButton = styled.button`
  width: 160px;
  height: 48px;
  background-color: blueviolet;
  color: white;
  font-size: 1.2rem;
  font-weight: 400;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
  }
`;

export default MyProfile;
