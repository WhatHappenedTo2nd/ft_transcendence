import { useDisclosure } from "@chakra-ui/react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getBlockList } from "../../api/api";
import { getCookie } from "../../api/cookieFunc";
import { socket } from "../../App";
import useWarningAlert from "../../hooks/useWarnigAlert";
import IFriendProps from "../interface/IFriendProps";

const DirectMSG = styled.button`
	color: black;
	width: 30%;
	font-size: 1em;
	margin: 1em;
	padding: 0.25em 1em;
	border: 2px solid #53B7BA;
	border-radius: 3px;
	margin-left: auto;
	margin-right: auto;
`

export default function DirectMessage({target}: {target: string;}) {
	const { setError, WarningDialogComponent } = useWarningAlert();
	const { data: block } = useQuery<IFriendProps[]>('block', getBlockList);

	let blockCheck = false;
	for (let i = 0; i < block!.length; i++)
	{
		if (target === block![i].nickname)
			blockCheck = true;
	}

	const joinDM = () => {
		console.log("blockCheck의 값은 : ", blockCheck);
		if (blockCheck){
			setError({
				headerMessage: '입장 실패',
				bodyMessage: '차단한 사람에게 DM을 보낼 수 없습니다.'
			})
		}
		else {
			socket.emit('invite-DM', { name: target, userIntraId: getCookie("intra_id")}, () => {});
		}
	}

	return (
		<>
		<DirectMSG onClick={joinDM}>
			DM 보내기
		</DirectMSG>
		{WarningDialogComponent}
		</>
	);
}

