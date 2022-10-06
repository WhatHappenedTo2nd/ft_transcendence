// import HistoryItem from "./HistoryItem";
import IUserProps from '../interface/IUserProps';
import { getLoginUserData } from '../../api/api';
import { IMatch } from '../interface/IGameProps'
import { getGameHistory } from '../../api/api';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import './styles.css';

type Props = {
	id: number;
};

const GameMatchBox = styled.div`
	grid-area: matchDiv;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(2, 1fr);
	text-align: center;
	grid-gap: 1rem;
	place-items: center;
`;

const InnerDiv = styled.div`
	border: 1px dashed white;
	width: 100%;
	border-radius: 10px;
	padding: 0.5rem;
	display: grid;
	place-items: center;
	grid-template-areas:
	'matchImgA vs matchImgB'
	'matchNicknameA . matchNicknameB';
`;

function History(){
	const { isLoading: amILoading, data: Mydata, error: amIError } = useQuery<IUserProps>('me', getLoginUserData);
	console.log("게임 MY데이터를 확인해보자!! : ", Mydata);
	const { isLoading: isIMatchLoading , data: MyHistory, error: isIMatchError } = useQuery<IMatch[]>(['gameHistory', Mydata!.id], ()=>getGameHistory(Mydata!.id));
	console.log("게임 HISTORY데이터를 확인해보자!! : ", MyHistory);
	if ( amILoading || isIMatchLoading ) return <h1>Loading</h1>;
	if ( amIError || isIMatchError ) return <div>Error</div>;

	const matchImgList = MyHistory?.slice(0, 5).map((history) => (
		<InnerDiv key={history?.id}>
			<div className="matchImgDiv">
				<img src={history?.winner.avatar} alt="winner" className="matchImg" id="matchImgA" />
			</div>
			<span className="innerSpan" id="matchNameA">
				{history?.winner.nickname}
			</span>
			<p id="vs">VS</p>
			<div className="matchImgDiv">
				<img src={history?.loser.avatar} alt="loser" className="matchImg" id="matchImgB" />
			</div>
			<span className="innerSpan" id="matchNameB">
				{history?.loser.nickname}
			</span>
		</InnerDiv>
	));
	return (
		<div>
			<GameMatchBox>{matchImgList}</GameMatchBox>
			{/* {MyHistory?.map((history) => {
				return (<HistoryItem key={history.id} history={history}  myId={Mydata?.id} myAvatar={Mydata?.avatar}/>);
			})} */}
		</div>
	);
}

export default History;
