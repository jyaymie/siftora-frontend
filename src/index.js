import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './Components/App/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Router>
		<App />
	</Router>
);
