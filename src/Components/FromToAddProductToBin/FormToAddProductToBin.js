import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function FormToAddProductToBin() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [bin, setBin] = useState([]);

	// =================================================================== GET BIN
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

	useEffect(() => {
		getBin();
	}, []);

	// =============================================================== ADD PRODUCT
	const addProduct = async (e) => {
		e.preventDefault();
		setError('');
		if (!e.target.purchase_date.value) {
			e.target.purchase_date.value = '0001-01-01';
		}
		if (!e.target.open_date.value) {
			e.target.open_date.value = '0001-01-01';
		}
		if (!e.target.expiry_date.value) {
			e.target.expiry_date.value = '0001-01-01';
		}
		if (!e.target.finish_date.value) {
			e.target.finish_date.value = '0001-01-01';
		}
		try {
			const productToAdd = {
				bins: [{ id: id, title: bin.title }],
				brand: e.target.brand.value,
				name: e.target.name.value,
				shade: e.target.shade.value,
				finish: e.target.finish.value,
				purchase_date: e.target.purchase_date.value,
				price: e.target.price.value,
				open_date: e.target.open_date.value,
				expiry_date: e.target.expiry_date.value,
				use_count: e.target.use_count.value,
				finish_date: e.target.finish_date.value,
				will_repurchase: e.target.will_repurchase.value,
				notes: e.target.will_repurchase.value,
			};
			console.log('producttoadd', productToAdd);
			const res = await axios.post(
				'http://localhost:8000/api/products/',
				productToAdd
			);
			if (res.status === 201) {
				let updatedBin = bin;
				updatedBin.products.push(productToAdd);
				setBin(updatedBin);
			}
		} catch (error) {
			console.log("Product wasn't added...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
		// =========================================== UPDATE BIN WITH ADDED PRODUCT
		const updateBin = async () => {
			setError('');
			try {
				const res = await axios.put(
					`http://localhost:8000/api/bins/${id}/`,
					bin
				);
				if (res.status === 200) {
					navigate(`/bins/${id}`);
				}
			} catch (error) {
				console.log("Bin wasn't updated...", error);
				setError(
					'Hm, something went wrong. Please try again or contact support@siftora.com.'
				);
			}
		};
		updateBin();
	};

	// ======================================================================= JSX
	return (
		<div>
			<Form onSubmit={addProduct}>
				<Form.Group className='mb-3'>
					<Form.Label>Brand</Form.Label>
					<Form.Control id='brand' required />
					<Form.Label>Name</Form.Label>
					<Form.Control id='name' required />
					<Form.Label>Shade</Form.Label>
					<Form.Control id='shade' />
					<Form.Label>Finish</Form.Label>
					<Form.Control id='finish' />
					<Form.Label>Purchase Date</Form.Label>
					<Form.Control type='date' id='purchase_date' />
					<Form.Label>Price</Form.Label>
					<Form.Control id='price' />
					<Form.Label>Open Date</Form.Label>
					<Form.Control type='date' id='open_date' />
					<Form.Label>Expiry Date</Form.Label>
					<Form.Control type='date' id='expiry_date' />
					<Form.Label>Use Count</Form.Label>
					<Form.Control type='number' id='use_count' min='0' defaultValue='0' />
					<Form.Label>Finish Date</Form.Label>
					<Form.Control type='date' id='finish_date' />
					<Form.Check
						type='checkbox'
						id='will_repurchase'
						label='Will Repurchase'
					/>
					<Form.Label>Notes</Form.Label>
					<Form.Control id='notes' />
				</Form.Group>
				<Link to='/'>Cancel</Link>
				<Button type='submit' variant='primary'>
					Add Product
				</Button>
			</Form>
			{error && error}
		</div>
	);
}

export default FormToAddProductToBin;
