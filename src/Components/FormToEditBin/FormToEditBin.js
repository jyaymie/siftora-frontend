import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function FormToEditBin() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [bin, setBin] = useState([]);

	// =================================================================== GET BIN
	const getBin = async () => {
		setError('');
		try {
			const res = await axios.get(
				`https://siftora.herokuapp.com/api/bins/${id}/`
			);
			if (res.status === 200) {
				setBin(res.data);
			}
		} catch (error) {
			console.log("Bin wasn't retrieved...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	useEffect(() => {
		getBin();
	}, []);

	// ================================================================ UPDATE BIN
	const updateBin = async (e) => {
		e.preventDefault();
		setError('');
		try {
			const binToUpdate = {
				id: id,
				title: e.target.title.value,
				products: bin.products,
			};
			console.log(binToUpdate);
			const res = await axios.put(
				`https://siftora.herokuapp.com/api/bins/${id}/`,
				binToUpdate
			);
			if (res.status === 200) {
				navigate('/bins');
			}
		} catch (error) {
			console.log("Bin wasn't updated...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<div>
			<Form onSubmit={updateBin}>
				<Form.Group className='mb-3'>
					<Form.Label>Title</Form.Label>
					<Form.Control
						id='title'
						defaultValue={bin.title}
						onClick={(e) => e.target.select()}
						required
					/>
				</Form.Group>
				<Link to='/bins'>Cancel</Link>
				<Button type='submit' variant='primary'>
					Submit
				</Button>
				{error && error}
			</Form>
		</div>
	);
}

export default FormToEditBin;
