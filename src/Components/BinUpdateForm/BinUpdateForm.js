import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function BinUpdateForm() {
	const { error, setError } = useContext(DataContext);
	const { id } = useParams();
	const navigate = useNavigate();
	const [bin, setBin] = useState([]);

	// =================================================================== GET BIN
	useEffect(() => {
		const getBin = async () => {
			setError('');
			try {
				const res = await axios.get(`http://localhost:8000/api/bins/${id}/`);
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
		getBin();
	}, []);

	// =================================================================== ADD BIN
	const updateBin = async (e) => {
		e.preventDefault();
		setError('');
		try {
			const binToUpdate = {
				title: e.target.title.value,
			};
			const res = await axios.put(`http://localhost:8000/api/bins/${id}/`, {
				...binToUpdate,
			});
			if (res.status === 200) {
				navigate('/bins');
			}
		} catch (error) {
			console.log("Bin wasn't added...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<>
			<Form onSubmit={updateBin}>
				<Form.Group className='mb-3'>
					<Form.Label>Title</Form.Label>
					<Form.Control id='title' defaultValue={bin.title} required />
				</Form.Group>
				<Link to='/bins'>Cancel</Link>
				<Button type='submit' variant='primary'>
					Update Bin
				</Button>
				{error && error}
			</Form>
		</>
	);
}

export default BinUpdateForm;
