import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import { DataContext } from '../../dataContext';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Home from '../Home/Home';
import Signup from '../Signup/Signup';
import Login from '../Login/Login';
import Bins from '../Bins/Bins';
import Bin from '../Bin/Bin';
import FormToEditBin from '../FormToEditBin/FormToEditBin';
import Products from '../Products/Products';
import FormToAddProduct from '../FormToAddProduct/FormToAddProduct';
import FormToAddProductToBin from '../FromToAddProductToBin/FormToAddProductToBin';
import FormToEditProduct from '../FormToEditProduct/FormToEditProduct';

function App() {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState('');

	// const signOutUser = async () => {
	// 	setError('');
	// 	setLoading(true);
	// 	try {
	// 		const res = await axios.post('${BASE_API_URL}/signout/');
	// 		if (res.status === 200) {
	// 			setLoading(false);
	// 			navigate('/');
	// 		}
	// 	} catch (error) {
	// 		console.log("User wasn't signed out...", error);
	// 		setLoading(false);
	// 		setError(
	// 			'Hm, something went wrong. Please try again or contact support@siftora.com.'
	// 		);
	// 	}
	// };

	const location = useLocation();

	// ======================================================================= JSX
	return (
		<DataContext.Provider
			value={{
				token,
				setToken,
			}}>
			<div className='app'>
				{/* Don't display the header/footer on the landing page */}
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
							</div>
						</nav>
						{/* <Link to='/' onClick={signOutUser}>
						Sign Out
					</Link> */}
					</header>
				)}
				<main>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/signup' element={<Signup />} />
						<Route path='/login' element={<Login />} />
						<Route path='/bins' element={<Bins />} />
						<Route path='/bins/:id' element={<Bin />} />
						<Route path='/bins/:id/edit' element={<FormToEditBin />} />
						<Route path='/products' element={<Products />} />
						<Route path='/add-product' element={<FormToAddProduct />} />
						<Route
							path='/bins/:id/add-product'
							element={<FormToAddProductToBin />}
						/>
						<Route path='/products/:id/edit' element={<FormToEditProduct />} />
					</Routes>
				</main>

				{location.pathname !== '/' && <footer>&copy; SIFTORA 2022</footer>}

				{loading && 'Loading...'}
				{error && error}
			</div>
		</DataContext.Provider>
	);
}

export default App;
