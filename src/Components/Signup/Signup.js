import './Signup.css';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Spinner from '../Spinner/Spinner';

import { BASE_API_URL } from '../../utils/enums';

function SignUp() {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { setUser } = useContext(DataContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmedPassword, setConfirmedPassword] = useState('');

	const signUpUser = (e) => {
		e.preventDefault();
		const post = async () => {
			setError('');
			setLoading(true);
			try {
				const res = await axios.post(`${BASE_API_URL}/signup/`, {
					username: username,
					password: password,
					password2: confirmedPassword,
				});
				if (res.status === 200) {
					setUser(res.data);
					navigate('/bins');
					setLoading(false);
				}
			} catch (error) {
				console.log("User wasn't created...", error);
				setLoading(false);
				setError(
					'Hm, something went wrong. Please try again or contact support@siftora.com.'
				);
			}
		};
		post();
	};

	return (
		<section className='sign-up'>
			<h1>SIFTORA</h1>
			<h2>Sign Up</h2>
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
						minLength='5'
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
						minLength='5'
						value={confirmedPassword}
						onChange={(e) => setConfirmedPassword(e.target.value)}
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
				Already a member? Log in{' '}
				<Link to='/log-in' className='modal-link'>
					here
				</Link>
				.
			</p>

			{loading && <Spinner />}
			{error && error}
		</section>
	);
}

export default SignUp;
