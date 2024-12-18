document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedSchool = urlParams.get('school');
    const username = urlParams.get('username'); // Get the username from the URL parameters

    if (!selectedSchool) {
        alert('No school selected');
        window.location.href = 'index.html';
        return;
    }

    let schoolData = null;

    fetchSchoolData(selectedSchool);

    document.getElementById('add-entry').addEventListener('click', function() {
        addEntry(username); // Pass the username to the addEntry function
    });

    document.getElementById('preview-entry').addEventListener('click', function() {
        previewEntry();
    });

    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    function fetchSchoolData(school) {
        fetch('http://localhost:3000/api/schools')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            schoolData = data.find(s => s.name === school);
            if (!schoolData) {
                alert('School not found');
                window.location.href = 'index.html';
            } else {
                fetchTableStructure(school);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch school data');
        });
    }

    function fetchTableStructure(school) {
        fetch(`http://localhost:3000/api/tables?school=${encodeURIComponent(school)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                const lastTable = data[data.length - 1];
                generateTableForm(lastTable.headers, lastTable.data);
                generateEntryListHeaders(lastTable.headers);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch table structure');
        });
    }

    function generateTableForm(headers, data) {
        const tableContainer = document.getElementById('table-container');
        tableContainer.innerHTML = ''; // Clear any existing table

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.name;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const dataRow = document.createElement('tr');

        headers.forEach((header, index) => {
            const td = document.createElement('td');
            let input;

            if (header.type === 'text') {
                input = document.createElement('input');
                input.type = 'text';
            } else if (header.type === 'dropdown') {
                input = document.createElement('select');
                header.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    input.appendChild(optionElement);
                });
            } else if (header.type === 'date') {
                input = document.createElement('input');
                input.type = 'date';
            } else if (header.type === 'number') {
                input = document.createElement('input');
                input.type = 'number';
            }

            if (input) {
                input.id = `entry-${header.name}`;
                input.value = data[index] || '';
                if (header.locked) {
                    input.disabled = true;
                }
                td.appendChild(input);
                dataRow.appendChild(td);
            }
        });

        tbody.appendChild(dataRow);
        table.appendChild(tbody);
        tableContainer.appendChild(table);
    }

    function generateEntryListHeaders(headers) {
        const entryList = document.getElementById('entry-list');
        const thead = entryList.querySelector('thead');
        thead.innerHTML = ''; // Clear any existing headers

        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.name;
            headerRow.appendChild(th);
        });

        const th = document.createElement('th');
        th.textContent = 'Actions';
        headerRow.appendChild(th);

        thead.appendChild(headerRow);
    }

    function addEntry(username) {
        const entryData = {};
        const inputs = document.querySelectorAll('#table-container input, #table-container select');

        inputs.forEach(input => {
            const key = input.id.replace('entry-', '');
            entryData[key] = input.value.trim();
        });

        if (Object.values(entryData).some(value => value === '')) {
            alert('Please fill in all fields');
            return;
        }

        // Add school data and username to the complete entry
        const completeEntry = { ...entryData, ...schoolData, username };

        // Save the student entry
        fetch('http://localhost:3000/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...entryData, username }) // Include username in the student-specific information
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Student added:', data);
            fetchStudents(username); // Fetch and display the updated list of students
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add student');
        });

        // Save the complete entry
        fetch('http://localhost:3000/api/completeentrydb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(completeEntry)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Complete entry added:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add complete entry');
        });
    }

    function previewEntry() {
        const entryData = {};
        const inputs = document.querySelectorAll('#table-container input, #table-container select');

        inputs.forEach(input => {
            const key = input.id.replace('entry-', '');
            entryData[key] = input.value.trim();
        });

        const previewWindow = window.open('', '_blank');
        previewWindow.document.write('<html><head><title>Preview Entry</title></head><body>');
        previewWindow.document.write('<h1>Preview Entry</h1>');
        previewWindow.document.write('<table border="1"><tr>');

        Object.keys(entryData).forEach(key => {
            previewWindow.document.write(`<th>${key}</th>`);
        });

        previewWindow.document.write('</tr><tr>');

        Object.values(entryData).forEach(value => {
            previewWindow.document.write(`<td>${value}</td>`);
        });

        previewWindow.document.write('</tr></table>');
        previewWindow.document.write('<button onclick="window.print()">Print</button>');
        previewWindow.document.write('</body></html>');
        previewWindow.document.close();
    }

    function printStudent(student) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print Student</title></head><body>');
        printWindow.document.write('<h1>Student Information</h1>');
        printWindow.document.write('<table border="1"><tr>');

        Object.keys(student).forEach(key => {
            printWindow.document.write(`<th>${key}</th>`);
        });

        printWindow.document.write('</tr><tr>');

        Object.values(student).forEach(value => {
            printWindow.document.write(`<td>${value}</td>`);
        });

        printWindow.document.write('</tr></table>');
        printWindow.document.write('<button onclick="window.print()">Print</button>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
    }

    function fetchStudents(username) {
        fetch(`http://localhost:3000/api/students?username=${encodeURIComponent(username)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Get the response as text
        })
        .then(text => {
            if (text) {
                return JSON.parse(text); // Parse the text as JSON if it's not empty
            } else {
                return []; // Return an empty array if the response is empty
            }
        })
        .then(data => {
            const studentList = document.querySelector('#student-list');
            studentList.innerHTML = ''; // Clear any existing list

            data.forEach(student => {
                const row = document.createElement('tr');
                Object.entries(student).forEach(([key, value]) => {
                    if (key !== 'username') { // Omit the username field
                        const cell = document.createElement('td');
                        cell.textContent = value;
                        row.appendChild(cell);
                    }
                });

                const actionCell = document.createElement('td');
                const printButton = document.createElement('button');
                printButton.textContent = 'Print';
                printButton.addEventListener('click', function() {
                    printStudent(student);
                });
                actionCell.appendChild(printButton);
                row.appendChild(actionCell);

                studentList.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch students');
        });
    }

    // Fetch and display the list of students when the page loads
    fetchStudents(username);
});