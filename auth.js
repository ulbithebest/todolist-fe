document.getElementById("loginForm").addEventListener("submit", function (event) {
	event.preventDefault();
	const formData = new FormData(this);
	const jsonData = {};
	formData.forEach((value, key) => { jsonData[key] = value });

	fetch('http://127.0.0.1:3000/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(jsonData)
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			const token = data.token;
			// Set cookie with the token for 1 hour
			setCookie('login', token, 1 / 24); // 1 hour expiration
			// Redirect to index.html after successful login
			// Redirect to appropriate page after successful login
			redirectToPageBasedOnUserRole(token);
			window.location.href = 'index.html';
		})
		.catch(error => {
			console.error('There was an error with the login request:', error);
			document.getElementById('message').innerHTML = 'Login failed. Please try again.';
		});
});

function setCookie(name, value, daysFraction) {
	const d = new Date();
	d.setTime(d.getTime() + (daysFraction * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function redirectToPageBasedOnUserRole(token) {
	// Fetch user data and redirect based on user role
	fetch('http://127.0.0.1:3000/getme', {
		method: 'GET',
		headers: {
			'login': token,
		},
	})
		.then(response => response.json())
		.then(data => {
			const userRole = data.user.id_role;
			if (userRole === 1) {
				// Redirect to admin page
				window.location.href = 'admin.html';
			} else {
				// Redirect to index.html or any other default page
				window.location.href = 'index.html';
			}
		})
		.catch(error => {
			console.error('Error fetching user data:', error);
			// Handle error, redirect to index.html or display error message
			window.location.href = 'login.html';
		});
}