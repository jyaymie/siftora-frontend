import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function SignupPage() {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmedPassword, setConfirmedPassword] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleSignUp = (e) => {
		e.preventDefault();
		const post = async () => {
			setError('');
			try {
				const res = await axios
					.post('https://siftora.herokuapp.com/admin/auth/user/add/', {
						username: username,
						password: password,
						re_password: confirmedPassword,
					})
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
			<p>Join the SIFTORA community!</p>
			<Form onSubmit={handleSignUp}>
				<Form.Group className='mb-3' controlId='formBasicEmail'>
					<Form.Label htmlFor='username'>Username</Form.Label>
					<Form.Control
						type='text'
						id='username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='formBasicPassword'>
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
				<Form.Group className='mb-3' controlId='formBasicPassword'>
					<Form.Label htmlFor='password'>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						id='password'
						minLength='8'
						value={confirmedPassword}
						onChange={(e) => setConfirmedPassword(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='formBasicCheckbox'></Form.Group>
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
