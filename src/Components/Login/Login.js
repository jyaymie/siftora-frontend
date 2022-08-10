import './Login.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthLocalStorage } from '../../utils/common';
import { BASE_API_URL } from '../../utils/enums';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Spinner from '../Spinner/Spinner';

function Login() {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = (e) => {
		e.preventDefault();

		const post = async () => {
			setError('');
			setLoading(true);
			try {
				const res = await axios.post(`${BASE_API_URL}/login/`, {
					username: username,
					password: password,
				});
				if (res.status === 200) {
					setLoading(false);
					setAuthLocalStorage(res.data.token);
					navigate('/bins');
				}
			} catch (error) {
				setLoading(false);
				console.log('Something went wrong...', error);
				setError(
					'Hm, something went wrong. Please try again or contact jamieparkemail@gmail.com.'
				);
			}
		};

		post();
	};

	return (
		<section className='login'>
			<h2>Log In</h2>

			<Form className='login-form' onSubmit={handleLogin}>
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
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</Form.Group>
				<div className='form-option-container'>
					<button type='submit' className='button-css'>
						Submit
					</button>
				</div>
			</Form>

			<p className='login-bottom-text'>
				New to Siftora? Sign up{' '}
				<Link to='/signup' className='modal-link'>
					here
				</Link>
				.
			</p>
			<p>
				To get a feel for the app before signing up, log in as our test buddy:
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

export default Login;
