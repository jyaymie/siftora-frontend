import { Link } from 'react-router-dom';

function Home() {
	return (
		<>
			<ul>
				<li>
					<Link to='/product-form'>Add Product</Link>
				</li>
				<li>
					<Link to='/bin-form'>Add Bin</Link>
				</li>
				<li>
					<Link to='/products'>My Products</Link>
				</li>
				<li>
					<Link to='/bins'>My Bins</Link>
				</li>
			</ul>
		</>
	);
}

export default Home;
