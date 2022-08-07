// Running 'npm start' will create a dev environment. (See package.json.)
export const IS_DEV = process.env.REACT_APP_ENV === 'dev' ? true : false;

// If you're in a dev environment, the local url will be used.
// Otherwise, the production url will be used.
export const BASE_API_URL = IS_DEV
	? 'http://localhost:8000/api'
	: 'https://siftora.herokuapp.com/api';

export const LOCAL_STORAGE_KEY = 'siftoraApp';