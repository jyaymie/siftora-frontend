import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function SigninPage() {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const { setUser } = useContext(DataContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const getCookie = (name) => {
		let cookieValue = null;
		if (document.cookie && document.cookie !== '') {
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				const cookie = cookies[i].trim();
				if (cookie.substring(0, name.length + 1) === name + '=') {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	};

	const signInUser = (e) => {
		e.preventDefault();
		const post = async () => {
			setError('');
			try {
				const res = await axios.post(
					'http://localhost:8000/api/signin/',
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
				}
			} catch (error) {
				console.log("User wasn't created...", error);
				setError(
					'Hm, something went wrong. Please try again or contact support@siftora.com.'
				);
			}
		};
		post();
	};

	return (
		<div>
			<p>So good to have you back!</p>
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
				<Button variant='primary' type='submit'>
					Log In
				</Button>
			</Form>
			<p>
				New to Siftora?
				<Link to='/signup'>Create an account.</Link>
			</p>
			{error && error}
		</div>
	);
}

export default SigninPage;
