import { useQuery } from 'react-query';
import { getUserByNickname, getLoginUserData } from '../../api/api';
import IUserProps from '../interface/IUserProps'
import { useNavigate, useParams } from 'react-router';
import './styles.css';
import UserProfileItem from './UserProfileItem';

/**
 * 다른 유저 정보 리턴
 * profile/내닉네임 링크에 들어갈 경우 마이페이지(profile)로 리디렉션
 * 2차인증이 완료됐을 경우 Authorized 뱃지가 생김!
 */

function UserProfile() {
	const params = useParams();
	const navigate = useNavigate();
	const { isLoading: amILoading, data: Userdata, error: amIError } = useQuery<IUserProps>(['usernick', params.nickname], () => getUserByNickname(params.nickname));
	const { isLoading: MydataLoading, data:Mydata , error: MydataError } = useQuery<IUserProps>('me', getLoginUserData);
	if (amILoading || MydataLoading) return <h1>Loading</h1>;
	if (amIError || MydataError) return <div>Error</div>;

	if (Userdata?.nickname === Mydata?.nickname)
		navigate("/profile");

	return (
		<UserProfileItem user={Userdata}/>
  );
}

export default UserProfile;
