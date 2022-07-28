import { useContext, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import axios from 'axios';
import Card from 'react-bootstrap/Card';

function Bin() {
	const { error, setError, loading, setLoading } = useContext(DataContext);
	const [products, setProducts] = useState([]);
	const { id } = useParams();

	useEffect(() => {
		const getProducts = async () => {
			setError('');
			setLoading(true);
			try {
				const res = await axios.get(`http://localhost:8000/api/bins/${id}`);
				if (res.status === 200) {
					console.log('Found the bin!', res);
					setLoading(false);
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

	if (!products) {
		return <p>Loading products...</p>;
	}
	return (
		<div>
			{products.map((product) => (
				<Card style={{ width: '200px' }} key={product.id}>
					<Card.Body>
						<Card.Text>
							<strong>{product.name}</strong>
						</Card.Text>
						<Card.Text>{product.brand}</Card.Text>
						<Card.Text>Expiring: {product.expiry_date}</Card.Text>
						<Link to={`products/${product.id}`}>Edit</Link>
					</Card.Body>
				</Card>
			))}
		</div>
	);
}

export default Bin;
