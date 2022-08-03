import './Products.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import Spinner from '../Spinner/Spinner';

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

	// ================================================================= useEffect
	useEffect(() => {
		getProducts();
	}, []);

	// ======================================================================= JSX
	return (
		<section className='products'>
			<div className='products-container'>
				<h2>All Products</h2>
				<nav className='products-actions'>
					<Link to='/add-product' className='product-add-link button-css'>
						Add New Product ▸
					</Link>

					{/* ============================== DROPDOWN FOR SORTING PRODUCTS */}
					<DropdownButton
						title={`Sort Products By${' '}`}
						className='dropdown-to-sort'
						id='dropdown-menu-align-end'>
						{DROPDOWN_OPTIONS.map((option) => (
							<Dropdown.Item
								onClick={() => sortProducts(option)}
								key={option.id}>
								{option.name}
							</Dropdown.Item>
						))}
					</DropdownButton>
				</nav>

				{/* =============================================  BIN PRODUCT DETAILS */}
				{products.map((product) => (
					<Accordion key={product.id}>
						<Accordion.Item eventKey={'${product.id}'}>
							<Accordion.Header>
								<div className='accordion-header-content'>
									{`${product.name} by ${product.brand}`}
									<img src={product.image} className='product-image-small' />
								</div>
							</Accordion.Header>
							<Accordion.Body className='product-details'>
								<p>Shade: {product.shade}</p>
								<p>Purchase Date: {product.purchase_date}</p>
								<p>Price: {product.price}</p>
								<p>Open Date: {product.open_date}</p>
								<p>Expiry Date: {product.expiry_date}</p>
								<p>
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
								</p>
								<p>Finish Date: {product.finish_date}</p>
								<p>Will Repurchase: {product.will_repurchase ? 'Yes' : 'No'}</p>
								<p>
									Image:{' '}
									<img src={product.notes} className='product-image-large' />
								</p>
								<p>Notes: {product.notes}</p>

								<div className='products-icon-container'>
									<Link
										to={`/products/${product.id}/edit`}
										className='edit-icon button-css'>
										<i className='icon-pencil'></i>
									</Link>
									<button
										type='button'
										className='delete-icon button-css'
										onClick={() => showModal(product)}>
										<i className='icon-trash'></i>
									</button>
								</div>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				))}

				<Modal show={show} onHide={closeModal}>
					<Modal.Header>
						<Modal.Title>Are you sure?</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Deleting{' '}
						<span className='product-name'>{productToDelete.name}</span> cannot
						be undone.
					</Modal.Body>
					<Modal.Footer>
						<button
							type='button'
							className='products-modal-cancel button-css'
							onClick={closeModal}>
							CANCEL
						</button>
						<button
							type='button'
							className='products-modal-delete button-css'
							onClick={deleteProduct}>
							DELETE PRODUCT
						</button>
					</Modal.Footer>
				</Modal>
			</div>

			{loading && <Spinner />}
			{error && error}
		</section>
	);
}

export default Products;
