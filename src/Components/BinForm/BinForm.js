import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function BinForm() {
	const { error, setError, bins, setBins } = useContext(DataContext);
	const navigate = useNavigate();

	// =================================================================== ADD BIN
	const addBin = async (e) => {
		e.preventDefault();
		setError('');
		try {
			const res = await axios.post('http://localhost:8000/api/bins/', {
				title: e.target.title.value,
			});
			if (res.status === 201) {
				let updatedBins = [...bins];
				updatedBins.push({ title: e.target.title.value });
				setBins(updatedBins);
			}
		} catch (error) {
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
			console.log("Bin wasn't add...", error);
		}
		navigate('/');
	};

	return (
		<>
			<Form onSubmit={addBin}>
				<Form.Group className='mb-3'>
					<Form.Label>Title</Form.Label>
					<Form.Control id='title' required />
				</Form.Group>
				<Link to='/'>Cancel</Link>
				<Button type='submit' variant='primary'>
					Add
				</Button>
			</Form>
			{error && error}
		</>
	);
}

export default BinForm;
