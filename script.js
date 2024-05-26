document.addEventListener('DOMContentLoaded', function () {
	// Cek apakah pengguna sudah login
	checkLogin();

	// Fungsi untuk mengambil data
	FungsiGet();
});

function checkLogin() {
	const token = getCookie('login');
	if (!token) {
		// Jika tidak ada token, arahkan ke halaman login
		window.location.href = 'login.html';
	}
}

function FungsiGet() {
	// Ambil token dari cookie
	const token = getCookie();

	// Pastikan token ada sebelum melakukan permintaan
	if (!token) {
		console.error('Token not found. User may not be authenticated.');
		return;
	}

	fetch('http://127.0.0.1:3000/tasks', {
		headers: {
			'login': token
		}
	})
        .then(response => response.json())
        .then(data => {
            const todoList = document.getElementById('todoList');
            todoList.innerHTML = ''; 
            let index = 1;
            data.data.forEach(task => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index}</td>
					<td>${task.nama}</td>
                    <td>${task.judul}</td>
                    <td>${task.deskripsi}</td>
                    <td>${task.due_date}</td>
                    <td>${task.completed ? 'Done' : 'Todo'}</td>
                    <td>
                        <button class="btn btn-danger m-1" data-id="${task.id_task}">Delete</button>
                        <button class="btn btn-secondary m-1" data-id="${task.id_task}">Update</button>
                    </td>
                `;
                row.querySelector('.btn-danger').addEventListener('click', function() {
                    const taskId = this.getAttribute('data-id');
                    deleteData(taskId);
                });
                row.querySelector('.btn-secondary').addEventListener('click', function() {
                    const taskId = this.getAttribute('data-id');
                    openUpdateModal(taskId);
                });
                todoList.appendChild(row);
                index++;
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

function deleteData(taskId) {
    fetch(`http://127.0.0.1:3000/task/delete/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(result => {
        console.log('Data berhasil dihapus:', result);
        fetchTodos(); 
    })
    .catch(error => console.error('Error deleting data:', error));
}

function openUpdateModal(taskId) {
    // Ambil token dari cookie
    const token = getCookie();

    // Pastikan token ada sebelum melakukan permintaan
    if (!token) {
        console.error('Token not found. User may not be authenticated.');
        return;
    }

    fetch(`http://127.0.0.1:3000/task/get?id_task=${taskId}`, {
        headers: {
            'login': token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const taskData = data.data;

            document.getElementById('updateJudul').value = taskData.judul;
            document.getElementById('updateDeskripsi').value = taskData.deskripsi;
            document.getElementById('updateDueDate').value = taskData.due_date;

            const updateButton = document.getElementById('updateButton');
            updateButton.addEventListener('click', function() {
                const newJudul = document.getElementById('updateJudul').value;
                const newDeskripsi = document.getElementById('updateDeskripsi').value;
                const newDueDate = document.getElementById('updateDueDate').value;

                const newData = {
                    judul: newJudul,
                    deskripsi: newDeskripsi,
                    due_date: newDueDate
                };

                updateTask(taskId, newData);
            });
        } else {
            console.error('API response indicates failure:', data.status);
        }
    })
    .catch(error => console.error('Error fetching task details:', error));
}

document.getElementById('updateTaskButton').addEventListener('click', function() {
    
    const taskId = document.getElementById('updateTaskId').value;
    updateTask(taskId, newData);
});
function updateTask(id, newData) {
    fetch(`http://127.0.0.1:3000/task/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Data berhasil diupdate:', result);
        fetchTodos(); // Setelah update, perbarui daftar tugas
    })
    .catch(error => console.error('Error updating data:', error));
}
FungsiGet();

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

function logout() {
	// Hapus cookie yang berisi token
	document.cookie = 'login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Menghapus cookie dengan nama 'login'

	// Redirect ke halaman login
	window.location.href = 'login.html';
}

// Mengambil button dengan id "logoutButton" setelah dokumen selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
	var logoutButton = document.getElementById("logoutButton");

	// Menambahkan event listener untuk logout saat tombol ditekan
	logoutButton.addEventListener("click", logout);
});
