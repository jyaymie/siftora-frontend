import { Link } from 'react-router-dom';

function About() {
	return (
		<div>
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
