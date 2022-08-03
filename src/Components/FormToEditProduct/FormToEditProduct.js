import './FormToEditProduct.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Spinner from '../Spinner/Spinner';

function FormToEditProduct() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [product, setProduct] = useState([]);

	// =============================================================== GET PRODUCT
	const getProduct = async () => {
		setError('');
		setLoading(true);
		try {
			const res = await axios.get(`http://localhost:8000/api/products/${id}/`);
			if (res.status === 200) {
				setProduct(res.data);
				setLoading(false);
			}
		} catch (error) {
			console.log("Product wasn't retrieved...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ============================================================ UPDATE PRODUCT
	const updateProduct = async (e) => {
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
			const productToUpdate = {
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
			const res = await axios.put(
				`http://localhost:8000/api/products/${id}/`,
				productToUpdate
			);
			if (res.status === 200) {
				navigate(-1);
				setLoading(false);
			}
		} catch (error) {
			console.log("Product wasn't updated...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// =========================================== onChange FOR FORM INPUT CHANGES
	const onInputChange = (e, name) => {
		setProduct({ ...product, [name]: e.target.value });
	};

	// ================================================================= useEffect
	useEffect(() => {
		getProduct();
	}, []);

	// ======================================================================= JSX
	return (
		<section className='form-for-product-edit'>
			<Form onSubmit={updateProduct}>
				<h2>Edit Product</h2>
				<Form.Group className='mb-3'>
					<Form.Label htmlFor='brand'>Brand</Form.Label>
					<Form.Control id='brand' defaultValue={product.brand} required />
					<Form.Label htmlFor='name'>Name</Form.Label>
					<Form.Control id='name' defaultValue={product.name} required />
					<Form.Label htmlFor='shade'>Shade</Form.Label>
					<Form.Control id='shade' defaultValue={product.shade} />
					<Form.Label htmlFor='purchase_date'>Purchase Date</Form.Label>
					<Form.Control
						type='date'
						id='purchase_date'
						defaultValue={product.purchase_date}
					/>
					<Form.Label htmlFor='price'>Price</Form.Label>
					<Form.Control id='price' defaultValue={product.price} />
					<Form.Label htmlFor='open_date'>Open Date</Form.Label>
					<Form.Control
						type='date'
						id='open_date'
						defaultValue={product.open_date}
					/>
					<Form.Label htmlFor='expiry_date'>Expiry Date</Form.Label>
					<Form.Control
						type='date'
						id='expiry_date'
						defaultValue={product.expiry_date}
					/>
					<Form.Label htmlFor='use_count'>Use Count</Form.Label>
					<Form.Control
						type='number'
						id='use_count'
						min='0'
						defaultValue={product.use_count}
					/>
					<Form.Label htmlFor='finish_date'>Finish Date</Form.Label>
					<Form.Control
						type='date'
						id='finish_date'
						defaultValue={product.finish_date}
					/>
					<Form.Check
						type='checkbox'
						id='will_repurchase'
						label='Will Repurchase'
						checked={Boolean(product.will_repurchase)}
						onChange={(e) => onInputChange(e, 'will_repurchase')}
					/>
					<Form.Label htmlFor='image'>Image URL</Form.Label>
					<Form.Control id='image' defaultValue={product.image} />
					<Form.Label htmlFor='notes'>Notes</Form.Label>
					<Form.Control id='notes' defaultValue={product.notes} />
				</Form.Group>
				<div className='form-option-container'>
					<button
						type='button'
						className='form-cancel-option button-css'
						onClick={() => navigate(-1)}>
						CANCEL
					</button>
					<button type='submit' className='form-edit-option button-css'>
						SUBMIT
					</button>
				</div>
			</Form>

			{loading && <Spinner />}
			{error && error}
		</section>
	);
}

export default FormToEditProduct;
