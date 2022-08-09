import './Bins.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthFetch } from '../../utils/common';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from '../Spinner/Spinner';

function Bins() {
	const navigate = useNavigate();
	const [show, setShow] = useState({ modalToAdd: false, modalToDelete: false });
	const [binToDelete, setBinToDelete] = useState({});
	const [binToAdd, setBinToAdd] = useState({ title: '' });

	// ============================================================= RETRIEVE BINS
	const { data, loading, error, deleteItem, addItem } = useAuthFetch('/bins');

	// ========================================================== SHOW/CLOSE MODAL
	const showModal = (e, bin, name) => {
		e.preventDefault();
		bin && setBinToDelete(bin);
		const data = { ...show, [name]: true };
		setShow(data);
	};

	const closeModal = (name) => {
		const data = { ...show, [name]: false };
		setShow(data);
	};

	// ================================================================ DELETE BIN
	const deleteBin = async (name) => {
		closeModal(name);
		deleteItem(binToDelete);
	};

	// =================================================================== ADD BIN
	const addBin = async (name) => {
		closeModal(name);
		addItem(binToAdd);
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
									onClick={(e) => showModal(e, bin, 'modalToDelete')}>
									<i className='icon-trash'></i>
								</button>
							</div>
						</Card>
					</Link>
				))}

				{/* ========================================= DEFAULT 'Add Bin' CARD */}
				{!loading && (
					<Card className='add-bin-card'>
						<p className='card-text'>Add Bin</p>
						<div className='icon-container'>
							<button
								type='button'
								className='add-icon button-css'
								onClick={(e) => showModal(e, '', 'modalToAdd')}>
								+
							</button>
						</div>
					</Card>
				)}
			</div>

			{/* ============================================== MODAL TO DELETE BIN */}
			<Modal
				show={show.modalToDelete}
				onHide={() => {
					closeModal('modalToDelete');
				}}>
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
						onClick={() => {
							closeModal('modalToDelete');
						}}>
						CANCEL
					</button>
					<button
						type='button'
						className='modal-delete-button button-css'
						onClick={() => deleteBin('modalToDelete')}>
						DELETE BIN
					</button>
				</Modal.Footer>
			</Modal>

			{/* ================================================= MODAL TO ADD BIN */}
			<Modal show={show.modalToAdd} onHide={() => closeModal('modalToAdd')}>
				<Modal.Body>
					<h2>New Bin </h2>
					<Form>
						<Form.Group>
							<Form.Label htmlFor='title'>Title</Form.Label>
							<Form.Control
								id='title'
								value={binToAdd.title}
								onChange={(e) => setBinToAdd({ title: e.target.value })}
								required
							/>
						</Form.Group>
						<div className='modal-button-container'>
							<button
								type='button'
								className='modal-cancel-button button-css'
								onClick={() => {
									closeModal('modalToAdd');
								}}>
								CANCEL
							</button>
							<button
								type='button'
								className='modal-submit-button button-css'
								onClick={() => {
									addBin('modalToAdd');
								}}>
								ADD BIN
							</button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>

			{loading && <Spinner />}
			{error && error}
		</section>
	);
}

export default Bins;
