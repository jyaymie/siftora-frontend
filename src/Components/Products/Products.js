import './Products.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthFetch } from '../../utils/common';
import { BASE_API_URL } from '../../utils/enums';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';
import Spinner from '../Spinner/Spinner';

const DROPDOWN_OPTIONS = [
	{ id: 'brand', name: 'Brand', params: 'brand' },
	{ id: 'name', name: 'Product Name', params: 'name' },
	{ id: 'shade', name: 'Shade', params: 'shade' },
	{ id: 'purchase_date', name: 'Recently Purchased', params: 'purchase_date' },
	{ id: 'price', name: 'Price (Low to High)', params: 'price' },
	{ id: 'price_desc', name: 'Price (High to Low)', params: '-price' },
	{ id: 'open_date', name: 'Recently Opened', params: 'open_date' },
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

// The 'params' parameter will be an object of query parameters.
// Example: { sort: "use_count", order: "asc" }
function updateQueryParams(params) {
	const url = new URL(window.location.href);

	// Iterate through each property,
	for (const key in params) {
		if (params[key] !== undefined) {
			// and set each as a query parameter.
			// Example: '...products/?sort=use_count&order=asc'
			url.searchParams.set(key, params[key]);
		}
	}

	// Update the URL without reloading the page.
	window.history.pushState({}, '', url.toString());
}

function Products() {
	const [show, setShow] = useState(false);
	const [productToDelete, setProductToDelete] = useState({});

	// ============================================================== GET PRODUCTS
	const { data, loading, error, setUrl, deleteItem, updateItem } =
		useAuthFetch(`/products`);

	// ============================================================= SORT PRODUCTS
	const sortProducts = async (option) => {
		// When the url changes, useEffect is triggered in the useAuthFetch custom
		// hook.
		setUrl(`${BASE_API_URL}/products/?sort=${option.params}`);
		updateQueryParams({
			sort: `${option.params}`,
		});
	};

	// ========================================================== UPDATE USE COUNT
	const incrementUse = (product) => {
		product.use_count++;
		updateItem(product);
	};

	const decrementUse = (product) => {
		if (product.use_count > 0) {
			product.use_count--;
			updateItem(product);
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
		deleteItem(productToDelete);
	};

	// ======================================================================= JSX
	return (
		<section className='products'>
			<div className='products-container'>
				<h2>Products</h2>

				<div className='products-actions'>
					<Link to='/add-product' className='add-product-link button-css'>
						Add New Product ▸
					</Link>
					{/* ================================ DROPDOWN FOR SORTING PRODUCTS */}
					<DropdownButton title={`Sort Products By${' '}`}>
						{DROPDOWN_OPTIONS.map((option) => (
							<Dropdown.Item
								onClick={() => sortProducts(option)}
								key={option.id}>
								{option.name}
							</Dropdown.Item>
						))}
					</DropdownButton>
				</div>

				{/* ====================================================== ACCORDION */}
				{data.map((product) => (
					<Accordion key={product.id}>
						<Accordion.Item eventKey={`${product.id}`}>
							<Accordion.Header>
								<div className='accordion-header-content'>
									<p>
										<span className='bold'>{product.name}</span>
										{` by ${product.brand}`}
									</p>
									<img src={product.image} className='product-image-small' />
								</div>
							</Accordion.Header>
							<Accordion.Body className='product-detail'>
								<p>Shade: {product.shade}</p>
								<p>Purchase Date: {product.purchase_date}</p>
								<p>Price: ${product.price}</p>
								<p>Open Date: {product.open_date}</p>
								<p>Expiry Date: {product.expiry_date}</p>
								<p className='use-count-container'>
									# of Uses:{' '}
									<button
										type='button'
										className='decrement-button button-css'
										onClick={() => decrementUse(product)}>
										-
									</button>
									{product.use_count}
									<button
										type='button'
										className='increment-button button-css'
										onClick={() => incrementUse(product)}>
										+
									</button>
								</p>
								<p>Finish Date: {product.finish_date}</p>
								<p>Will Repurchase: {product.will_repurchase ? 'Yes' : 'No'}</p>
								<p>
									Image:{' '}
									<img src={product.image} className='product-image-large' />
								</p>
								<p>Notes: {product.notes}</p>
								{/* ==================================== EDIT & DELETE ICONS */}
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

				{/* ========================================================== MODAL */}
				<Modal show={show} onHide={closeModal}>
					<Modal.Header>
						<Modal.Title>Are you sure?</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Deleting{' '}
						<span className='modal-product-name'>{productToDelete.name}</span>{' '}
						cannot be undone.
					</Modal.Body>
					<Modal.Footer>
						<button
							type='button'
							className='modal-cancel-button button-css'
							onClick={closeModal}>
							CANCEL
						</button>
						<button
							type='button'
							className='modal-delete-button button-css'
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
