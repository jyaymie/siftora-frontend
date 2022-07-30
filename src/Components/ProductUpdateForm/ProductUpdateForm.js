import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function ProductUpdateForm() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [product, setProduct] = useState([]);

	// =============================================================== GET PRODUCT
	const getProduct = async () => {
		setError('');
		try {
			const res = await axios.get(`http://localhost:8000/api/products/${id}/`);
			if (res.status === 200) {
				setProduct(res.data);
			}
		} catch (error) {
			console.log("Product wasn't retrieved...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	useEffect(() => {
		getProduct();
	});

	// =============================================================== ADD PRODUCT
	const updateProduct = async (e) => {
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
			const productToUpdate = {
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
			console.log(productToUpdate);
			const res = await axios.put(`http://localhost:8000/api/products/${id}/`, {
				...productToUpdate,
			});
			if (res.status === 200) {
				navigate('/products');
			}
		} catch (error) {
			console.log("Product wasn't added...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<>
			<Form onSubmit={updateProduct}>
				<Form.Group className='mb-3'>
					<Form.Label>Brand</Form.Label>
					<Form.Control id='brand' defaultValue={product.brand} required />
					<Form.Label>Name</Form.Label>
					<Form.Control id='name' defaultValue={product.name} required />
					<Form.Label>Shade</Form.Label>
					<Form.Control id='shade' defaultValue={product.shade} />
					<Form.Label>Finish</Form.Label>
					<Form.Control id='finish' defaultValue={product.finish} />
					<Form.Label>Purchase Date</Form.Label>
					<Form.Control
						type='date'
						id='purchase_date'
						defaultValue={product.purchase_date}
					/>
					<Form.Label>Price</Form.Label>
					<Form.Control id='price' defaultValue={product.price} />
					<Form.Label>Open Date</Form.Label>
					<Form.Control
						type='date'
						id='open_date'
						defaultValue={product.open_date}
					/>
					<Form.Label>Expiry Date</Form.Label>
					<Form.Control
						type='date'
						id='expiry_date'
						defaultValue={product.expiry_date}
					/>
					<Form.Label>Use Count</Form.Label>
					<Form.Control
						type='number'
						id='use_count'
						min='0'
						defaultValue={product.use_count}
					/>
					<Form.Label>Finish Date</Form.Label>
					<Form.Control
						type='date'
						id='finish_date'
						defaultValue={product.finish_date}
					/>
					<Form.Check
						type='checkbox'
						id='will_repurchase'
						label='Will Repurchase'
						defaultValue={product.will_repurchase}
					/>
					<Form.Label>Notes</Form.Label>
					<Form.Control id='notes' defaultValue={product.notes} />
				</Form.Group>
				<Link to='/products'>Cancel</Link>
				<Button type='submit' variant='primary'>
					Update Product
				</Button>
				{error && error}
			</Form>
		</>
	);
}

export default ProductUpdateForm;
