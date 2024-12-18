document.addEventListener('DOMContentLoaded', function() {
    const schoolSelect = document.getElementById('school');
    const schoolGroup = document.getElementById('school-group');
    const urlParams = new URLSearchParams(window.location.search);
    const userType = urlParams.get('type');

    if (userType === 'user') {
        // Fetch the list of schools and populate the dropdown
        fetch('http://localhost:3000/api/schools')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                data.forEach(school => {
                    const option = document.createElement('option');
                    option.value = school.name; // Assuming the school name is in the 'name' field
                    option.textContent = school.name;
                    schoolSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to fetch schools');
            });
    } else {
        schoolGroup.style.display = 'none';
    }

    document.getElementById('admin-login').addEventListener('click', function() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username && password) {
            if (username === 'admin' && password === 'Umufucuk1991?') {
                window.location.href = 'admin.html';
            } else {
                alert('Invalid admin credentials');
            }
        } else {
            alert('Please fill in both username and password');
        }
    });

    document.getElementById('user-login').addEventListener('click', function() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const school = document.getElementById('school').value;

        if (username && password && school) {
            fetch('http://localhost:3000/api/users')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(users => {
                    const user = users.find(u => u.username === username && u.password === password && u.schoolName === school);
                    if (user) {
                        window.location.href = `user.html?school=${encodeURIComponent(school)}&username=${encodeURIComponent(username)}`;
                    } else {
                        alert('Invalid user credentials');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to fetch users');
                });
        } else {
            alert('Please fill in all fields');
        }
    });

    document.getElementById('back-to-home').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});