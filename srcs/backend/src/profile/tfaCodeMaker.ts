//4자리 난수 생성기

export function randomString(length: number, chars) {
	let mask = '';
  
	if (chars.indexOf('a') > -1) {
	  mask += 'abcdefghijklmnopqrstuvwxyz';
	}
	if (chars.indexOf('A') > -1) {
	  mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	}
	if (chars.indexOf('#') > -1) {
	  mask += '0123456789';
	}
	if (chars.indexOf('!') > -1) {
	  mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
	}
  
	let result = '';
	for (let i = length; i > 0; --i) {
	  result += mask[Math.floor(Math.random() * mask.length)];
	}
	return result;
  }