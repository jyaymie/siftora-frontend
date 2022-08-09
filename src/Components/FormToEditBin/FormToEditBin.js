import './FormToEditBin.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BASE_API_URL } from '../../utils/enums';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Spinner from '../Spinner/Spinner';



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
			const res = await axios.get(`${BASE_API_URL}/bins/${id}/`);
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
			const res = await axios.put(`${BASE_API_URL}/bins/${id}/`, binToUpdate);
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

	// ================================================================= useEffect
	useEffect(() => {
		getBin();
	}, []);

	// ======================================================================= JSX
	return (
		<section className='form-to-edit-bin'>
			{!loading && (
				<div className='form-to-edit-bin-container'>
					<h2>Edit Bin </h2>
					<Form onSubmit={updateBin}>
						<Form.Group className='mb-3'>
							<Form.Label>BIN TITLE</Form.Label>
							<Form.Control id='title' defaultValue={bin.title} required />
						</Form.Group>
						<div className='form-option-container'>
							<Link to='/bins' className='bin-form-cancel-option button-css'>
								CANCEL
							</Link>
							<button
								type='submit'
								className='bin-form-submit-option button-css'>
								SUBMIT
							</button>
						</div>
					</Form>
				</div>
			)}

			{loading && <Spinner />}
			{error && error}
		</section>
	);
}

export default FormToEditBin;
