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
	const [show, setShow] = useState(false); // For showing/closing a modal
	const [binToDelete, setBinToDelete] = useState({});

	// ============================================================== ON PAGE LOAD
	// Display all bins on initial page load
	useEffect(() => {
		const getBins = async () => {
			setError('');
			setLoading(true);
			try {
				const res = await axios.get('http://localhost:8000/api/bins/');
				if (res.status === 200) {
					setBins(res.data);
					setLoading(false);
				}
			} catch (error) {
				console.log("Bins weren't retrieved...", error);
				setLoading(false);
				setError(
					'Hm, something went wrong. Please try again or contact support@siftora.com.'
				);
			}
		};
		getBins();
	}, []);

	// ========================================================== SHOW/CLOSE MODAL
	const showModal = (bin) => {
		setBinToDelete(bin);
		setShow(true);
	};

	const closeModal = () => setShow(false);

	// =================================================================== ADD BIN
	const addBin = async () => {
		// setError('');
		// setLoading(true);
		// try {
		// 	const res = await axios.post('http://localhost:8000/api/bins/', {
		// 		title: 'title',
		// 	});
		// 	if (res.status === 201) {
		// 		setLoading(false);
		// 		let updatedBins = [...bins];
		// 		updatedBins.push();
		// 		setBins(updatedBins);
		// 	}
		// } catch (error) {
		// 	setLoading(false);
		// 	setError(
		// 		'Hm, something went wrong. Please try again or contact support@siftora.com.'
		// 	);
		// 	console.log("The bin wasn't created...", error);
		// }
	};

	// ================================================================ DELETE BIN
	const deleteBin = async () => {
		closeModal();
		setError('');
		setLoading(true);
		const id = binToDelete.id;
		try {
			const res = await axios.delete(`http://localhost:8000/api/bins/${id}`);
			if (res.status === 204) {
				const filteredBins = bins.filter((bin) => bin !== binToDelete);
				setBins(filteredBins);
				setLoading(false);
			}
		} catch (error) {
			console.log("The bin wasn't deleted...", error);
			setLoading(false);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<div>
			<Card style={{ width: '200px' }}>
				<Card.Body>
					<Link to='/product'>Add Product</Link>
				</Card.Body>
			</Card>

			{bins.map((bin) => (
				<Card style={{ width: '200px' }} key={bin.id}>
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
							onClick={() => showModal(bin)}>
							Delete
						</Button>
					</Card.Body>
				</Card>
			))}

			<Card style={{ width: '200px' }}>
				<Card.Body>
					<Card.Text>Add Bin</Card.Text>
					<Button type='button' variant='secondary' onClick={addBin}>
						Add
					</Button>
				</Card.Body>
			</Card>

			<Modal show={show} onHide={closeModal}>
				<Modal.Header>
					<Modal.Title>Are you sure?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{`Deleting your ${binToDelete.title} bin cannot be undone.`}
				</Modal.Body>
				<Modal.Footer>
					<Button type='button' variant='secondary' onClick={closeModal}>
						Cancel
					</Button>
					<Button type='button' variant='primary' onClick={deleteBin}>
						Delete Bin
					</Button>
				</Modal.Footer>
			</Modal>

			{loading && 'Just a sec...'}
			{error && error}
		</div>
	);
}

export default Home;
