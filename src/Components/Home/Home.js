import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../dataContext';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Home() {
	// ==================================================================== STATES
	const { error, setError, bins, setBins } = useContext(DataContext);
	const [show, setShow] = useState(false); // For showing/closing a modal
	const [binToDelete, setBinToDelete] = useState({});

	// ============================================================== ON PAGE LOAD
	// Display all bins on initial page load
	useEffect(() => {
		const getBins = async () => {
			setError('');
			try {
				const res = await axios.get('http://localhost:8000/api/bins/');
				if (res.status === 200) {
					setBins(res.data);
				}
			} catch (error) {
				console.log("Bins weren't retrieved...", error);
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

	// ================================================================ DELETE BIN
	const deleteBin = async () => {
		closeModal();
		setError('');
		const id = binToDelete.id;
		try {
			const res = await axios.delete(`http://localhost:8000/api/bins/${id}`);
			if (res.status === 204) {
				const filteredBins = bins.filter((bin) => bin !== binToDelete);
				setBins(filteredBins);
			}
		} catch (error) {
			console.log("Bin wasn't deleted...", error);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<>
			<Card style={{ width: '200px' }}>
				<Card.Body>
					<Link to='/product-form'>Add Product</Link>
				</Card.Body>
			</Card>

			<Card style={{ width: '200px' }}>
				<Card.Body>
					<Link to='/bin-form'>Add Bin</Link>
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

			{error && error}
		</>
	);
}

export default Home;
