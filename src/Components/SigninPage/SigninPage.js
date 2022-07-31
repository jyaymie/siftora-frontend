import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function SigninPage() {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleSignUp = (e) => {
		e.preventDefault();
		const post = async () => {
			setError('');
			try {
				const res = await axios
					.post(
						'https://siftora.herokuapp.com/admin/auth/user/',
						{
							username: username,
							password: password,
						},
						{ withCredentials: true }
					)
					.then((res) => {
						setIsLoggedIn(true);
						navigate('/');
					});
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
			<Form onSubmit={handleSignUp}>
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
