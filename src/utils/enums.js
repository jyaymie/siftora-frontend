// Running 'npm start' creates a dev env. (See package.json.)
export const IS_DEV = process.env.REACT_APP_ENV === 'dev' ? true : false;

// In a dev env, the local url is used. If not, the production url is used.
export const BASE_API_URL = IS_DEV
	? 'http://localhost:8000/api'
	: 'https://siftora.herokuapp.com/api';

export const LOCAL_STORAGE_KEY = 'siftoraApp'