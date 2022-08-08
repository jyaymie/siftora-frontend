import './Bin.css';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthFetch } from '../../utils/common';
import { BASE_API_URL } from '../../utils/enums';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Accordion from 'react-bootstrap/Accordion';
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

function Bin() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [productToRemove, setProductToRemove] = useState({});

	// ========================================================== GET BIN PRODUCTS
	const {
		// In the useAuthFetch hook, data's default value is an array. Change it to
		// an object.
		data = {},
		loading,
		error,
		setUrl,
		updateItem,
	} = useAuthFetch(
		// Use window.location.search to save the last used query parameters. This
		// way, when a product's use count is updated, the products will remain
		// sorted by whatever option the user last chose.
		`/bins/${id}${window.location.search ? window.location.search : ''}`
	);

	// ===================================================== GET ALL USER PRODUCTS
	// For this component, rename the variables to products-specific variables.
	const {
		data: products,
		loading: productsLoading,
		error: productsError,
	} = useAuthFetch(`/products`);

	// ========================================= GET PRODUCTS IN THE DROPDOWN MENU
	const getDropdownProducts = () => {
		// In the 'Add Existing Product' dropdown menu, list all products that are
		// not already in the bin.
		return products.filter((product) => {
			return !data.products.find((binProduct) => binProduct.id === product.id);
		});
	};

	// ========================================================= SORT BIN PRODUCTS
	const sortBinProducts = async (option) => {
		// When the url changes, useEffect is triggered in the useAuthFetch custom
		// hook.
		setUrl(`${BASE_API_URL}/bins/${id}/?sort=${option.params}`);
		updateQueryParams({
			sort: `${option.params}`,
		});
	};

	// ========================================================== UPDATE USE COUNT
	const incrementUse = (product) => {
		product.use_count++;
		updateItem(product, `${BASE_API_URL}/products`);
	};

	const decrementUse = (product) => {
		if (product.use_count > 0) {
			product.use_count--;
			updateItem(product, `${BASE_API_URL}/products`);
		}
	};

	// ========================================================== SHOW/CLOSE MODAL
	const showModal = (product) => {
		setProductToRemove(product);
		setShow(true);
	};

	const closeModal = () => setShow(false);

	// =================================================== REMOVE PRODUCT FROM BIN
	const removeProduct = async () => {
		closeModal();
		const filteredBinProducts = data.products.filter(
			(product) => product !== productToRemove
		);
		const updatedBin = {
			id: data.id,
			title: data.title,
			products: filteredBinProducts,
		};
		updateItem(updatedBin, `${BASE_API_URL}/bins`);
	};

	// ======================================================== ADD PRODUCT TO BIN
	const addProductToBin = async (product) => {
		data.products.push(product);
		updateItem(data, `${BASE_API_URL}/bins`);
	};

	// ======================================================================= JSX
	return (
		<section className='bin'>
			<div className='bin-container'>
				<h2>{data.title}</h2>
				<div className='bin-actions'>
					<div className='bin-add-options'>
						{/* ============================= DROPDOWN FOR ADDING PRODUCTS */}
						<DropdownButton
							title={`Add Product${' '}`}
							className='dropdown-to-add'>
							<Dropdown.Item
								onClick={() =>
									navigate(`/
									bins/${data.id}/add-product`)
								}>
								✨ ADD NEW PRODUCT ✨
							</Dropdown.Item>
							{getDropdownProducts().map((product) => (
								<Dropdown.Item
									key={product.id}
									onClick={() =>
										addProductToBin(product)
									}>{`${product.name} by ${product.brand}`}</Dropdown.Item>
							))}
						</DropdownButton>
					</div>

					{/* ============================== DROPDOWN FOR SORTING PRODUCTS */}
					<DropdownButton
						title={`Sort Products By${' '}`}
						className='dropdown-to-sort'
						id='dropdown-menu-align-end'>
						{DROPDOWN_OPTIONS.map((option) => (
							<Dropdown.Item
								onClick={() => sortBinProducts(option)}
								key={option.id}>
								{option.name}
							</Dropdown.Item>
						))}
					</DropdownButton>
				</div>

				{/* =========================================  BIN PRODUCT DETAILS */}
				{data.products &&
					data.products.map((product) => (
						<Accordion key={product.id}>
							<Accordion.Item eventKey={'${product.id}'}>
								<Accordion.Header>
									<div className='accordion-header-content'>
										<p>{`${product.name} by ${product.brand}`}</p>
										<img src={product.image} className='product-image-small' />
									</div>
								</Accordion.Header>
								<Accordion.Body className='product-details'>
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
									<p>
										Will Repurchase: {product.will_repurchase ? 'Yes' : 'No'}
									</p>
									<p>
										Image:{' '}
										<img src={product.image} className='product-image-large' />
									</p>
									<p>Notes: {product.notes}</p>
									<div className='bin-icon-container'>
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
						<Modal.Title>Just so you know...</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Removing{' '}
						<span className='modal-product-name'>{productToRemove.name}</span>{' '}
						from this bin will not delete it from your products inventory. To
						completely part ways with this product, please go to{' '}
						<Link to='/products' className='modal-link'>
							Products
						</Link>
						.
					</Modal.Body>
					<Modal.Footer>
						<button
							type='button'
							className='modal-cancel button-css'
							onClick={closeModal}>
							CANCEL
						</button>
						<button
							type='button'
							className='modal-remove button-css'
							onClick={removeProduct}>
							REMOVE FROM BIN
						</button>
					</Modal.Footer>
				</Modal>
			</div>

			{data.products && !data.products.length ? (
				<p className='bin-empty-message'>
					This bin is empty. Please add a product.
				</p>
			) : null}

			{loading || productsLoading ? <Spinner /> : null}
			{error || productsError ? error : null}
		</section>
	);
}

export default Bin;
