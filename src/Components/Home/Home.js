import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
	return (
		<section className='home'>
			<div className='home-content'>
				<h1>SIFTORA</h1>
				<Link to='/bins' className='bins-link'>
					SEE MY COLLECTION
				</Link>
				{/* <ul>
					<li>
						<Link to='/signup'>Sign Up</Link>
					</li>
					<li>
						<Link to='/signin'>Sign In</Link>
					</li>
				</ul> */}
			</div>
		</section>
	);
}

export default Home;
