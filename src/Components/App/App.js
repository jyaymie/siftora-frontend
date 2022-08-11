import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import {
	Link,
	Route,
	Routes,
	useLocation,
	useNavigate,
} from 'react-router-dom';
import { BASE_API_URL, LOCAL_STORAGE_KEY } from '../../utils/enums';
import axios from 'axios';
import Home from '../Home/Home';
import Signup from '../Signup/Signup';
import Login from '../Login/Login';
import Bins from '../Bins/Bins';
import Bin from '../Bin/Bin';
import Products from '../Products/Products';

function getAuthLocalStorage() {
	return localStorage.getItem(LOCAL_STORAGE_KEY);
}

function App() {
	const navigate = useNavigate();

	const logOut = async () => {
		const token = getAuthLocalStorage();
		try {
			const res = await axios.post(
				`${BASE_API_URL}/logout/`,
				{},
				{
					headers: {
						Authorization: `Token ${token}`,
					},
				}
			);
			if (res.status === 200) {
				navigate('/');
			}
		} catch (err) {
			console.log('Something went wrong...', err);
		}
	};

	const location = useLocation();

	// ======================================================================= JSX
	return (
		<div className='app'>
			{/* Don't display the header/footer on the landing page. */}
			{location.pathname !== '/' && (
				<header>
					<nav className='app-nav'>
						<Link to='/bins' className='nav-icon-link'>
							S
						</Link>
						<div className='nav-text-link-container'>
							<Link to='/bins' className='nav-text-link'>
								BINS
							</Link>
							<Link to='/products' className='nav-text-link'>
								PRODUCTS
							</Link>
							<Link to='/' className='nav-text-link' onClick={logOut}>
								LOG OUT
							</Link>
						</div>
					</nav>
				</header>
			)}
			<main>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/signup' element={<Signup />} />
					<Route path='/login' element={<Login />} />
					<Route path='/bins' element={<Bins />} />
					<Route path='/bins/:id' element={<Bin />} />
					<Route path='/products' element={<Products />} />
				</Routes>
			</main>

			{location.pathname !== '/' && <footer>&copy; SIFTORA 2022</footer>}
		</div>
	);
}

export default App;
