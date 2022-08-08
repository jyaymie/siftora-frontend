import './Bins.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthFetch } from '../../utils/common';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Spinner from '../Spinner/Spinner';

function Bins() {
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [binToDelete, setBinToDelete] = useState({});

	// ============================================================= RETRIEVE BINS
	const { data, loading, error, deleteItem } = useAuthFetch('/bins');

	// ========================================================== SHOW/CLOSE MODAL
	const showModal = (e, bin) => {
		e.preventDefault();
		setBinToDelete(bin);
		setShow(true);
	};

	const closeModal = () => setShow(false);

	// ================================================================ DELETE BIN
	const deleteBin = async () => {
		closeModal();
		deleteItem(binToDelete);
	};

	// ======================================================================= JSX
	return (
		<section className='bins'>
			<h2>Bins</h2>
			<div className='bins-container'>
				{/* ======================================================= BIN CARD */}
				{data.map((bin) => (
					<Link to={`/bins/${bin.id}`} key={bin.id} className='bin-link'>
						<Card>
							<p className='card-text'>
								{bin.title} ({bin.product_count})
							</p>
							<div className='bins-icon-container'>
								<Link
									to={`/bins/${bin.id}/edit`}
									className='edit-icon button-css'>
									<i className='icon-pencil'></i>
								</Link>
								<button
									type='button'
									className='delete-icon button-css'
									onClick={(e) => showModal(e, bin)}>
									<i className='icon-trash'></i>
								</button>
							</div>
						</Card>
					</Link>
				))}

				{/* ========================================= DEFAULT 'Add Bin' CARD */}
				{!loading && (
					<Link to={`/add-bin`}>
						<Card className='add-bin-card'>
							<p className='card-text'>Add Bin</p>
							<div className='icon-container'>
								<button
									type='button'
									className='add-icon button-css'
									onClick={() => navigate('/add-bin')}>
									+
								</button>
							</div>
						</Card>
					</Link>
				)}
			</div>

			{/* ============================================================ MODAL */}
			<Modal show={show} onHide={closeModal}>
				<Modal.Header>
					<Modal.Title>Are you sure?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Deleting your{' '}
					<span className='modal-bin-name'>{binToDelete.title}</span> bin cannot
					be undone.
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
						onClick={deleteBin}>
						DELETE BIN
					</button>
				</Modal.Footer>
			</Modal>

			{loading && <Spinner />}
			{error && error}
		</section>
	);
}

export default Bins;
