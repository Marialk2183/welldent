const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dental-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            doctorName: formData.get('doctorName'),
            patientName: formData.get('patientName'),
            age: formData.get('age'),
            sex: formData.get('sex'),
        };

        console.log('Sending data to main process:', data);
        ipcRenderer.send('save-form-data', data);
    });

    ipcRenderer.send('fetch-form-data');
    
    ipcRenderer.on('form-data-fetched', (event, rows) => {
        const tbody = document.getElementById('records-table').getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        rows.forEach((row) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.doctor_name}</td>
                <td>${row.patient_name}</td>
                <td>${row.age}</td>
                <td>${row.sex}</td>
            `;
            tbody.appendChild(tr);
        });
    });
});
