import './Products.css';
import { useState } from 'react';
import { useAuthFetch } from '../../utils/common';
import { BASE_API_URL, MODAL_TYPE } from '../../utils/enums';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
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
	const [show, setShow] = useState({
		modalForAdding: false,
		modalForDeleting: false,
		modalForUpdating: false,
	});
	const [productToDelete, setProductToDelete] = useState({});
	const [productToUpdate, setProductToUpdate] = useState({});

	// ============================================================== GET PRODUCTS
	const { data, loading, error, setUrl, addItem, deleteItem, updateItem } =
		useAuthFetch(
			// Use window.location.search to save the last used query parameters. This
			// way, when a product's use count is updated, the products will remain
			// sorted by whatever option the user last chose.
			`/products${window.location.search ? window.location.search : ''}`
		);

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
	const showModal = (product, type) => {
		switch (type) {
			case MODAL_TYPE.ADD:
				setShow({
					...show,
					modalForAdding: true,
				});
				break;
			case MODAL_TYPE.UPDATE:
				setProductToUpdate(product);
				setShow({
					...show,
					modalForUpdating: true,
				});
				break;
			case MODAL_TYPE.DELETE:
				setProductToDelete(product);
				setShow({
					...show,
					modalForDeleting: true,
				});
				break;
			default:
				break;
		}
	};

	const closeModal = () =>
		setShow({
			modalForAdding: false,
			modalForDeleting: false,
			modalForUpdating: false,
		});

	// =============================================================== ADD PRODUCT
	const addProduct = async (e) => {
		e.preventDefault();

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

		closeModal();
		addItem(productToAdd);
	};

	// ============================================================ DELETE PRODUCT
	const deleteProduct = async () => {
		closeModal();
		deleteItem(productToDelete);
	};

	// ============================================================ UPDATE PRODUCT
	const updateProduct = async (e) => {
		e.preventDefault();

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

		const data = {
			id: productToUpdate.id,
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

		closeModal();
		updateItem(data, `${BASE_API_URL}/products`);
	};

	// =========================================== onChange FOR FORM INPUT CHANGES
	const onInputChange = (e, name) => {
		setProductToUpdate({ ...productToUpdate, [name]: e.target.checked });
	};

	// ======================================================================= JSX
	return (
		<section className='products'>
			<div className='products-container'>
				<h2>Products</h2>

				<div className='products-actions'>
					<button
						className='add-product-button button-css'
						onClick={() => showModal({}, MODAL_TYPE.ADD)}>
						Add New Product ▸
					</button>
					{/* ================================ DROPDOWN FOR SORTING PRODUCTS */}
					<DropdownButton title='Sort Products By' className='dropdown-button'>
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
									<p className='use-count-button-container'>
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
									{/* ================================== UPDATE & DELETE ICONS */}
									<div className='product-icon-container'>
										<button
											className='update-icon button-css'
											onClick={() => showModal(product, MODAL_TYPE.UPDATE)}>
											<i className='icon-pencil'></i>
										</button>
										<button
											type='button'
											className='delete-icon button-css'
											onClick={() => showModal(product, MODAL_TYPE.DELETE)}>
											<i className='icon-trash'></i>
										</button>
									</div>
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
					))}

				{/* ======================================= MODAL FOR ADDING PRODUCT */}
				<Modal show={show.modalForAdding} onHide={closeModal} centered>
					<Modal.Body>
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
							<div className='form-option-container'>
								<button
									className='form-cancel-option button-css'
									onClick={closeModal}>
									CANCEL
								</button>
								<button type='submit' className='form-add-option button-css'>
									ADD PRODUCT
								</button>
							</div>
						</Form>
					</Modal.Body>
				</Modal>

				{/* ===================================== MODAL FOR DELETING PRODUCT */}
				<Modal show={show.modalForDeleting} onHide={closeModal} centered>
					<Modal.Header>
						<Modal.Title className='bold'>Are you sure?</Modal.Title>
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

			{/* ======================================= MODAL FOR UPDATING PRODUCT */}
			<Modal show={show.modalForUpdating} onHide={closeModal} centered>
				<Modal.Body>
					<h2>Update Product</h2>
					<Form onSubmit={updateProduct}>
						<Form.Group>
							<Form.Label htmlFor='brand'>Brand</Form.Label>
							<Form.Control
								id='brand'
								defaultValue={productToUpdate.brand}
								required
							/>
							<Form.Label htmlFor='name'>Name</Form.Label>
							<Form.Control
								id='name'
								defaultValue={productToUpdate.name}
								required
							/>
							<Form.Label htmlFor='shade'>Shade</Form.Label>
							<Form.Control id='shade' defaultValue={productToUpdate.shade} />
							<Form.Label htmlFor='purchase_date'>Purchase Date</Form.Label>
							<Form.Control
								type='date'
								id='purchase_date'
								defaultValue={productToUpdate.purchase_date}
							/>
							<Form.Label htmlFor='price'>Price</Form.Label>
							<Form.Control id='price' defaultValue={productToUpdate.price} />
							<Form.Label htmlFor='open_date'>Open Date</Form.Label>
							<Form.Control
								type='date'
								id='open_date'
								defaultValue={productToUpdate.open_date}
							/>
							<Form.Label htmlFor='expiry_date'>Expiry Date</Form.Label>
							<Form.Control
								type='date'
								id='expiry_date'
								defaultValue={productToUpdate.expiry_date}
							/>
							<Form.Label htmlFor='use_count'># of Uses</Form.Label>
							<Form.Control
								type='number'
								id='use_count'
								min='0'
								defaultValue={productToUpdate.use_count}
							/>
							<Form.Label htmlFor='finish_date'>Finish Date</Form.Label>
							<Form.Control
								type='date'
								id='finish_date'
								defaultValue={productToUpdate.finish_date}
							/>
							<Form.Check
								type='checkbox'
								id='will_repurchase'
								label='Will Repurchase'
								checked={Boolean(productToUpdate.will_repurchase)}
								onChange={(e) => onInputChange(e, 'will_repurchase')}
							/>
							<Form.Label htmlFor='image'>Image URL</Form.Label>
							<Form.Control id='image' defaultValue={productToUpdate.image} />
							<Form.Label htmlFor='notes'>Notes</Form.Label>
							<Form.Control id='notes' defaultValue={productToUpdate.notes} />
						</Form.Group>
						<div className='modal-button-container'>
							<button
								type='button'
								className='modal-cancel-button button-css'
								onClick={closeModal}>
								CANCEL
							</button>
							<button type='submit' className='modal-submit-button button-css'>
								UPDATE PRODUCT
							</button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>

			{!loading && !data.length && (
				<p className='empty-message'>
					There's nothing here...yet. Please add a product.
				</p>
			)}

			{loading && <Spinner />}
			{error && error}
		</section>
	);
}

export default Products;
