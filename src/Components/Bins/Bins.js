import './Bins.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthFetch } from '../../utils/common';
import { BASE_API_URL, MODAL_TYPE } from '../../utils/enums';
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
	const [binToDelete, setBinToDelete] = useState({});
	const [binToAdd, setBinToAdd] = useState({ title: '' });
	const [binToUpdate, setBinToUpdate] = useState({ title: '' });

	// ================================================================== GET BINS
	const { data, loading, error, addItem, deleteItem, updateItem } =
		useAuthFetch('/bins');

	// ========================================================== SHOW/CLOSE MODAL
	const showModal = (e, bin, type) => {
		e.preventDefault();
		switch (type) {
			case MODAL_TYPE.ADD:
				setShow({
					...show,
					modalForAdding: true,
				});
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
				console.log(bin);
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

	// ================================================================ DELETE BIN
	const deleteBin = async () => {
		closeModal();
		deleteItem(binToDelete);
	};

	// =================================================================== ADD BIN
	const addBin = async () => {
		closeModal();
		addItem(binToAdd);
	};

	// ================================================================ UPDATE BIN
	const updateBin = async (e) => {
		e.preventDefault();
		console.log(binToUpdate);

		closeModal();
		updateItem(binToUpdate, `${BASE_API_URL}/bins`);
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
								<button
									className='edit-icon button-css'
									onClick={(e) => showModal(e, bin, MODAL_TYPE.UPDATE)}>
									<i className='icon-pencil'></i>
								</button>
								<button
									type='button'
									className='delete-icon button-css'
									onClick={() => showModal(bin, MODAL_TYPE.DELETE)}>
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
						<p className='card-text'>Add Bin</p>
						<div className='bins-icon-container'>
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

			{/* ============================================== MODAL TO DELETE BIN */}
			<Modal show={show.modalForDeleting} onHide={closeModal}>
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
						onClick={() => deleteBin()}>
						DELETE BIN
					</button>
				</Modal.Footer>
			</Modal>

			{/* ================================================= MODAL TO ADD BIN */}
			<Modal show={show.modalForAdding} onHide={closeModal}>
				<Modal.Body>
					<h2>New Bin</h2>
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
								onClick={closeModal}>
								CANCEL
							</button>
							<button
								type='button'
								className='modal-submit-button button-css'
								onClick={() => {
									addBin(MODAL_TYPE.ADD);
								}}>
								ADD BIN
							</button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>

			{/* ================================================ MODAL TO EDIT BIN */}
			<Modal show={show.modalForUpdating} onHide={closeModal}>
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
