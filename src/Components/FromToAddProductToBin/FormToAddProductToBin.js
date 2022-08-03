import './FormToAddProductToBin.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Spinner from '../Spinner/Spinner';

function FormToAddProductToBin() {
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
			const res = await axios.get(
				`https://siftora.herokuapp.com/api/bins/${id}/`
			);
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

	// =============================================================== ADD PRODUCT
	const addProduct = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

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
				brand: e.target.brand.value,
				name: e.target.name.value,
				shade: e.target.shade.value,
				purchase_date: e.target.purchase_date.value,
				price: e.target.price.value,
				open_date: e.target.open_date.value,
				expiry_date: e.target.expiry_date.value,
				use_count: e.target.use_count.value,
				finish_date: e.target.finish_date.value,
				will_repurchase: e.target.will_repurchase.checked,
				image: e.target.image.value,
				notes: e.target.notes.value,
			};
			const res = await axios.post(
				'https://siftora.herokuapp.com/api/products/',
				productToAdd
			);
			if (res.status === 201) {
				let updatedBin = bin;
				updatedBin.products.push(res.data);
				setBin(updatedBin);
				setLoading(false);
			}
		} catch (error) {
			console.log("Product wasn't added...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}

		// =========================================== UPDATE BIN WITH ADDED PRODUCT
		const updateBin = async () => {
			setError('');
			setLoading(true);
			try {
				const res = await axios.put(
					`https://siftora.herokuapp.com/api/bins/${id}/`,
					{
						id: id,
						title: bin.title,
						products: bin.products,
					}
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
		updateBin();
	};

	// ================================================================= useEffect
	useEffect(() => {
		getBin();
	}, []);

	// ======================================================================= JSX
	return (
		<section className='form-to-add-product-to-bin'>
			<h2>New Product</h2>
			<Form onSubmit={addProduct}>
				<Form.Group>
					<Form.Label htmlFor='brand'>Brand*</Form.Label>
					<Form.Control id='brand' required />
					<Form.Label htmlFor='name'>Name*</Form.Label>
					<Form.Control id='name' required />
					<Form.Label htmlFor='shade'>Shade</Form.Label>
					<Form.Control id='shade' />
					<Form.Label htmlFor='purchase_date'>Purchase Date</Form.Label>
					<Form.Control type='date' id='purchase_date' />
					<Form.Label htmlFor='price'>Price</Form.Label>
					<Form.Control id='price' />
					<Form.Label htmlFor='open_date'>Open Date</Form.Label>
					<Form.Control type='date' id='open_date' />
					<Form.Label htmlFor='expiry_date'>Expiry Date</Form.Label>
					<Form.Control type='date' id='expiry_date' />
					<Form.Label htmlFor='use_count'># of Uses</Form.Label>
					<Form.Control type='number' id='use_count' min='0' defaultValue='0' />
					<Form.Label htmlFor='finish_date'>Finish Date</Form.Label>
					<Form.Control type='date' id='finish_date' />
					<Form.Check
						type='checkbox'
						id='will_repurchase'
						label='Will Repurchase'
					/>
					<Form.Label htmlFor='image'>Image URL</Form.Label>
					<Form.Control id='image' />
					<Form.Label htmlFor='notes'>Notes</Form.Label>
					<Form.Control as='textarea' rows={3} id='notes' />
				</Form.Group>
				<div className='form-option-container'>
					<button
						className='form-cancel-option button-css'
						onClick={() => navigate(-1)}>
						CANCEL
					</button>
					<button type='submit' className='form-add-option button-css'>
						ADD PRODUCT
					</button>
				</div>
			</Form>

			{loading && <Spinner />}
			{error && error}
		</section>
	);
}

export default FormToAddProductToBin;
