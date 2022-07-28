import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '../Home/Home';
import Bin from '../Bin/Bin';
import Product from '../Product/Product';

function App() {
	return (
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
	);
}

export default App;
