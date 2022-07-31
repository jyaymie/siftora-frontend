import { Link } from 'react-router-dom';

function Home() {
	return (
		<div>
			<ul>
				<li>
					<Link to='/bins'>My Bins</Link>
				</li>
				<li>
					<Link to='/products'>My Products</Link>
				</li>
				<li>
					<Link to='/add-bin'>Add Bin</Link>
				</li>
				<li>
					<Link to='/add-product'>Add Product</Link>
				</li>
			</ul>
		</div>
	);
}

export default Home;
