import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// import { useContext, useState } from 'react';
// import { DataContext } from '../../dataContext';
// import { useNavigate } from 'react-router-dom';
import { Routes, Route, Link } from 'react-router-dom';
// import axios from 'axios';
import About from '../About/About';
// import SignupPage from '../SignupPage/SignupPage';
// import SigninPage from '../SigninPage/SigninPage';
import Bins from '../Bins/Bins';
import Bin from '../Bin/Bin';
import FormToAddBin from '../FormToAddBin/FormToAddBin';
import FormToEditBin from '../FormToEditBin/FormToEditBin';
import Products from '../Products/Products';
import FormToAddProduct from '../FormToAddProduct/FormToAddProduct';
import FormToEditProduct from '../FormToEditProduct/FormToEditProduct';
import FormToAddProductToBin from '../FromToAddProductToBin/FormToAddProductToBin';

function App() {
	// const navigate = useNavigate();
	// const [error, setError] = useState('');
	// const [loading, setLoading] = useState(false);
	// const [user, setUser] = useState({
	// 	csrf: '',
	// 	username: '',
	// 	password: '',
	// 	error: '',
	// 	isAuthenticated: false,
	// });

	// const signOutUser = async () => {
	// 	setError('');
	// 	setLoading(true);
	// 	try {
	// 		const res = await axios.post('http://localhost:8000/api/signout/');
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

	return (
		// <DataContext.Provider
		// 	value={{
		// 		user,
		// 		setUser,
		// 	}}>
		<div>
			<header>
				<nav>
					<Link to='/' className='home-link'>
						SIFTORA
					</Link>
					{/* <Link to='/' onClick={signOutUser}>
						Sign Out
					</Link> */}
				</nav>
			</header>
			<main>
				<Routes>
					<Route path='/' element={<About />} />
					{/* <Route path='/signup' element={<SignupPage />} />
					<Route path='/signin' element={<SigninPage />} /> */}
					<Route path='/bins' element={<Bins />} />
					<Route path='/bins/:id' element={<Bin />} />
					<Route path='/add-bin' element={<FormToAddBin />} />
					<Route path='/bins/:id/edit' element={<FormToEditBin />} />
					<Route path='/products' element={<Products />} />
					<Route path='/add-product' element={<FormToAddProduct />} />
					<Route path='/products/:id/edit' element={<FormToEditProduct />} />
					<Route
						path='/bins/:id/add-product'
						element={<FormToAddProductToBin />}
					/>
				</Routes>
			</main>
			<footer>&copy; SIFTORA 2022</footer>
		</div>
		// </DataContext.Provider>
	);
}

export default App;
