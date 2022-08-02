import './Bins.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

function Bins() {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [bins, setBins] = useState([]);
	const [show, setShow] = useState(false);
	const [binToDelete, setBinToDelete] = useState({});

	// ============================================================= RETRIEVE BINS
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
		setLoading(true);
		const id = binToDelete.id;
		try {
			const res = await axios.delete(`http://localhost:8000/api/bins/${id}/`);
			if (res.status === 204) {
				const filteredBins = bins.filter((bin) => bin !== binToDelete);
				setBins(filteredBins);
				getBins();
				setLoading(false);
			}
		} catch (error) {
			console.log("Bin wasn't deleted...", error);
			setLoading(true);
			setError(
				'Hm, something went wrong. Please try again or contact support@siftora.com.'
			);
		}
	};

	// ======================================================================= JSX
	return (
		<section className='bins'>
			<div className='bins-container'>
				{bins.map((bin) => (
					<Card key={bin.id}>
						<Card.Body>
							<Link to={`/bins/${bin.id}`} className='card-title'>
								{bin.title} ({bin.product_count})
							</Link>
							<div className='icons-container'>
								<Link to={`/bins/${bin.id}/edit`} className='button-css edit-icon'>
									<i class='icon-pencil'></i>
								</Link>
								<button
									type='button'
									className='button-css delete-icon'
									onClick={() => showModal(bin)}>
									<i class='icon-trash'></i>
								</button>
							</div>
						</Card.Body>
					</Card>
				))}

				<Card>
					<Card.Body>
						<Link to={`/add-bin`} className='card-title'>
							Add Bin
						</Link>
						<button
							type='button'
							className='button-css'
							onClick={() => navigate('/add-bin')}>
							+
						</button>
					</Card.Body>
				</Card>
			</div>

			<Modal show={show} onHide={closeModal}>
				<Modal.Header>
					<Modal.Title>Are you sure?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{`Deleting your ${binToDelete.title} bin cannot be undone.`}
				</Modal.Body>
				<Modal.Footer>
					<button type='button' className='button-css' onClick={closeModal}>
						CANCEL
					</button>
					<button type='button' className='button-css' onClick={deleteBin}>
						DELETE BIN
					</button>
				</Modal.Footer>
			</Modal>
			
			{loading && 'Loading...'}
			{error && error}
		</section>
	);
}

export default Bins;
