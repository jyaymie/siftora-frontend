import { Link } from 'react-router-dom';
import background from '../../assets/background-image.jpg';

function About() {
	return (
		<div>
			<div className='dark-overlay'>
				<img
					src={background}
					alt='Background image of makeup'
					className='background-image'
				/>
			</div>
			<p>SIFTORA</p>
			<p>Your digital makeup inventory</p>
			<ul>
				<li>
					<Link to='/signup'>Sign Up</Link>
				</li>
				<li>
					<Link to='/signin'>Sign In</Link>
				</li>
			</ul>
		</div>
	);
}

export default About;
