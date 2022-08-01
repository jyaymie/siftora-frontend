import './Bin.css';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Bin() {
	const { id } = useParams();
	const [error, setError] = useState('');
	const [bin, setBin] = useState({});
	const [products, setProducts] = useState([]);
	const [binProducts, setBinProducts] = useState([]);
	const [dropdownProducts, setDropdownProducts] = useState([]);
	const [show, setShow] = useState(false);
	const [productToRemove, setProductToRemove] = useState({});

	// ========================================================== GET BIN PRODUCTS
	const getBinProducts = async () => {
		setError('');
		try {
			const res = await axios.get(`http://localhost:8000/api/bins/${id}/`);
			if (res.status === 200) {
				setBin(res.data);
				setBinProducts(res.data.products);
			}
		} catch (error) {
			console.log("Bin products weren't retrieved...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	useEffect(() => {
		getBinProducts();
	}, []);

	// ====================================================== SET DROPDOWN OPTIONS
	const setDropdownOptions = async () => {
		setError('');
		try {
			const res = await axios.get(`http://localhost:8000/api/products/`);
			if (res.status === 200) {
				setProducts(res.data);
				// In the Add Product dropdown menu,
				// list all products that are not already in the bin
				const remainingProducts = products.filter((product) => {
					return (
						binProducts.findIndex(
							(binProduct) => binProduct.id === product.id
						) === -1
					);
				});
				setDropdownProducts(remainingProducts);
			}
		} catch (error) {
			console.log("Dropdown products weren't retrieved...", error);
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
		try {
			const res = await axios.put(
				`http://localhost:8000/api/products/${product.id}/`,
				product
			);
			if (res.status === 200) {
				getBinProducts();
			}
		} catch (error) {
			console.log("Use count wasn't updated...", error);
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
			}
		} catch (error) {
			console.log("Product wasn't removed...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ============================================= UPDATE BIN WITH ADDED PRODUCT
	const addProductToBin = async (product) => {
		setError('');
		try {
			binProducts.push(product);
			const res = await axios.put(`http://localhost:8000/api/bins/${id}/`, {
				id: bin.id,
				title: bin.title,
				products: binProducts,
			});
			if (res.status === 200) {
				getBinProducts();
			}
		} catch (error) {
			console.log("Bin wasn't updated...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<div>
			<Link to={`/bins/${bin.id}/add-product`}>Add Product</Link>
			<DropdownButton
				id='dropdown-basic-button'
				title='Add Product'
				onClick={setDropdownOptions}>
				{dropdownProducts.map((product) => (
					<Dropdown.Item
						key={product.id}
						onClick={() =>
							addProductToBin(product)
						}>{`${product.name} by ${product.brand}`}</Dropdown.Item>
				))}
			</DropdownButton>
			{binProducts.map((product) => (
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

			{error && error}
		</div>
	);
}

export default Bin;
