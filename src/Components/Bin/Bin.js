import { useContext, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';

function Bin() {
	const { error, setError, loading, setLoading } = useContext(DataContext);
	const [bin, setBin] = useState({});
	const [products, setProducts] = useState([]);
	const [useCount, setUseCount] = useState(null);
	const { id } = useParams();

	useEffect(() => {
		const getProducts = async () => {
			setError('');
			setLoading(true);
			try {
				const res = await axios.get(`http://localhost:8000/api/bins/${id}/`);
				if (res.status === 200) {
					console.log('Found the bin!', res);
					setLoading(false);
					setBin(res.data);
					setProducts(res.data.products);
				}
			} catch (error) {
				console.log("Products weren't retrieved...", error);
				setLoading(false);
				setError(
					'Hm, something went wrong. Please try again or contact support@siftora.com.'
				);
			}
		};
		// Call the getProducts function
		getProducts();
	}, []);

	const incrementUse = (product) => {
		setUseCount(product.use_count++);
		product.use_count = useCount;
		updateCount();
	};

	const decrementUse = (product) => {
		setUseCount(product.use_count--);
		product.use_count = useCount;
		updateCount();
	};

	const deleteProduct = async (index) => {
		setError('');
		setLoading(true);
		let updatedProducts = [...products];
		updatedProducts.splice(index, 1);
		setProducts(updatedProducts);
		try {
			const res = await axios.put(`http://localhost:8000/api/bins/${id}/`, {
				...bin,
				products,
			});
			if (res.status === 200) {
				setLoading(false);
			}
		} catch (error) {
			console.log("Product wasn't deleted...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	const updateCount = async (product) => {
		setError('');
		setLoading(true);

		try {
			const res = await axios.put(
				`http://localhost:8000/api/products/${product.key}/`,
				{
					...product,
					// use_count,
				}
			);
			if (res.status === 200) {
				setLoading(false);
			}
		} catch (error) {
			console.log("Bin wasn't deleted...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	if (!products) {
		return <p>Loading products...</p>;
	}
	return (
		<div>
			{products.map((product, index) => (
				<Accordion key={product.id}>
					<Accordion.Item eventKey='0'>
						<Accordion.Header>
							{`${product.name} by ${product.brand} / Expiration
							Date: ${product.expiry_date}`}
						</Accordion.Header>
						<Accordion.Body>
							<ul>
								<li>Shade: {product.shade}</li>
								<li>Finish: {product.finish}</li>
								<li>Purchase Date: {product.purchase_date}</li>
								<li>Price: {product.price}</li>
								<li>Open Date: {product.open_date}</li>
								<li>
									# of Uses: {product.use_count}{' '}
									<Button
										type='button'
										variant='secondary'
										onClick={() => decrementUse(product)}>
										-
									</Button>
									<Button
										type='button'
										variant='secondary'
										onClick={() => incrementUse(product)}>
										+
									</Button>
								</li>
								<li>Finish Date: {product.finish_date}</li>
								<li>Will Repurchase: {product.will_repurchase}</li>
								<li>Notes: {product.notes}</li>
							</ul>
							<Link to='/product'>Edit</Link>
							<Button
								type='button'
								variant='secondary'
								onClick={() => deleteProduct(index)}>
								Delete from Bin
							</Button>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			))}
		</div>
	);
}

export default Bin;
