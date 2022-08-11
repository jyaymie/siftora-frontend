import './Bins.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthFetch } from '../../utils/common';
import { MODAL_TYPE } from '../../utils/enums';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from '../Spinner/Spinner';

function Bins() {
	const [show, setShow] = useState({
		modalForAdding: false,
		modalForDeleting: false,
		modalForUpdating: false,
	});
	const [binToAdd, setBinToAdd] = useState({ title: '' });
	const [binToDelete, setBinToDelete] = useState({ id: '', title: '' });
	const [binToUpdate, setBinToUpdate] = useState({ id: '', title: '' });

	// ================================================================== GET BINS
	const { data, loading, error, addItem, deleteItem, updateItem } =
		useAuthFetch('/bins');

	// =================================================================== ADD BIN
	const addBin = async () => {
		addItem(binToAdd);
		closeModal();
	};

	// ================================================================ DELETE BIN
	const deleteBin = async () => {
		deleteItem(binToDelete);
		closeModal();
	};

	// ================================================================ UPDATE BIN
	const updateBin = async (e) => {
		e.preventDefault();
		updateItem(binToUpdate);
		closeModal();
	};

	// ========================================================== SHOW/CLOSE MODAL
	const showModal = (e, bin, type) => {
		e.preventDefault();
		switch (type) {
			case MODAL_TYPE.ADD:
				setShow({
					...show,
					modalForAdding: true,
				});
				setBinToAdd({ title: '' });
				break;
			case MODAL_TYPE.DELETE:
				setBinToDelete(bin);
				setShow({
					...show,
					modalForDeleting: true,
				});
				break;
			case MODAL_TYPE.UPDATE:
				setBinToUpdate(bin);
				setShow({
					...show,
					modalForUpdating: true,
				});
				break;
			default:
				break;
		}
	};

	const closeModal = () => {
		setShow({
			modalForAdding: false,
			modalForDeleting: false,
			modalForUpdating: false,
		});
	};

	// ======================================================================= JSX
	return (
		<section className='bins'>
			<h2>Bins</h2>

			{/* ======================================================== BIN CARDS */}
			<div className='bins-container'>
				{data.map((bin) => (
					<Link to={`/bins/${bin.id}`} key={bin.id}>
						<Card>
							<p>
								{bin.title} ({bin.product_count})
							</p>
							<div className='bin-icon-container'>
								<button
									className='update-icon button-css'
									onClick={(e) => showModal(e, bin, MODAL_TYPE.UPDATE)}>
									<i className='icon-pencil'></i>
								</button>
								<button
									type='button'
									className='delete-icon button-css'
									onClick={(e) => showModal(e, bin, MODAL_TYPE.DELETE)}>
									<i className='icon-trash'></i>
								</button>
							</div>
						</Card>
					</Link>
				))}

				{/* ========================================= DEFAULT 'Add Bin' CARD */}
				{!loading && (
					<Card
						className='add-bin-card'
						onClick={(e) => showModal(e, {}, MODAL_TYPE.ADD)}>
						<p>Add Bin</p>
						<div className='bin-icon-container'>
							<button
								type='button'
								className='add-icon button-css'
								onClick={(e) => showModal(e, {}, MODAL_TYPE.ADD)}>
								+
							</button>
						</div>
					</Card>
				)}
			</div>

			{/* ================================================= MODAL TO ADD BIN */}
			<Modal show={show.modalForAdding} onHide={closeModal} centered>
				<Modal.Body>
					<h2>New Bin</h2>
					<Form onSubmit={addBin}>
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
								onClick={closeModal}>
								CANCEL
							</button>
							<button type='submit' className='modal-submit-button button-css'>
								ADD BIN
							</button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>

			{/* ============================================== MODAL TO DELETE BIN */}
			<Modal show={show.modalForDeleting} onHide={closeModal} centered>
				<Modal.Header>
					<Modal.Title className='bold'>Are you sure?</Modal.Title>
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

			{/* ============================================== MODAL TO UPDATE BIN */}
			<Modal show={show.modalForUpdating} onHide={closeModal} centered>
				<Modal.Body>
					<h2>Update Bin</h2>
					<Form onSubmit={updateBin}>
						<Form.Group>
							<Form.Label htmlFor='title'>Title</Form.Label>
							<Form.Control
								id='title'
								defaultValue={binToUpdate.title}
								onChange={(e) =>
									setBinToUpdate({
										id: binToUpdate.id,
										title: e.target.value,
										products: binToUpdate.products,
									})
								}
								required
							/>
						</Form.Group>
						<div className='modal-button-container'>
							<button
								type='button'
								className='modal-cancel-button button-css'
								onClick={closeModal}>
								CANCEL
							</button>
							<button type='submit' className='modal-submit-button button-css'>
								UPDATE BIN
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
