import React from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import useWarningAlert from "./useWarnigAlert";
import { getCookie } from "../api/cookieFunc";
import { useQueryClient } from "react-query";

export default function useAddFriend(nickname: string) {
	const queryClient = useQueryClient();
	const toast = useToast();
	const { setError, WarningDialogComponent } = useWarningAlert();
	const onAddFriend = React.useCallback(() => {
		axios({
			method: "POST",
			headers: {
				Authorization: 'Bearer ' + getCookie("accessToken")
			},
			url: `/friend/request/${nickname}`
		}) // axios로 요청할 작업 (친구추가 신청)
		.then(() => {
			queryClient.invalidateQueries('Friend');
			queryClient.invalidateQueries('online');
			toast({
				title: `${nickname}님에게 친구 요청을 보냈습니다.`,
				status: 'success',
				isClosable: true,
				position: 'top-right',
			});
		})
		.catch((err) => {
			if (err.response) {
				setError({
					headerMessage: '친구 추가 실패',
					bodyMessage: err.response.data.message,
				});
			} else {
				setError({
					headerMessage: '친구 추가 실패',
					bodyMessage: err.message,
				});
			}
		});
	}, [nickname, toast, setError]);
	return { onAddFriend, WarningDialogComponent };
}