function FungsiGet() {
    fetch('http://127.0.0.1:3000/tasks')
        .then(response => response.json())
        .then(data => {
            const todoList = document.getElementById('todoList');
            todoList.innerHTML = ''; 
            let index = 1;
            data.data.forEach(task => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index}</td>
                    <td>${task.judul}</td>
                    <td>${task.deskripsi}</td>
                    <td>${task.due_date}</td>
                    <td>${task.completed ? 'Done' : 'Todo'}</td>
                    <td>
                        <button class="deleteButton" data-id="${task.id}">Delete</button>
                        <button class="updateButton" data-id="${task.id}">Update</button>
                    </td>
                `;
                row.querySelector('.deleteButton').addEventListener('click', function() {
                    const taskId = this.getAttribute('data-id');
                    deleteData(taskId);
                });
                row.querySelector('.updateButton').addEventListener('click', function() {
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
    
    fetch(`http://127.0.0.1:3000/task/get/${taskId}`)
        .then(response => response.json())
        .then(data => {
            
            document.getElementById('updateJudul').value = data.judul;
            document.getElementById('updateDeskripsi').value = data.deskripsi;
            document.getElementById('updateDueDate').value = data.due_date;

            
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
        })
        .catch(error => console.error('Error fetching task details:', error));
}
document.getElementById('updateTaskButton').addEventListener('click', function() {
    
    const taskId = document.getElementById('updateTaskId').value;
    updateTask(taskId, newData);
});
function updateTask(id, newData) {
    fetch(`http://127.0.0.1:3000/task//${id}`, {
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
