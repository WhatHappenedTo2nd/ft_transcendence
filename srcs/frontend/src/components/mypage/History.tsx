// import HistoryItem from "./HistoryItem";
import IUserProps from '../interface/IUserProps';
import { getLoginUserData } from '../../api/api';
import { IMatch } from '../interface/IGameProps'
import { getAllGameHistory, getGameHistory } from '../../api/api';
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
	const { isLoading: amILoading, data: Mydata, error: amIError } = useQuery<IUserProps | undefined>('me', getLoginUserData);

	// const { isLoading: isIMatchLoading , data: MyHistory, error: isIMatchError, isSuccess: success } = useQuery<IMatch[]>('gameHistory', getAllGameHistory);
	// const role = MyHistory?.filter((r) => r.id === Mydata?.id).pop();

	const { data: MyHistory } = useQuery<IMatch[] | undefined>(['matchHistory', Mydata!.id], () => getGameHistory(Mydata!.id));
	console.log("게임 매칭 히스토리를 확인해봅니다.", MyHistory);
	// const role = MyHistory?.filter((r) => r.id === Mydata?.id).pop();
	// console.log("마이 히스토리를 확인합니다.",role?.id, role?.lose_score, role?.loser, role?.win_score, role?.winner);

	// if ( amILoading || isIMatchLoading ) return <h1>Loading</h1>;
	// if ( amIError || isIMatchError ) return <div>Error</div>;
	// if ( success )	return <div>데이터 반환 성공</div>

	// const {data:Mydata} = useQuery<IUserProps>('me', getLoginUserData);
	// console.log("게임 MY데이터를 확인해보자!! : ", Mydata);

	// console.log("게임 MY히스토리를 확인해보자!! : ", myHistory);
	// const matchImgList = matches?.slice(0, 6).map
	// const matchImgList = MyHistory?.slice(0, 5).map((history) => (
	// 	<InnerDiv key={history?.id}>
	// 		<div className="matchImgDiv">
	// 			<img src={history?.winner.avatar} alt="winner" className="matchImg" id="matchImgA" />
	// 		</div>
	// 		<span className="innerSpan" id="matchNameA">
	// 			{history?.winner.nickname}
	// 		</span>
	// 		<p id="vs">VS</p>
	// 		<div className="matchImgDiv">
	// 			<img src={history?.loser.avatar} alt="loser" className="matchImg" id="matchImgB" />
	// 		</div>
	// 		<span className="innerSpan" id="matchNameB">
	// 			{history?.loser.nickname}
	// 		</span>
	// 	</InnerDiv>
	// ));
	return (
		<div>
			HISTORY
			{/* <GameMatchBox>{matchImgList}</GameMatchBox> */}
			{/* {MyHistory?.map((history) => {
				return (<HistoryItem key={history.id} history={history}  myId={Mydata?.id} myAvatar={Mydata?.avatar}/>);
			})} */}
		</div>
	);
}

export default History;
