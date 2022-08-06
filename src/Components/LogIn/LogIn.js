import './Login.css';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Spinner from '../Spinner/Spinner';

import { BASE_API_URL } from '../../utils/enums';

function Login() {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { setUser } = useContext(DataContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	// const getCookie = (name) => {
	// 	let cookieValue = null;
	// 	if (document.cookie && document.cookie !== '') {
	// 		const cookies = document.cookie.split(';');
	// 		for (let i = 0; i < cookies.length; i++) {
	// 			const cookie = cookies[i].trim();
	// 			if (cookie.substring(0, name.length + 1) === name + '=') {
	// 				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	// 				break;
	// 			}
	// 		}
	// 	}
	// 	return cookieValue;
	// };

	const signInUser = (e) => {
		e.preventDefault();
		const post = async () => {
			setError('');
			setLoading(true);
			try {
				const res = await axios.post(
					`${BASE_API_URL}/api/signin/`,
					{
						username: username,
						password: password,
					},
					{
						// headers: {
						// 	'Content-Type': 'application/json',
						// 	'X-CSRFToken': getCookie('csrftoken'),
						// },
						// withCredentials: true,
					}
				);
				if (res.status === 200) {
					setUser(res.data);
					navigate('/bins');
					setLoading(false);
				}
			} catch (error) {
				console.log("User wasn't authenticated...", error);
				setLoading(false);
				setError(
					'Hm, something went wrong. Please try again or contact support@siftora.com.'
				);
			}
		};
		post();
	};

	return (
		<section className='log-in'>
			<h2>Log In</h2>
			<Form onSubmit={signInUser}>
				<Form.Group className='mb-3'>
					<Form.Label htmlFor='username'>Username</Form.Label>
					<Form.Control
						type='text'
						id='username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label htmlFor='password'>Password</Form.Label>
					<Form.Control
						type='password'
						id='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'></Form.Group>
				<div className='form-option-container'>
					<button type='submit' className='button-css'>
						Submit
					</button>
				</div>
			</Form>
			<p className='form-bottom-text'>
				New to Siftora? Sign up{' '}
				<Link to='/sign-up' className='modal-link'>
					here
				</Link>
				.
			</p>
			{loading && <Spinner />}
			{error && error}
		</section>
	);
}

export default Login;
