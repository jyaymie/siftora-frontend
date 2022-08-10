import './Signup.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthLocalStorage } from '../../utils/common';
import { BASE_API_URL } from '../../utils/enums';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Spinner from '../Spinner/Spinner';

function Signup() {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmedPassword, setConfirmedPassword] = useState('');

	const handleSignup = (e) => {
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
					setLoading(false);
					setAuthLocalStorage(res.data.token);
					navigate('/bins');
				}
			} catch (err) {
				setLoading(false);
				console.log('Something went wrong...', err);
				setError(
					'Hm, something went wrong. Please try again or contact jamieparkemail@gmail.com.'
				);
			}
		};

		post();
	};

	return (
		<section className='signup'>
			<h2>Sign Up</h2>

			<Form className='signup-form' onSubmit={handleSignup}>
				<Form.Group>
					<Form.Label htmlFor='username'>Username</Form.Label>
					<Form.Control
						type='text'
						id='username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group>
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
				<Form.Group>
					<Form.Label htmlFor='confirmed-password'>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						id='confirmed-password'
						minLength='5'
						value={confirmedPassword}
						onChange={(e) => setConfirmedPassword(e.target.value)}
						required
					/>
				</Form.Group>
				<div className='form-option-container'>
					<button type='submit' className='button-css'>
						Submit
					</button>
				</div>
			</Form>

			<p className='signup-bottom-text'>
				Already a member? Log in{' '}
				<Link to='/login' className='here-link modal-link'>
					here
				</Link>
				.
			</p>
			<p>
				To get a feel for the app before signing up,{' '}
				<Link to='/login' className='here-link modal-link'>
					log in
				</Link>{' '}
				as our test buddy:
				<ul>
					<li>Username: test</li>
					<li>Password: testtest</li>
				</ul>
			</p>

			{loading && <Spinner />}
			{error && error}
		</section>
	);
}

export default Signup;
