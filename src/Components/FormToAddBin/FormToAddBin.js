import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function FormToAddBin() {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [bins, setBins] = useState([]);

	// =================================================================== ADD BIN
	const addBin = async (e) => {
		e.preventDefault();
		setError('');
		try {
			const binToAdd = { title: e.target.title.value, products: [] };
			const res = await axios.post('http://localhost:8000/api/bins/', binToAdd);
			if (res.status === 201) {
				let updatedBins = [...bins];
				updatedBins.push(binToAdd);
				setBins(updatedBins);
				navigate('/bins');
			}
		} catch (error) {
			console.log("Bin wasn't add...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<div>
			<Form onSubmit={addBin}>
				<Form.Group className='mb-3'>
					<Form.Label>Title</Form.Label>
					<Form.Control id='title' required />
				</Form.Group>
				<Link to='/bins'>Cancel</Link>
				<Button type='submit' variant='primary'>
					Add
				</Button>
			</Form>
			{error && error}
		</div>
	);
}

export default FormToAddBin;
