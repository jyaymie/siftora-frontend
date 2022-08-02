import './FormToEditBin.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function FormToEditBin() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [bin, setBin] = useState([]);

	// =================================================================== GET BIN
	const getBin = async () => {
		setError('');
		setLoading(true);
		try {
			const res = await axios.get(`http://localhost:8000/api/bins/${id}/`);
			if (res.status === 200) {
				setBin(res.data);
				setLoading(false);
			}
		} catch (error) {
			console.log("Bin wasn't retrieved...", error);
			setLoading(false);
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
		setLoading(true);
		try {
			const binToUpdate = {
				id: id,
				title: e.target.title.value,
				products: bin.products,
			};
			const res = await axios.put(
				`http://localhost:8000/api/bins/${id}/`,
				binToUpdate
			);
			if (res.status === 200) {
				navigate(-1);
				setLoading(false);
			}
		} catch (error) {
			console.log("Bin wasn't updated...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<section>
			<Form onSubmit={updateBin}>
				<Form.Group className='mb-3'>
					<Form.Label>BIN TITLE</Form.Label>
					<Form.Control
						id='title'
						defaultValue={bin.title}
						onClick={(e) => e.target.select()}
						required
					/>
				</Form.Group>
				<div className='form-options'>
					<Link to='/bins' className='button-css cancel'>CANCEL</Link>
					<button type='submit' className='button-css submit'>
						SUBMIT
					</button>
				</div>

				{loading && 'Loading...'}
				{error && error}
			</Form>
		</section>
	);
}

export default FormToEditBin;
