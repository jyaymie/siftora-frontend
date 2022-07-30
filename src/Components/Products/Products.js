import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';

function Products() {
	const { error, setError, products, setProducts } = useContext(DataContext);
	const [show, setShow] = useState(false); // For showing/closing a modal
	const [productToDelete, setProductToDelete] = useState({});

	// ========================================================= RETRIEVE PRODUCTS
	const getProducts = async () => {
		setError('');
		try {
			const res = await axios.get('http://localhost:8000/api/products/');
			if (res.status === 200) {
				setProducts(res.data);
			}
		} catch (error) {
			console.log("Products weren't retrieved...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// Display all products on initial page load
	useEffect(() => {
		getProducts();
	}, []);

	// ============================================= INCREMENT/DECREMENT USE COUNT
	const incrementUse = (product) => {
		product.use_count++;
		updateCount(product);
	};

	const decrementUse = (product) => {
		if (product.use_count > 0) {
			product.use_count--;
			updateCount(product);
		}
	};

	const updateCount = async (product) => {
		console.log(product);
		console.log(product.id);
		setError('');
		try {
			const res = await axios.put(
				`http://localhost:8000/api/products/${product.id}/`,
				product
			);
			if (res.status === 200) {
				getProducts();
			}
		} catch (error) {
			console.log("Use count wasn't udpated...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ========================================================== SHOW/CLOSE MODAL
	const showModal = (product) => {
		setProductToDelete(product);
		setShow(true);
	};

	const closeModal = () => setShow(false);

	// ============================================================ DELETE PRODUCT
	const deleteProduct = async () => {
		closeModal();
		setError('');
		const id = productToDelete.id;
		try {
			const res = await axios.delete(
				`http://localhost:8000/api/products/${id}/`
			);
			if (res.status === 204) {
				const filteredProducts = products.filter(
					(product) => product !== productToDelete
				);
				setProducts(filteredProducts);
				getProducts();
			}
		} catch (error) {
			console.log("Product wasn't deleted...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<>
			<Link to='/product-form'>Add Product</Link>

			{products.map((product) => (
				<Accordion key={product.id}>
					<Accordion.Item eventKey='0'>
						<Accordion.Header>
							{`${product.name} by ${product.brand}`}
						</Accordion.Header>
						<Accordion.Body>
							<ul>
								<li>Shade: {product.shade}</li>
								<li>Finish: {product.finish}</li>
								<li>Purchase Date: {product.purchase_date}</li>
								<li>Price: {product.price}</li>
								<li>Open Date: {product.open_date}</li>
								<li>Expiry Date: {product.expiry_date}</li>
								<li>
									# of Uses: {product.use_count}{' '}
									<Button
										type='button'
										variant='secondary'
										onClick={() => decrementUse(product)}>
										-
									</Button>
									<Button
										type='button'
										variant='secondary'
										onClick={() => incrementUse(product)}>
										+
									</Button>
								</li>
								<li>Finish Date: {product.finish_date}</li>
								<li>Will Repurchase: {product.will_repurchase}</li>
								<li>Notes: {product.notes}</li>
							</ul>
							<Link to={`/product-update-form/${product.id}`}>Edit</Link>
							<Button
								type='button'
								variant='secondary'
								onClick={() => showModal(product)}>
								Delete
							</Button>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			))}

			<Modal show={show} onHide={closeModal}>
				<Modal.Header>
					<Modal.Title>Are you sure?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{`Deleting ${productToDelete.name} cannot be undone.`}
				</Modal.Body>
				<Modal.Footer>
					<Button type='button' variant='secondary' onClick={closeModal}>
						Cancel
					</Button>
					<Button type='button' variant='primary' onClick={deleteProduct}>
						Delete Product
					</Button>
				</Modal.Footer>
			</Modal>

			{error && error}
		</>
	);
}

export default Products;
