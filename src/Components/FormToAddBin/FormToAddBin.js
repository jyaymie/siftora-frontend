import './FormToAddBin.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Spinner from '../Spinner/Spinner';

function FormToAddBin() {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [bins, setBins] = useState([]);

	// =================================================================== ADD BIN
	const addBin = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true)
		try {
			const binToAdd = { title: e.target.title.value };
			const res = await axios.post('http://localhost:8000/api/bins/', binToAdd);
			if (res.status === 201) {
				let updatedBins = [...bins];
				updatedBins.push(binToAdd);
				setBins(updatedBins);
				navigate('/bins');
				setLoading(false);
			}
		} catch (error) {
			console.log("Bin wasn't add...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<section className='form-to-add-bin'>
				<h2>New Bin </h2>
				<Form onSubmit={addBin}>
					<Form.Group>
						<Form.Label htmlFor='title'>Title</Form.Label>
						<Form.Control id='title' required />
					</Form.Group>
					<div className='form-option-container'>
						<Link to='/bins' className='bin-form-cancel-option button-css'>
							Cancel
						</Link>
						<button type='submit' className='bin-form-submit-option button-css'>
							Add
						</button>
					</div>
				</Form>

			{loading && <Spinner />}
			{error && error}
		</section>
	);
}

export default FormToAddBin;
