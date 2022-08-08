import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
	return (
		<section className='home'>
			<div className='home-content'>
				<h1>SIFTORA</h1>
				<div className='home-link-container'>
					<Link to='/login' className='login-link button-css'>
						LOG IN
					</Link>
					<Link to='/signup' className='signup-link button-css'>
						SIGN UP
					</Link>
				</div>
			</div>
		</section>
	);
}

export default Home;
