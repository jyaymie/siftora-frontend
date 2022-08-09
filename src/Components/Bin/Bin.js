import './Bin.css';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthFetch } from '../../utils/common';
import { BASE_API_URL } from '../../utils/enums';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
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
	const [show, setShow] = useState({
		modalForAdding: false,
		modalForRemoving: false,
	});
	const [productToRemove, setProductToRemove] = useState({});
	const [productToAdd, setProductToAdd] = useState({});

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
		if (!data.products) {
			return [];
		}
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
	const showModal = (e, name, product) => {
		// e.preventDefault();
		product && setProductToRemove(product);
		const data = { ...show, [name]: true };
		setShow(data);
	};

	const closeModal = (name) => {
		const data = { ...show, [name]: false };
		setShow(data);
	};

	// =================================================== REMOVE PRODUCT FROM BIN
	const removeProduct = async (name) => {
		closeModal(name);
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
	const addProduct = async (e, name, product) => {
		if (name) {
			setProductToAdd({
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
			});
			closeModal(name);
		}

		data.products.push(product ? product : productToAdd);
		updateItem(data, `${BASE_API_URL}/bins/`);
	};

	// ======================================================================= JSX
	return (
		<section className='bin'>
			<div className='bin-container'>
				<h2>{data.title}</h2>

				<div className='bin-actions'>
					{/* ================================= DROPDOWN FOR ADDING PRODUCTS */}
					<DropdownButton
						title={`Add Product${' '}`}
						className='dropdown-button'>
						<Dropdown.Item onClick={(e) => showModal(e, 'modalForAdding')}>
							✨ ADD NEW PRODUCT ✨
						</Dropdown.Item>
						{getDropdownProducts().map((product) => (
							<Dropdown.Item
								key={product.id}
								onClick={(e) =>
									addProduct(e, '', product)
								}>{`${product.name} by ${product.brand}`}</Dropdown.Item>
						))}
					</DropdownButton>

					{/* ================================ DROPDOWN FOR SORTING PRODUCTS */}
					<DropdownButton
						title={`Sort Products By${' '}`}
						className='dropdown-button'
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

				{/* ============================================= BIN PRODUCT DETAIL */}
				{data.products &&
					data.products.map((product) => (
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
									<p>
										Will Repurchase: {product.will_repurchase ? 'Yes' : 'No'}
									</p>
									<p>
										Image:{' '}
										<img src={product.image} className='product-image-large' />
									</p>
									<p>Notes: {product.notes}</p>
									{/* ================================== EDIT & DELETE ICONS */}
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

				{/* =================================== MODAL FOR REMOVING A PRODUCT */}
				<Modal
					show={show.modalForRemoving}
					onHide={() => {
						closeModal('modalForRemoving');
					}}>
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
							className='modal-cancel-button button-css'
							onClick={() => closeModal('modalForRemoving')}>
							CANCEL
						</button>
						<button
							type='button'
							className='modal-remove-button button-css'
							onClick={() => removeProduct('modalForRemoving')}>
							REMOVE FROM BIN
						</button>
					</Modal.Footer>
				</Modal>
			</div>

			{/* ========================================MODAL FOR ADDING A PRODUCT */}
			<Modal
				show={show.modalForAdding}
				onHide={() => closeModal('modalForAdding')}>
				<Modal.Body>
					<h2>New Product</h2>
					<Form>
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
							<Form.Control
								type='number'
								id='use_count'
								min='0'
								defaultValue='0'
							/>
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
						<div className='modal-button-container'>
							<button
								type='button'
								className='modal-cancel-button button-css'
								onClick={() => {
									closeModal('modalForAdding');
								}}>
								CANCEL
							</button>
							<button
								type='button'
								className='modal-submit-button button-css'
								onClick={(e) => {
									addProduct(e, 'modalForAdding');
								}}>
								ADD PRODUCT
							</button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>

			{data.products && !data.products.length && (
				<p className='bin-empty-message'>
					This bin is empty. Please add a product.
				</p>
			)}

			{loading || productsLoading ? <Spinner /> : null}
			{error || productsError ? error : null}
		</section>
	);
}

export default Bin;
