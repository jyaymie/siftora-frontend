import './Bin.css';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuthFetch } from '../../utils/common';
import { BASE_API_URL, MODAL_TYPE } from '../../utils/enums';
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
	const [show, setShow] = useState({
		modalForAdding: false,
		modalForRemoving: false,
		modalForUpdating: false,
	});
	const [productToRemove, setProductToRemove] = useState({});
	const [productToUpdate, setProductToUpdate] = useState({});

	// ========================================================== GET BIN PRODUCTS
	const {
		// In the useAuthFetch hook, data's default value is an array, so it is
		// changed to an object here.
		data = {},
		loading,
		error,
		setUrl,
		addItem,
		updateItem,
	} = useAuthFetch(
		// Use window.location.search to save the last used query parameters. This
		// way, when a product's use count is updated, the products will remain
		// sorted by whatever option the user last chose.
		`/bins/${id}${window.location.search ? window.location.search : ''}`
	);

	// ===================================================== GET ALL USER PRODUCTS
	// Rename these variables to products-specific variables.
	const {
		data: products,
		error: productsError,
		loading: productsLoading,
	} = useAuthFetch(`/products`);

	// ===================================================== GET DROPDOWN PRODUCTS
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

	// ==================================================== ADD NEW PRODUCT TO BIN
	const addNewProduct = async (e) => {
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

		const res = await addItem(productToAdd, `${BASE_API_URL}/products`);
		data.products.push(res.data);
		updateItem(data, `${BASE_API_URL}/bins`);
		closeModal();
	};

	// =============================================== ADD EXISTING PRODUCT TO BIN
	const addExistingProduct = async (e, product) => {
		e.preventDefault();
		data.products.push(product);
		updateItem(data, `${BASE_API_URL}/bins`);
		closeModal();
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
	const showModal = (e, product, type) => {
		e.preventDefault();
		switch (type) {
			case MODAL_TYPE.ADD:
				setShow({
					...show,
					modalForAdding: true,
				});
				break;
			case MODAL_TYPE.REMOVE:
				setProductToRemove(product);
				setShow({
					...show,
					modalForRemoving: true,
				});
				break;
			case MODAL_TYPE.UPDATE:
				setProductToUpdate(product);
				setShow({
					...show,
					modalForUpdating: true,
				});
				break;
			default:
				break;
		}
	};

	const closeModal = () =>
		setShow({
			modalForAdding: false,
			modalForRemoving: false,
			modalForUpdating: false,
		});

	// =================================================== REMOVE PRODUCT FROM BIN
	const removeProduct = async () => {
		const filteredBinProducts = data.products.filter(
			(product) => product !== productToRemove
		);
		const updatedBin = {
			id: data.id,
			title: data.title,
			products: filteredBinProducts,
		};
		updateItem(updatedBin, `${BASE_API_URL}/bins`);
		closeModal();
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

		const res = await updateItem(data, `${BASE_API_URL}/products`);
		closeModal();
	};

	// =========================================== onChange FOR FORM INPUT CHANGES
	const onInputChange = (e, name) => {
		setProductToUpdate({ ...productToUpdate, [name]: e.target.checked });
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
						<Dropdown.Item onClick={(e) => showModal(e, {}, MODAL_TYPE.ADD)}>
							✨ ADD NEW PRODUCT ✨
						</Dropdown.Item>
						{getDropdownProducts().map((product) => (
							<Dropdown.Item
								key={product.id}
								onClick={(e) =>
									addExistingProduct(e, product)
								}>{`${product.name} by ${product.brand}`}</Dropdown.Item>
						))}
					</DropdownButton>

					{/* ================================ DROPDOWN FOR SORTING PRODUCTS */}
					<DropdownButton
						title={`Sort Products By${' '}`}
						className='dropdown-button'>
						{DROPDOWN_OPTIONS.map((option) => (
							<Dropdown.Item
								key={option.id}
								onClick={() => sortBinProducts(option)}>
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
									{/* ================================ UPDATE & REMOVE ICONS */}
									<div className='product-icon-container'>
										<button
											className='update-icon button-css'
											onClick={(e) => showModal(e, product, MODAL_TYPE.UPDATE)}>
											<i className='icon-pencil'></i>
										</button>
										<button
											type='button'
											className='remove-icon button-css'
											onClick={(e) => showModal(e, product, MODAL_TYPE.REMOVE)}>
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
						<Form onSubmit={(e) => addNewProduct(e)}>
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
									onClick={closeModal}>
									CANCEL
								</button>
								<button
									type='submit'
									className='modal-submit-button button-css'>
									ADD PRODUCT
								</button>
							</div>
						</Form>
					</Modal.Body>
				</Modal>

				{/* ===================================== MODAL FOR REMOVING PRODUCT */}
				<Modal show={show.modalForRemoving} onHide={closeModal} centered>
					<Modal.Header>
						<Modal.Title className='bold'>Just so you know...</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Removing{' '}
						<span className='modal-product-name'>{productToRemove.name}</span>{' '}
						from this bin will not delete it from your products inventory. To
						completely part ways with this product, please go to{' '}
						<Link to='/products' className='underlined-link'>
							Products
						</Link>
						.
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
							className='modal-remove-button button-css'
							onClick={removeProduct}>
							REMOVE FROM BIN
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

			{data.products && !data.products.length && (
				<p className='empty-message'>
					This bin is empty. Please add a product.
				</p>
			)}

			{loading || productsLoading ? <Spinner /> : null}
			{error || productsError ? error : null}
		</section>
	);
}

export default Bin;
