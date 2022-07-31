import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import About from '../About/About';
import SignupPage from '../SignupPage/SignupPage';
import SigninPage from '../SigninPage/SigninPage';
import Dashboard from '../Dashboard/Dashboard';
import Bin from '../Bin/Bin';
import FormToAddBin from '../FormToAddBin/FormToAddBin';
import FormToEditBin from '../FormToEditBin/FormToEditBin';
import Products from '../Products/Products';
import FormToAddProduct from '../FormToAddProduct/FormToAddProduct';
import FormToEditProduct from '../FormToEditProduct/FormToEditProduct';
import FormToAddProductToBin from '../FromToAddProductToBin/FormToAddProductToBin';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState('');
	
	return (
		<div>
			<header>
				<ul>
					<li>
						<Link to='/bins'>My Collection</Link>
					</li>
					<li>
						<Link to='/' onClick={() => setIsLoggedIn(false)}>
							Sign Out
						</Link>
					</li>
				</ul>
			</header>
			<main>
				<Routes>
					<Route path='/' element={<About />} />
					<Route path='/signup' element={<SignupPage />} />
					<Route path='/signin' element={<SigninPage />} />
					<Route path='/bins' element={<Dashboard />} />
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
	);
}

export default App;
