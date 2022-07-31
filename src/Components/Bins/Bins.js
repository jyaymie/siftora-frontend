import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Bins() {
	const [error, setError] = useState('');
	const [bins, setBins] = useState([]);
	const [show, setShow] = useState(false);
	const [binToDelete, setBinToDelete] = useState({});

	// ============================================================= RETRIEVE BINS
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

	useEffect(() => {
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
			const res = await axios.delete(`http://localhost:8000/api/bins/${id}/`);
			if (res.status === 204) {
				const filteredBins = bins.filter((bin) => bin !== binToDelete);
				setBins(filteredBins);
				getBins();
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
		<div>
			<Link to='/add-bin'>Add Bin</Link>

			{bins.map((bin) => (
				<Card style={{ width: '200px' }} key={bin.id}>
					<Card.Body>
						<Link to={`/bins/${bin.id}`}>
							<Card.Text>
								{bin.title} ({bin.product_count})
							</Card.Text>
						</Link>
						<Link to={`/bins/${bin.id}/edit`}>Edit</Link>
						<Button
							type='button'
							variant='secondary'
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

			{error && error}
		</div>
	);
}

export default Bins;
