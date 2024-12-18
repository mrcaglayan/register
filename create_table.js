document.getElementById('back-button').addEventListener('click', function() {
    window.location.href = 'admin.html';
});

document.getElementById('add-header').addEventListener('click', function() {
    addHeader();
});

document.getElementById('data-entry-type').addEventListener('change', function() {
    const dataEntryType = document.getElementById('data-entry-type').value;
    const dropdownOptionsGroup = document.getElementById('dropdown-options-group');
    if (dataEntryType === 'dropdown') {
        dropdownOptionsGroup.style.display = 'block';
    } else {
        dropdownOptionsGroup.style.display = 'none';
    }
});

let headers = [];
let tableData = [];

function addHeader() {
    const headerName = document.getElementById('header-name').value.trim();
    const dataEntryType = document.getElementById('data-entry-type').value;
    const dropdownOptions = document.getElementById('dropdown-options').value.trim();

    if (headerName && dataEntryType) {
        const options = dataEntryType === 'dropdown' ? dropdownOptions.split(',').map(option => option.trim()) : [];
        headers.push({ name: headerName, type: dataEntryType, options: options, locked: false });
        tableData.push(createDataEntryField(dataEntryType, '', options, false));
        displayTable();
        document.getElementById('header-name').value = '';
        document.getElementById('dropdown-options').value = '';
        saveTable();
    } else {
        alert('Please enter a header name and select a data entry type');
    }
}

function createDataEntryField(type, value = '', options = [], locked = false) {
    let input;
    if (type === 'text') {
        input = document.createElement('input');
        input.type = 'text';
        input.value = value;
    } else if (type === 'dropdown') {
        input = document.createElement('select');
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            input.appendChild(optionElement);
        });
        input.value = value;
    } else if (type === 'date') {
        input = document.createElement('input');
        input.type = 'date';
        input.value = value;
    } else if (type === 'number') {
        input = document.createElement('input');
        input.type = 'number';
        input.value = value;
    }
    if (locked) {
        input.disabled = true;
    }
    return input;
}

function displayTable() {
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
    const actionRow = document.createElement('tr');

    tableData.forEach((input, index) => {
        const tdData = document.createElement('td');
        tdData.appendChild(input);
        dataRow.appendChild(tdData);

        const tdAction = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function() {
            removeColumn(index);
        });
        tdAction.appendChild(removeButton);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function() {
            showEditForm(index);
        });
        tdAction.appendChild(editButton);

        const lockCheckbox = document.createElement('input');
        lockCheckbox.type = 'checkbox';
        lockCheckbox.checked = headers[index].locked;
        lockCheckbox.addEventListener('change', function() {
            headers[index].locked = lockCheckbox.checked;
            tableData[index].disabled = lockCheckbox.checked;
            saveTable();
        });
        tdAction.appendChild(lockCheckbox);

        actionRow.appendChild(tdAction);
    });

    tbody.appendChild(dataRow);
    tbody.appendChild(actionRow);
    table.appendChild(tbody);

    tableContainer.appendChild(table);
}

function showEditForm(index) {
    const editFormContainer = document.createElement('div');
    editFormContainer.id = 'edit-form-container';

    const headerNameInput = document.createElement('input');
    headerNameInput.type = 'text';
    headerNameInput.value = headers[index].name;
    editFormContainer.appendChild(headerNameInput);

    const dataEntryTypeSelect = document.createElement('select');
    const textOption = document.createElement('option');
    textOption.value = 'text';
    textOption.textContent = 'Text Input';
    const dropdownOption = document.createElement('option');
    dropdownOption.value = 'dropdown';
    dropdownOption.textContent = 'Dropdown';
    const dateOption = document.createElement('option');
    dateOption.value = 'date';
    dateOption.textContent = 'Date';
    const numberOption = document.createElement('option');
    numberOption.value = 'number';
    numberOption.textContent = 'Number';
    dataEntryTypeSelect.appendChild(textOption);
    dataEntryTypeSelect.appendChild(dropdownOption);
    dataEntryTypeSelect.appendChild(dateOption);
    dataEntryTypeSelect.appendChild(numberOption);
    dataEntryTypeSelect.value = headers[index].type;
    editFormContainer.appendChild(dataEntryTypeSelect);

    const dropdownOptionsInput = document.createElement('input');
    dropdownOptionsInput.type = 'text';
    dropdownOptionsInput.value = headers[index].options.join(', ');
    dropdownOptionsInput.style.display = headers[index].type === 'dropdown' ? 'inline' : 'none';
    editFormContainer.appendChild(dropdownOptionsInput);

    dataEntryTypeSelect.addEventListener('change', function() {
        if (dataEntryTypeSelect.value === 'dropdown') {
            dropdownOptionsInput.style.display = 'inline';
        } else {
            dropdownOptionsInput.style.display = 'none';
        }
    });

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', function() {
        headers[index].name = headerNameInput.value;
        headers[index].type = dataEntryTypeSelect.value;
        if (dataEntryTypeSelect.value === 'dropdown') {
            headers[index].options = dropdownOptionsInput.value.split(',').map(option => option.trim());
        } else {
            headers[index].options = [];
        }
        tableData[index] = createDataEntryField(headers[index].type, tableData[index].value, headers[index].options, headers[index].locked);
        displayTable();
        saveTable();
        document.getElementById('edit-form-container').remove();
    });
    editFormContainer.appendChild(saveButton);

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function() {
        document.getElementById('edit-form-container').remove();
    });
    editFormContainer.appendChild(cancelButton);

    document.body.appendChild(editFormContainer);
}

function removeColumn(index) {
    headers.splice(index, 1);
    tableData.splice(index, 1);
    displayTable();
    saveTable();
}

function saveTable() {
    const tableStructure = {
        headers: headers,
        data: tableData.map(input => input.value)
    };

    fetch('http://localhost:3000/api/tables', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableStructure)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Table saved:', data);
        fetchTables(); // Fetch and display the saved tables
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to save table');
    });
}

function fetchTables() {
    fetch('http://localhost:3000/api/tables')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.length > 0) {
            const lastTable = data[data.length - 1];
            headers = lastTable.headers;
            tableData = lastTable.data.map((value, index) => createDataEntryField(headers[index].type, value, headers[index].options, headers[index].locked));
            displayTable();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to fetch tables');
    });
}

// Fetch and display the saved tables when the page loads
document.addEventListener('DOMContentLoaded', fetchTables);