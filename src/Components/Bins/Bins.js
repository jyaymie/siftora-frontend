import './Bins.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Spinner from '../Spinner/Spinner';

import { useAuthFetch } from '../../utils/common';

function Bins() {
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [binToDelete, setBinToDelete] = useState({});

	// ============================================================= RETRIEVE BINS
	const { data, loading, error, deleteItem } = useAuthFetch('/bins');

	// ========================================================== SHOW/CLOSE MODAL
	const showModal = (e, bin) => {
		console.log('open modal');
		e.preventDefault();
		setBinToDelete(bin);
		setShow(true);
	};

	const closeModal = () => setShow(false);

	// ================================================================ DELETE BIN
	const deleteBin = async () => {
		const id = binToDelete.id;

		closeModal();
		deleteItem(id);
	};

	// ======================================================================= JSX
	return (
		<section className='bins'>
			<h2>Bins</h2>
			<div className='bins-container'>
				{data.map((bin) => (
					<Link to={`/bins/${bin.id}`} key={bin.id} className='bin-link'>
						<Card>
							<p className='card-text'>
								{bin.title} ({bin.product_count})
							</p>
							<div className='bins-icons-container'>
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

				{!loading && (
					<Link to={`/add-bin`}>
						<Card className='add-bin-card'>
							<p className='card-text'>Add Bin</p>
							<div className='icons-container'>
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

			<Modal show={show} onHide={closeModal}>
				<Modal.Header>
					<Modal.Title>Are you sure?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Deleting your <span className='bin-name'>{binToDelete.title}</span>{' '}
					bin cannot be undone.
				</Modal.Body>
				<Modal.Footer>
					<button
						type='button'
						className='modal-cancel button-css'
						onClick={closeModal}>
						CANCEL
					</button>
					<button
						type='button'
						className='modal-delete button-css'
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
