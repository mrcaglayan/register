const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const dataFilePath = path.join(__dirname, 'data.json');
const dataStudentFilePath = path.join(__dirname, 'dataStudent.json');

let data = {
    users: [],
    tables: [],
    schools: [],
    students: [],
    completeentrydb: [] // Add completeentrydb array
};

let studentData = {
    students: []
};

// Load data from JSON file
function loadData() {
    if (fs.existsSync(dataFilePath)) {
        const fileData = fs.readFileSync(dataFilePath);
        data = JSON.parse(fileData);
    }
    if (fs.existsSync(dataStudentFilePath)) {
        const fileData = fs.readFileSync(dataStudentFilePath);
        studentData = JSON.parse(fileData);
    }
}

// Save data to JSON file
function saveData() {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

function saveStudentData() {
    fs.writeFileSync(dataStudentFilePath, JSON.stringify(studentData, null, 2));
}

loadData();

app.post('/api/users', (req, res) => {
    const user = req.body;
    data.users.push(user);
    saveData();
    res.status(201).json(user);
});

app.get('/api/users', (req, res) => {
    res.json(data.users);
});

app.delete('/api/users/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < data.users.length) {
        const user = data.users.splice(index, 1)[0];
        saveData();
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.post('/api/tables', (req, res) => {
    const table = req.body;
    data.tables.push(table);
    saveData();
    res.status(201).json(table);
});

app.get('/api/tables', (req, res) => {
    res.json(data.tables);
});

app.delete('/api/tables/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < data.tables.length) {
        const table = data.tables.splice(index, 1)[0];
        saveData();
        res.json(table);
    } else {
        res.status(404).json({ error: 'Table not found' });
    }
});

app.post('/api/schools', (req, res) => {
    const school = req.body;
    data.schools.push(school);
    saveData();
    res.status(201).json(school);
});

app.get('/api/schools', (req, res) => {
    res.json(data.schools);
});

app.put('/api/schools/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    console.log(`PUT request for index: ${index}`); // Log the index
    if (index >= 0 && index < data.schools.length) {
        data.schools[index] = req.body;
        saveData();
        res.json(data.schools[index]);
    } else {
        res.status(404).json({ error: 'School not found' });
    }
});

app.delete('/api/schools/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    console.log(`DELETE request for index: ${index}`); // Log the index
    if (index >= 0 && index < data.schools.length) {
        const school = data.schools.splice(index, 1)[0];
        saveData();
        res.json(school);
    } else {
        res.status(404).json({ error: 'School not found' });
    }
});

app.post('/api/students', (req, res) => {
    const student = req.body;
    data.students.push(student);
    saveData();
    res.status(201).json(student);
});

app.get('/api/students', (req, res) => {
    const username = req.query.username;
    const filteredStudents = data.students.filter(student => student.username === username);
    res.json(filteredStudents);
});

app.put('/api/students/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < data.students.length) {
        data.students[index] = req.body;
        saveData();
        res.json(data.students[index]);
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

app.delete('/api/students/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < data.students.length) {
        const student = data.students.splice(index, 1)[0];
        saveData();
        res.json(student);
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

// New endpoint to save complete entry
app.post('/api/completeentrydb', (req, res) => {
    const completeEntry = req.body;
    data.completeentrydb.push(completeEntry);
    saveData();
    res.status(201).json(completeEntry);
});

app.put('/api/completeentrydb/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < data.completeentrydb.length) {
        data.completeentrydb[index] = req.body;
        saveData();
        res.json(data.completeentrydb[index]);
    } else {
        res.status(404).json({ error: 'Complete entry not found' });
    }
});

app.delete('/api/completeentrydb/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < data.completeentrydb.length) {
        const completeEntry = data.completeentrydb.splice(index, 1)[0];
        saveData();
        res.json(completeEntry);
    } else {
        res.status(404).json({ error: 'Complete entry not found' });
    }
});

// Serve the favicon.ico file
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'favicon.ico'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});