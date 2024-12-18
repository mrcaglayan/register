document.getElementById('back-button').addEventListener('click', function() {
    window.location.href = 'admin.html';
});

document.getElementById('add-school').addEventListener('click', function() {
    addSchool();
});

function addSchool() {
    const year = document.getElementById('year').value.trim();
    const schoolName = document.getElementById('school-name').value.trim();
    const tuitionFee = document.getElementById('tuition-fee').value.trim();
    const lunchFee = document.getElementById('lunch-fee').value.trim();
    const cloth = document.getElementById('cloth').value.trim();
    const books = document.getElementById('books').value.trim();
    const dormitory = document.getElementById('dormitory').value.trim();

    if (year && schoolName && tuitionFee && lunchFee && cloth && books && dormitory) {
        const school = {
            year: parseInt(year),
            name: schoolName,
            tuitionFee: parseFloat(tuitionFee),
            lunchFee: parseFloat(lunchFee),
            cloth: parseFloat(cloth),
            books: parseFloat(books),
            dormitory: parseFloat(dormitory)
        };

        fetch('http://localhost:3000/api/schools', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(school)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('School added:', data);
            fetchSchools(); // Fetch and display the updated list of schools
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add school');
        });
    } else {
        alert('Please fill in all fields');
    }
}

function fetchSchools() {
    fetch('http://localhost:3000/api/schools')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const schoolListContainer = document.getElementById('school-list-container');
        schoolListContainer.innerHTML = ''; // Clear any existing list

        const ul = document.createElement('ul');
        data.forEach((school, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${school.year} - ${school.name} - Tuition Fee: ${school.tuitionFee}, Lunch Fee: ${school.lunchFee}, Cloth: ${school.cloth}, Books: ${school.books}, Dormitory: ${school.dormitory}</span>
                <button onclick="editSchool(${index})">Edit</button>
                <button onclick="deleteSchool(${index})">Delete</button>
            `;
            ul.appendChild(li);
        });

        schoolListContainer.appendChild(ul);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to fetch schools');
    });
}

function editSchool(index) {
    fetch('http://localhost:3000/api/schools')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const school = data[index];
        const schoolListContainer = document.getElementById('school-list-container');
        const li = schoolListContainer.querySelectorAll('li')[index];

        li.innerHTML = `
            <input type="number" value="${school.year}" id="edit-year-${index}">
            <input type="text" value="${school.name}" id="edit-school-name-${index}">
            <input type="number" value="${school.tuitionFee}" id="edit-tuition-fee-${index}">
            <input type="number" value="${school.lunchFee}" id="edit-lunch-fee-${index}">
            <input type="number" value="${school.cloth}" id="edit-cloth-${index}">
            <input type="number" value="${school.books}" id="edit-books-${index}">
            <input type="number" value="${school.dormitory}" id="edit-dormitory-${index}">
            <button onclick="saveSchool(${index})">Save</button>
            <button onclick="cancelEdit(${index})">Cancel</button>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to fetch school data for editing');
    });
}

function saveSchool(index) {
    const year = document.getElementById(`edit-year-${index}`).value.trim();
    const schoolName = document.getElementById(`edit-school-name-${index}`).value.trim();
    const tuitionFee = document.getElementById(`edit-tuition-fee-${index}`).value.trim();
    const lunchFee = document.getElementById(`edit-lunch-fee-${index}`).value.trim();
    const cloth = document.getElementById(`edit-cloth-${index}`).value.trim();
    const books = document.getElementById(`edit-books-${index}`).value.trim();
    const dormitory = document.getElementById(`edit-dormitory-${index}`).value.trim();

    if (year && schoolName && tuitionFee && lunchFee && cloth && books && dormitory) {
        const school = {
            year: parseInt(year),
            name: schoolName,
            tuitionFee: parseFloat(tuitionFee),
            lunchFee: parseFloat(lunchFee),
            cloth: parseFloat(cloth),
            books: parseFloat(books),
            dormitory: parseFloat(dormitory)
        };

        console.log('Saving school:', school); // Log the school data being saved

        fetch(`http://localhost:3000/api/schools/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(school)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('School updated:', data);
            fetchSchools(); // Fetch and display the updated list of schools
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update school');
        });
    } else {
        alert('Please fill in all fields');
    }
}

function cancelEdit(index) {
    fetchSchools(); // Re-fetch and display the list of schools to cancel the edit
}

function deleteSchool(index) {
    fetch(`http://localhost:3000/api/schools/${index}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('School deleted:', data);
        fetchSchools(); // Fetch and display the updated list of schools
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete school');
    });
}

// Fetch and display the list of schools when the page loads
document.addEventListener('DOMContentLoaded', fetchSchools);