import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';

const DROPDOWN_OPTIONS = [
	{ id: 'brand', name: 'Brand', params: 'brand' },
	{ id: 'name', name: 'Product Name', params: 'name' },
	{ id: 'purchase_date', name: 'Recently Purchased', params: 'purchase_date' },
	{ id: 'price', name: 'Price (Low to High)', params: 'price' },
	{ id: 'price_desc', name: 'Price (High to Low)', params: '-price' },
	{ id: 'open_date', name: 'Recent Opened', params: 'open_date' },
	{ id: 'expiry_date', name: 'Expiring Soon', params: 'expiry_date' },
	{ id: 'use_count', name: '# of Uses (Low to High)', params: 'use_count' },
	{
		id: 'use_count_desc',
		name: '# of Uses (High to Low)',
		params: '-use_count',
	},
];

// function getQueryParams() {
// 	const urlSearchParams = new URLSearchParams(window.location.search);
// 	const params = Object.fromEntries(urlSearchParams.entries());
// 	return params;
// }

// Params parameter will be an object of query parameters
// Ex. { sort: "use_count", order: "asc" }
function updateQueryParams(params) {
	const url = new URL(window.location.href);

	// Iterate through each property
	for (const key in params) {
		if (params[key] !== undefined) {
			// and set each as a query parameter
			// Ex. '...products/?sort=use_count&order=asc'
			url.searchParams.set(key, params[key]);
		}
	}

	// Update the URL without reloading the page
	window.history.pushState({}, '', url.toString());
}

function Products() {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState([]);
	const [show, setShow] = useState(false);
	const [productToDelete, setProductToDelete] = useState({});

	// ============================================================== GET PRODUCTS
	const getProducts = async () => {
		setError('');
		setLoading(true);
		try {
			// Use window.location.search to save the last used query parameters
			// This way, when a product's use count is updated,
			// the products will remain sorted by whatever option the user last chose
			const url = `http://localhost:8000/api/products/${window.location.search}`;
			const res = await axios.get(url);
			if (res.status === 200) {
				setProducts(res.data);
				setLoading(false);
			}
		} catch (error) {
			console.log("Products weren't retrieved...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	useEffect(() => {
		getProducts();
	}, []);

	// ============================================================= SORT PRODUCTS
	const sortProducts = async (option) => {
		const sortName = option.id;
		setError('');
		setLoading(true);
		try {
			const res = await axios.get(
				`http://localhost:8000/api/products/?sort=${option.params}`
			);
			if (res.status === 200) {
				updateQueryParams({
					sort: `${option.params}`,
				});
				setProducts(res.data);
				setLoading(false);
			}
		} catch (error) {
			console.log(`Products weren't sorted by ${sortName}...`, error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ========================================================== UPDATE USE COUNT
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
		setError('');
		setLoading(true);
		try {
			const res = await axios.put(
				`http://localhost:8000/api/products/${product.id}/`,
				product
			);
			if (res.status === 200) {
				getProducts();
				setLoading(false);
			}
		} catch (error) {
			console.log("Use count wasn't updated...", error);
			setLoading(false);
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
		setLoading(true);
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
				setLoading(false);
			}
		} catch (error) {
			console.log("Product wasn't deleted...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<section className='products'>
			<nav className='products-nav'>
				<Link to='/add-product' className='add-product-link button-css'>
					Add New Product
				</Link>
				<DropdownButton
					className='button-css'
					id='dropdown-basic-button'
					title='Sort Products By'>
					{DROPDOWN_OPTIONS.map((option) => (
						<Dropdown.Item onClick={() => sortProducts(option)} key={option.id}>
							{option.name}
						</Dropdown.Item>
					))}
				</DropdownButton>
			</nav>

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
									# of Uses: {product.use_count}
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
							<Link to={`/products/${product.id}/edit`}>Edit</Link>
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
		</section>
	);
}

export default Products;
