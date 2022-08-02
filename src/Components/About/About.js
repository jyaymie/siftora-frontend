import './About.css';
import { Link } from 'react-router-dom';

function About() {
	return (
		<div className='app'>
			<div className='app-content'>
				<h1>SIFTORA</h1>
				<Link to='/bins' className='bins-link' >
					see your collection
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
		</div>
	);
}

export default About;
