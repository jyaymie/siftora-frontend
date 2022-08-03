import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function SignupPage() {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const { setUser } = useContext(DataContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmedPassword, setConfirmedPassword] = useState('');

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

	const signUpUser = (e) => {
		e.preventDefault();
		const post = async () => {
			setError('');
			try {
				const res = await axios.post('https://siftora.netlify.app/api/signup/', {
					username: username,
					password: password,
					password2: confirmedPassword,
				});
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
			<p>Join the SIFTORA community!</p>
			<Form onSubmit={signUpUser}>
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
						minlength='5'
						placeholder='At least 5 characters'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label htmlFor='password'>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						id='password'
						minlength='5'
						value={confirmedPassword}
						onChange={(e) => setConfirmedPassword(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'></Form.Group>
				<Button variant='primary' type='submit'>
					Sign Up
				</Button>
			</Form>
			<p>
				Already a member?
				<Link to='/signin'>Sign in.</Link>
			</p>
			{error && error}
		</div>
	);
}

export default SignupPage;
