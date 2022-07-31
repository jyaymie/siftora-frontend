import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '../Home/Home';
import Bins from '../Bins/Bins';
import Bin from '../Bin/Bin';
import FormToAddBin from '../FormToAddBin/FormToAddBin';
import FormToEditBin from '../FormToEditBin/FormToEditBin';
import Products from '../Products/Products';
import FormToAddProduct from '../FormToAddProduct/FormToAddProduct';
import FormToAddProductToBin from '../FromToAddProductToBin/FormToAddProductToBin';
import FormToEditProduct from '../FormToEditProduct/FormToEditProduct';

function App() {
	return (
		<div>
			<header>
				<Link to='/'>SIFTORA</Link>
			</header>
			<main>
				<Routes>
					<Route path='/' element={<Home />}></Route>
					<Route path='/bins' element={<Bins />}></Route>
					<Route path='/bins/:id' element={<Bin />}></Route>
					<Route path='/add-bin' element={<FormToAddBin />}></Route>
					<Route path='/bins/:id/edit' element={<FormToEditBin />}></Route>
					<Route path='/products' element={<Products />}></Route>
					<Route path='/add-product' element={<FormToAddProduct />}></Route>
					<Route
						path='/bins/:id/add-product'
						element={<FormToAddProductToBin />}></Route>
					<Route
						path='/products/:id/edit'
						element={<FormToEditProduct />}></Route>
				</Routes>
			</main>
		</div>
	);
}

export default App;
