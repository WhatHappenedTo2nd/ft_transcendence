export default interface IChat {
	id: number;
	name: string;
	message: string;
	socket_id: string;
};

export default interface ICreateRoomResponse {
	success: boolean;
	payload: string;
	roomName: string;
};
