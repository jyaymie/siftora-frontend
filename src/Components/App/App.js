import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import Home from '../Home/Home';
import Bins from '../Bins/Bins';
import Bin from '../Bin/Bin';
import BinForm from '../BinForm/BinForm';
import BinUpdateForm from '../BinUpdateForm/BinUpdateForm';
import ProductForm from '../ProductForm/ProductForm';
import Products from '../Products/Products';
import ProductUpdateForm from '../ProductUpdateForm/ProductUpdateForm';

function App() {
	const [error, setError] = useState(''); // For error handling
	const [bins, setBins] = useState([]);
	const [products, setProducts] = useState([]);

	return (
		<DataContext.Provider
			value={{
				error,
				setError,
				bins,
				setBins,
				products,
				setProducts,
			}}>
			<div>
				<header>
					<Link to='/'>SIFTORA</Link>
				</header>
				<main>
					<Routes>
						<Route path='/' element={<Home />}></Route>
						<Route path='/bins' element={<Bins />}></Route>
						<Route path='/bins/:id' element={<Bin />}></Route>
						<Route path='/bin-form' element={<BinForm />}></Route>
						<Route
							path='/bin-update-form/:id'
							element={<BinUpdateForm />}></Route>
						<Route path='/product-form' element={<ProductForm />}></Route>
						<Route
							path='/product-update-form/:id'
							element={<ProductUpdateForm />}></Route>
						<Route path='/products' element={<Products />}></Route>
					</Routes>
				</main>
			</div>
		</DataContext.Provider>
	);
}

export default App;
