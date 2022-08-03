import './Bin.css';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
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

function Bin() {
	const { id } = useParams();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [bin, setBin] = useState({});
	const [binProducts, setBinProducts] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const [show, setShow] = useState(false);
	const [productToRemove, setProductToRemove] = useState({});

	// ========================================================== GET BIN PRODUCTS
	const getBinProducts = async () => {
		setError('');
		setLoading(true);
		try {
			// Use window.location.search to save the last used query parameters
			// This way, when a product's use count is updated,
			// the products will remain sorted by whatever option the user last chose
			const url = `http://localhost:8000/api/bins/${id}/${window.location.search}`;
			const res = await axios.get(url);
			if (res.status === 200) {
				setBin(res.data);
				setBinProducts(res.data.products);
				setLoading(false);
			}
		} catch (error) {
			console.log("Bin products weren't retrieved...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ===================================================== GET ALL USER PRODUCTS
	const getAllProducts = async () => {
		setError('');
		setLoading(true);
		try {
			const res = await axios.get(`http://localhost:8000/api/products/`);
			if (res.status === 200) {
				setAllProducts(res.data);
				setLoading(false);
			}
		} catch (error) {
			console.log("The user's products weren't retrieved...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ========================================= GET PRODUCTS IN THE DROPDOWN MENU
	const getDropdownProducts = () => {
		// In the 'Add Existing Product' dropdown menu,
		// list all products that are not already in the bin
		return allProducts.filter((product) => {
			return !binProducts.find((binProduct) => binProduct.id === product.id);
		});
	};

	// ========================================================= SORT BIN PRODUCTS
	const sortBinProducts = async (option) => {
		const sortName = option.id;
		setError('');
		setLoading(true);
		try {
			const res = await axios.get(
				`http://localhost:8000/api/bins/${id}/?sort=${option.params}`
			);
			if (res.status === 200) {
				updateQueryParams({
					sort: `${option.params}`,
				});
				setBin(res.data);
				setBinProducts(res.data.products);
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
				getBinProducts();
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
		setProductToRemove(product);
		setShow(true);
	};

	const closeModal = () => setShow(false);

	// =================================================== REMOVE PRODUCT FROM BIN
	const removeProduct = async () => {
		closeModal();
		setError('');
		setLoading(true);
		try {
			const filteredBinProducts = binProducts.filter(
				(product) => product !== productToRemove
			);
			setBinProducts(filteredBinProducts);
			const updatedBin = { title: bin.title, products: filteredBinProducts };
			const res = await axios.put(
				`http://localhost:8000/api/bins/${id}/`,
				updatedBin
			);
			if (res.status === 200) {
				setBin(updatedBin);
				setLoading(false);
			}
		} catch (error) {
			console.log("Product wasn't removed...", error);
			setLoading(false);

			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================== ADD PRODUCT TO BIN
	const addProductToBin = async (product) => {
		setError('');
		setLoading(true);
		try {
			binProducts.push(product);
			const res = await axios.put(`http://localhost:8000/api/bins/${id}/`, {
				id: bin.id,
				title: bin.title,
				products: binProducts,
			});
			if (res.status === 200) {
				getBinProducts();
				setLoading(false);
			}
		} catch (error) {
			console.log("Product wasn't added...", error);
			setLoading(false);

			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ================================================================= useEffect
	useEffect(() => {
		getBinProducts();
		getAllProducts();
	}, []);

	// ======================================================================= JSX
	return (
		<div>
			{!loading && (
				<>
					<Link to={`/bins/${bin.id}/add-product`} className='button-css'>
						Add New Product
					</Link>
					{/* ================================ DROPDOWN FOR SORTING PRODUCTS */}
					<DropdownButton title='Sort Products By'>
						{DROPDOWN_OPTIONS.map((option) => (
							<Dropdown.Item
								onClick={() => sortBinProducts(option)}
								key={option.id}>
								{option.name}
							</Dropdown.Item>
						))}
					</DropdownButton>

					{/* ======================== DROPDOWN FOR ADDING EXISTING PRODUCTS */}
					<DropdownButton
						id='dropdown-basic-button'
						title='Add Existing Product'>
						{getDropdownProducts().map((product) => (
							<Dropdown.Item
								key={product.id}
								onClick={() =>
									addProductToBin(product)
								}>{`${product.name} by ${product.brand}`}</Dropdown.Item>
						))}
					</DropdownButton>

					{/* =========================================  BIN PRODUCT DETAILS */}
					{binProducts.map((product) => (
						<Accordion key={product.id}>
							<Accordion.Item eventKey={'{product.id}'}>
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
										Remove from Bin
									</Button>
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
					))}
					<Modal show={show} onHide={closeModal}>
						<Modal.Header>
							<Modal.Title>Just so you know!</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{`Removing ${productToRemove.name} from this bin will not remove it from your products inventory. To delete this product, please go to `}
							<Link to='/products'>My Products</Link>.
						</Modal.Body>
						<Modal.Footer>
							<Button type='button' variant='secondary' onClick={closeModal}>
								Cancel
							</Button>
							<Button type='button' variant='primary' onClick={removeProduct}>
								Remove from Bin
							</Button>
						</Modal.Footer>
					</Modal>
				</>
			)}

			{loading && 'Loading...'}
			{error && error}
		</div>
	);
}

export default Bin;
