import IUserProps from '../interface/IUserProps';
import { getLoginUserData } from '../../api/api';
import { IMatch } from '../interface/IGameProps'
import { getGameHistory } from '../../api/api';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import './styles.css';

const GameMatchBox = styled.div`
	grid-area: matchDiv;
	display: grid;
	grid-template-rows: repeat(1fr);
	text-align: center;
	grid-gap: 1rem;
	place-items: center;
	overflow: scroll;
`;

const InnerDiv = styled.div`
	border: 1px dashed white;
	width: 100%;
	border-radius: 10px;
	padding: 0.5rem;
	display: grid;
	place-items: center;
	grid-template-areas:
	'matchImgA winA vs winB matchImgB'
	'matchNicknameA matchScoreA . matchScoreB matchNicknameB';
`;

function History(){
	const { isLoading: amILoading, data: Mydata, error: amIError } = useQuery<IUserProps | undefined>('me', getLoginUserData, {refetchInterval: 1000});
	const { isLoading: MyHistoryLoading, data: MyHistory , error: MyHistoryError } = useQuery<IMatch[] | undefined>(['matchHistory', Mydata?.id], () => getGameHistory(Mydata?.id), {enabled: !!Mydata?.id,});
	if (amILoading || MyHistoryLoading) return <h1>Loading</h1>;
	if (amIError || MyHistoryError) return <div>Error</div>;
	const matchImgList = MyHistory?.map((history) => (
		<InnerDiv key={history?.id}>
			<div className="matchImgDiv" id="matchImgA">
				<img src={history?.winner.id === Mydata?.id ? history?.winner.avatar : history?.loser.avatar} alt="winner" className="matchImg"/>
			</div>
			<span className="innerSpan" id="matchNameA">
				{history?.winner.id === Mydata?.id ? history?.winner.nickname : history?.loser.nickname}
			</span>
			<span className="innerSpan" id="winA">
				{history?.winner.id === Mydata?.id ? "Win" : "Lose"}
			</span>
			<span className="innerSpan" id="matchScoreA">
				{history?.winner.id === Mydata?.id ? history?.win_score : history?.lose_score}
			</span>
			<p id="vs">VS</p>
			<div className="matchImgDiv" id="matchImgB">
				<img src={history?.winner.id === Mydata?.id ? history?.loser.avatar : history?.winner.avatar} alt="loser" className="matchImg"/>
			</div>
			<span className="innerSpan" id="matchNameB">
				{history?.winner.id === Mydata?.id ? history?.loser.nickname : history?.winner.nickname}
			</span>
			<span className="innerSpan" id="winB">
				{history?.winner.id === Mydata?.id ? "Lose" : "Win"}
			</span>
			<span className="innerSpan" id="matchScoreB">
				{history?.winner.id === Mydata?.id ? history?.lose_score : history?.win_score}
			</span>
		</InnerDiv>
	));

	return (
		<div>
			<GameMatchBox>{matchImgList}</GameMatchBox>
		</div>
	);
}

export default History;
