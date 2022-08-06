export const IS_DEV = process.env.REACT_APP_ENV === 'dev' ? true : false;
export const BASE_API_URL = IS_DEV
	? 'http://localhost:8000'
	: 'https://siftora.herokuapp.com/api';
