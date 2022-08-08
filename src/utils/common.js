import { useEffect, useState } from 'react';
import { BASE_API_URL, LOCAL_STORAGE_KEY } from './enums';
import axios from 'axios';

export function setAuthLocalStorage(token) {
	localStorage.setItem(LOCAL_STORAGE_KEY, token);
}

export function getAuthLocalStorage() {
	return localStorage.getItem(LOCAL_STORAGE_KEY);
}

// Remove all query params from the current path.
export function getPathFromUrl(url) {
	return url.split(/[?#]/)[0];
}

// https://onur.dev/writing/useFetch-react-hook

// Fetching data is now done through the useAuthFetch custom hook, which pulls
// the auth token from local storage. With local storage, the token persists on
// page refresh. (Using a global context happens to clear the token on page
// refresh.)

// This custom hook also handles loading states, error messages, and data
// refreshing.

export function useAuthFetch(path) {
	const errorMessage =
		'Hm, something went wrong. Please try again or contact jamieparkemail@gmail.com.';
	const token = getAuthLocalStorage();

	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [url, setUrl] = useState(`${BASE_API_URL}${path}`);
	const [refetchIndex, setRefetchIndex] = useState(0);
	const refetch = () =>
		setRefetchIndex((prevRefetchIndex) => prevRefetchIndex + 1);

	// ======================================================================= GET
	const fetchItems = () => {
		setError('');
		setLoading(true);
		axios
			.get(url, {
				// A token is required to access any API route.
				headers: {
					Authorization: `Token ${token}`,
				},
			})
			.then((res) => {
				setLoading(false);
				setData(res.data);
			})
			.catch((err) => {
				setLoading(false);
				console.log('Something went wrong...', err);
				setError(errorMessage);
			});
	};

	// ==================================================================== DELETE
	const deleteItem = (item) => {
		const noQueryUrl = getPathFromUrl(url);
		setError('');
		setLoading(true);
		axios
			.delete(`${noQueryUrl}${item.id}`, {
				headers: {
					Authorization: `Token ${token}`,
				},
			})
			.then(() => {
				setLoading(false);
				fetchItems();
			})
			.catch((err) => {
				setLoading(false);
				console.log('Something went wrong...', err);
				setError(errorMessage);
			});
	};

	// ======================================================================= PUT
	const updateItem = (item, path) => {
		const noQueryUrl = getPathFromUrl(path ? path : url);
		setError('');
		setLoading(true);
		axios
			.put(`${noQueryUrl}${item.id}`, item, {
				headers: {
					Authorization: `Token ${token}`,
				},
			})
			.then(() => {
				fetchItems();
			})
			.catch((err) => {
				setLoading(false);
				console.log('Something went wrong...', err);
				setError(errorMessage);
			});
	};

	// ================================================================= useEffect
	useEffect(() => {
		fetchItems();
	}, [url, token, refetchIndex]);

	return { data, loading, error, deleteItem, setUrl, updateItem, refetch };
}
