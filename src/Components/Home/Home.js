import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';

function Home() {
	const [bins, setBins] = useState([]);

	// Error-handling states
	const [error, setError] = useState('');
	const [loading, setLoading] = useState('');

	const getBins = async () => {
		setError('');
		setLoading(true);
		try {
			const res = await axios.get('http://localhost:8000/api/bins/');
			if (res.status === 200) {
				console.log('Found the bins!', res);
				setLoading(false);
				setBins(res.data);
			}
		} catch (error) {
			console.log('Where are the bins?', error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	useEffect(() => {
		getBins();
	}, []);

	return (
		<div>
			{bins ? (
				bins.map((bin) => (
					<Card style={{ width: '300px' }} key={bin.id}>
						<Card.Body>
							<Link to={`bins/${bin.id}`}>
								<Card.Text>
									{bin.title} ({bin.product_count})
								</Card.Text>
							</Link>
							<Card.Link href='#'>Edit</Card.Link>
							<Card.Link href='#'>Delete</Card.Link>
						</Card.Body>
					</Card>
				))
			) : (
				<Card style={{ width: '300px' }}>
					<Card.Body>
						<Card.Text>Add Bin</Card.Text>
					</Card.Body>
				</Card>
			)}
			{loading && 'Finding your bins 🔎'}
			{error && error}
		</div>
	);
}

export default Home;
