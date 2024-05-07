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
			setCookie('login', token, 1 / 24);
			Swal.fire({
				icon: 'success',
				title: 'Logged in Successfully!',
				text: 'You will now be redirected.'
			}).then(() => {
				redirectToPageBasedOnUserRole(token);
			});
		})
		.catch(error => {
			console.error('There was an error with the login request:', error);
			Swal.fire({
				icon: 'error',
				title: 'Login Failed',
				text: 'Please try again.'
			});
		});
});

document
	.getElementById("signupForm")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent the default form submission
		const formData = new FormData(this);
		const jsonData = {};
		formData.forEach((value, key) => {
			jsonData[key] = value;
		});

		fetch("http://127.0.0.1:3000/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(jsonData),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				Swal.fire({
					icon: 'success',
					title: 'Registration Successful!',
					text: 'You can now log in with your new account.'
				});
			})
			.catch((error) => {
				console.error("Error during registration:", error);
				Swal.fire({
					icon: 'error',
					title: 'Registration Failed',
					text: 'Please try again.'
				});
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