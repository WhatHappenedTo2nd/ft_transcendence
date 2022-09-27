/**
 * 레퍼런스에서는 chat폴더안에 정의되어있는 파일을 따로 빼서 작성했습니다.
 * 게임 생성 시 채팅방을 만드니 chat폴더안에서 관리를 한게 아닌가 싶습니다.
 * 해당 파일은 조금 더 분석해서 수정하고 정리하도록 하겠습니다.
 */
/**
 * Link를 이용하여 props 전달
 * 사용하는 이유
 *  내가 어떤 페이지에 특정 데이터를 전달하고 싶은 경우, react에서는 일반적으로 부모자식 관계로 설정해서 props를 전달한다.
 * 하지만 만약 부모자식 관계가 아닌데도 props를 전달해야 할 필요가 있을 경우에는 Link 컴포넌트를 이용하여 전달한다.
 *  리액트 라우터에서 페이지 이동할 때는 Link 컴포넌트를 사용하면 내가 이동하고자 하는 경로(URL)로 이동할 수 있다.
 *  Link 컴포넌트를 사용하면 브라우저의 주소만 바꿀뿐, 페이지를 새로 불러오지는 않는다.
 */
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { IPlayer } from './GameInterface';

const PlayerInfoDivStyleC = styled.div`
	margin: 5px;
	display: flex;
	justify-content: space-between;
`;

const PlayerInfoStyleC = styled.div`
	width: 30%;
`;

const PlayerPhotoDivStyleC = styled.div`
	width: 70px;
	height: 70px;
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.2);
	margin: auto;
`;

const PlayerPhotoStyleC = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center;
`;

const PlayerDataDivStyleC = styled.div`
	text-align: center;
`;

const PlayerDataPStyleC = styled.p`
	width: 100%;
	text-align: center;
	text-overflow: ellipsis;
	overflow: hidden;
	margin-top: 10px;
`;

/**
 * 게임생성과 동시에 채팅방이 생성되므로 게임 유저가 곧 채팅방의 유저가 된다.
 * 왼쪽유저와 오른쪽유저에 GameInterface에 선언된 IPlayer를 가져와 패들을 설정하고
 * IUser의 데이터 역시 가져온다.
 */
interface IPlayerInfo {
	leftPlayer: IPlayer;
	rightPlayer: IPlayer;
}

/**
 * @function PlayerInfo
 * @param leftPlayer
 * @param rightPlayer
 *
 * Link to={`url`} 확인해서 수정 필요!
 */
function PlayerInfo({ leftPlayer, rightPlayer }: IPlayerInfo) {
	return (
		<PlayerInfoDivStyleC>
			<PlayerInfoStyleC>
				<PlayerPhotoDivStyleC>
					<Link to={`/main/another/${leftPlayer.gameuser.nickname}`}>
						<PlayerPhotoStyleC src={leftPlayer.gameuser.avatar} alt={leftPlayer.gameuser.nickname} />
					</Link>
				</PlayerPhotoDivStyleC>
				<PlayerDataDivStyleC>
					<PlayerDataPStyleC>
						<Link to={`/main/another/${leftPlayer.gameuser.nickname}`}>{leftPlayer.gameuser.nickname}</Link>
					</PlayerDataPStyleC>
					<PlayerDataPStyleC>
						{leftPlayer.gameuser.wins}W {leftPlayer.gameuser.losses}L {leftPlayer.gameuser.ratio}pts
					</PlayerDataPStyleC>
				</PlayerDataDivStyleC>
			</PlayerInfoStyleC>
			<PlayerInfoStyleC>
				<PlayerPhotoDivStyleC>
					<Link to={`/main/another/${rightPlayer.gameuser.nickname}`}>
						<PlayerPhotoStyleC src={rightPlayer.gameuser.avatar} alt={rightPlayer.gameuser.nickname} />
					</Link>
				</PlayerPhotoDivStyleC>
				<PlayerDataDivStyleC>
					<PlayerDataPStyleC>
						<Link to={`/main/another/${rightPlayer.gameuser.nickname}`}>{rightPlayer.gameuser.nickname}</Link>
					</PlayerDataPStyleC>
					<PlayerDataPStyleC>
						{rightPlayer.gameuser.wins}W {rightPlayer.gameuser.losses}L {rightPlayer.gameuser.ratio}pts
					</PlayerDataPStyleC>
				</PlayerDataDivStyleC>
			</PlayerInfoStyleC>
		</PlayerInfoDivStyleC>
	);
}

export default PlayerInfo;

/**
 * 프로필에서 게임 유저 정보 가져오기 수정 필요
 * link to로 가져와야함
 */
