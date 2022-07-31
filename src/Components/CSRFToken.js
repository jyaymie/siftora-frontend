// https://stackoverflow.com/questions/50732815/how-to-use-csrf-token-in-django-restful-api-and-react

const csrftoken = getCookie('csrftoken');

const CSRFToken = () => {
	return <input type='hidden' name='csrfmiddlewaretoken' value={csrftoken} />;
};
export default CSRFToken;
