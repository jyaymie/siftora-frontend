import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useContext, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import Home from '../Home/Home';
import Bin from '../Bin/Bin';
import Product from '../Product/Product';

function App() {
	// For error handling in all components
	const [error, setError] = useState('');
	const [loading, setLoading] = useState('');

	return (
		<DataContext.Provider
			value={{
				error,
				setError,
				loading,
				setLoading,
			}}>
			<div>
				<header>
					<Link to='/'>SIFTORA</Link>
				</header>
				<main>
					<Routes>
						<Route path='/' element={<Home />}></Route>
						<Route path='/bins/:id' element={<Bin />}></Route>
						<Route path='/product' element={<Product />}></Route>
					</Routes>
				</main>
			</div>
		</DataContext.Provider>
	);
}

export default App;
