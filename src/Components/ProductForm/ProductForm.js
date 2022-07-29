import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function ProductForm() {
	const { error, setError, products, setProducts } = useContext(DataContext);
	const navigate = useNavigate();

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
			console.log(productToAdd);
			const res = await axios.post('http://localhost:8000/api/products/', {
				...productToAdd,
			});
			if (res.status === 201) {
				let updatedProducts = [...products];
				updatedProducts.push(productToAdd);
				setProducts(updatedProducts);
			}
		} catch (error) {
			console.log("Product wasn't added...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
		navigate('/products');
	};

	// ======================================================================= JSX
	return (
		<>
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
		</>
	);
}

export default ProductForm;
