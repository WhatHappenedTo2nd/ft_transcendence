export default interface IChat {
	name: string;
	message: string;
	socket_id: string;
};

export default interface ICreateRoomResponse {
	success: boolean;
	payload: string;
};
