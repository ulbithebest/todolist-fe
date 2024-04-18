document.addEventListener('DOMContentLoaded', function () {
	// Cek apakah pengguna sudah login
	checkLogin();
});

function checkLogin() {
	const token = getCookie('login');
	if (!token) {
		// Jika tidak ada token, arahkan ke halaman login
		window.location.href = 'login.html';
	}
}

function displayGreeting() {
	// Ambil token dari cookie
	const token = getCookie();

	// Pastikan token ada sebelum melakukan permintaan
	if (!token) {
		console.error('Token not found. User may not be authenticated.');
		return;
	}
	var name = document.getElementById("name").value;
	var greeting = "Hello, " + name + "!";
	document.getElementById("greeting").innerText = greeting;
}

function getCookie() {
	const name = 'login'; // Nama cookie
	const cookies = document.cookie.split(';');
	for (let cookie of cookies) {
		const [cookieName, cookieValue] = cookie.split('=');
		if (cookieName.trim() === name) {
			return cookieValue.trim(); // Menghilangkan spasi di awal dan akhir
		}
	}
	return null;
}