import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Home() {
	// ==================================================================== STATES
	const { error, setError, loading, setLoading } = useContext(DataContext);
	const [bins, setBins] = useState([]);
	// For the modal
	const [show, setShow] = useState(false);
	// For deleting a bin
	const [targetIndex, setTargetIndex] = useState(null);

	// ============================================================== ON PAGE LOAD
	// Display all the bins on initial page load
	useEffect(() => {
		const getBins = async () => {
			setError('');
			setLoading(true);
			try {
				const res = await axios.get('http://localhost:8000/api/bins/');
				if (res.status === 200) {
					console.log('Found the bins!', res);
					setLoading(false);
					setBins(res.data);
				}
			} catch (error) {
				console.log("Bins weren't retrieved...", error);
				setLoading(false);
				setError(
					'Hm, something went wrong. Please try again or contact support@siftora.com.'
				);
			}
		};
		// Call the getBins function
		getBins();
	}, []);

	// ========================================================== SHOW/CLOSE MODAL
	const handleClose = () => setShow(false);

	const handleShow = (index) => {
		setShow(true);
		setTargetIndex(index);
	};

	// =================================================================== ADD BIN
	const addBin = async () => {
		setError('');
		setLoading(true);
		try {
			const res = await axios.post('http://localhost:8000/api/bins/', {});
			if (res.status === 201) {
				let updatedBins = [...bins];
				updatedBins.push(bins[targetIndex]);
				setBins(updatedBins);
				setLoading(false);
			}
		} catch (error) {
			console.log("Bin wasn't added...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ================================================================ DELETE BIN
	const deleteBin = async () => {
		handleClose();
		setError('');
		setLoading(true);
		const id = bins[targetIndex].id;
		try {
			const res = await axios.delete(`http://localhost:8000/api/bins/${id}`);
			if (res.status === 204) {
				let updatedBins = [...bins];
				updatedBins.splice(targetIndex, 1);
				setBins(updatedBins);
				setLoading(false);
			}
		} catch (error) {
			console.log("Bin wasn't deleted...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<div>
			{/* If there is at least one bin, display the option to add a product */}
			{bins.length > 0 ? (
				<Card style={{ width: '200px' }}>
					<Card.Body>
						<Card.Text>Add Product</Card.Text>
						<Link to='/product'>Add</Link>
					</Card.Body>
				</Card>
			) : null}

			{bins
				? bins.map((bin, index) => (
						<div key={bin.id}>
							<Card style={{ width: '200px' }}>
								<Card.Body>
									<Link to={`bins/${bin.id}`}>
										<Card.Text>
											{bin.title} ({bin.product_count})
										</Card.Text>
									</Link>
									<Button type='button' variant='primary'>
										Edit
									</Button>
									<Button
										type='button'
										variant='primary'
										onClick={() => handleShow(index)}>
										Delete
									</Button>
								</Card.Body>
							</Card>

							<Modal show={show} onHide={handleClose}>
								<Modal.Header>
									<Modal.Title>Are you sure?</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									{`Deleting your ${bin.title} bin will also delete the products
									it contains. You will still have access to any of these
									products if they are stored in other bins.`}
								</Modal.Body>
								<Modal.Footer>
									<Button
										type='button'
										variant='secondary'
										onClick={handleClose}>
										Cancel
									</Button>
									<Button type='button' variant='primary' onClick={deleteBin}>
										Delete Bin
									</Button>
								</Modal.Footer>
							</Modal>
						</div>
				  ))
				: null}

			<Card style={{ width: '200px' }}>
				<Card.Body>
					<Card.Text>Add Bin</Card.Text>
					<Button type='button' variant='secondary' onClick={addBin}>
						Add
					</Button>
				</Card.Body>
			</Card>

			{loading && 'Loading...'}
			{error && error}
		</div>
	);
}

export default Home;
