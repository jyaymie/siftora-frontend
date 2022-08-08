import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
	const switchForm = () => {
		// Signup form is displayed on default
		// When the user clicks on the link to the Login form
		// Hide the Signup form and display the Login form
		// When the user clicks on the link to the Signup form
		// Hide the Login form and display the Signup form
	};

	return (
		<section className='home'>
			<div className='home-mobile'>
				<h1>SIFTORA</h1>
				<div className='home-link-container'>
					<Link to='/login' id='login-link' className='button-css'>
						LOG IN
					</Link>
					<Link to='/signup' id='signup-link' className='button-css'>
						SIGN UP
					</Link>
				</div>
			</div>
		</section>
	);
}

export default Home;
