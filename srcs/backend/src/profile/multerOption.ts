import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
// import { Profile } from 'passport-42';

/**
 *  프로필 이미지 폴더에 저장
 * 	path는 backend의 public profilePicture 폴더에 위치
 *  path가 존재하지 않을 경우 생성
 */
export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
	const uploadPath = './profilePicture';
	if (!existsSync(uploadPath)) {
		mkdirSync(uploadPath);
	}
      cb(null, uploadPath);
    },
	filename(req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`)
	}
  }),
};
