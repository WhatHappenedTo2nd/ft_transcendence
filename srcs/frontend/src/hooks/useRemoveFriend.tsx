import React from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import useWarningAlert from "./useWarnigAlert";
import { getCookie } from "../api/cookieFunc";
import { useQueryClient } from "react-query";

export default function useRemoveFriend(nickname: string) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const { setError, WarningDialogComponent } = useWarningAlert();
	const onRemoveFriend = React.useCallback(() => {
		axios({
			method: "PATCH",
			headers: {
				Authorization: 'Bearer ' + getCookie("accessToken")
			},
			url: `/friend/remove/${nickname}`
		})
		.then(() => {
			queryClient.invalidateQueries('Friend');
			queryClient.invalidateQueries('online');
			toast({
				title: `${nickname}님을 친구목록에서 제거했습니다.`,
				status: 'success',
				isClosable: true,
				position: 'top-right',
			});
		})
		.catch((err) => {
			if (err.response) {
				setError({
					headerMessage: '친구 해제 실패',
					bodyMessage: err.response.data.message,
				});
			} else {
				setError({
					headerMessage: '친구 해제 실패',
					bodyMessage: err.message,
				});
			}
		});
	}, [nickname, toast, setError]);
	return { onRemoveFriend, WarningDialogComponent };
}