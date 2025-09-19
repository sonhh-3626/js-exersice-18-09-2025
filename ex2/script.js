import { initAuth } from './login.js';

document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');
    const studentTableBody = document.querySelector('#studentTable tbody');

    let students = JSON.parse(localStorage.getItem('students')) || [];

    let renderStudents = () => {
        studentTableBody.innerHTML = '';
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-2 text-left text-gray-500">${student.id}</td>
                <td class="p-2 text-left text-gray-500">${student.name}</td>
                <td class="p-2 text-left text-gray-500">${student.birthday}</td>
                <td class="p-2 text-left text-gray-500">${student.phoneNumber}</td>
            `;
            studentTableBody.appendChild(row);
        });
    };

    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('id').value.trim();
        const name = document.getElementById('name').value.trim();
        const birthday = document.getElementById('birthday').value;
        const phoneNumber = document.getElementById('phoneNumber').value.trim();

        if (!validateForm(id, name, birthday, phoneNumber)) {
            return;
        }

        const existingIndex = checkExistingStudent(students, id);
        if (existingIndex !== -1) {
            students[existingIndex] = { id, name, birthday, phoneNumber };
        } else {
            students.push({ id, name, birthday, phoneNumber });
        }
        localStorage.setItem('students', JSON.stringify(students));
        renderStudents();
        studentForm.reset();
    });

    initAuth(renderStudents);
});

function validateForm(id, name, birthday, phoneNumber) {
    if (!id || !name || !birthday || !phoneNumber) {
        alert('Please fill in all fields.');
        return false;
    }

    if (!validateName(name)) {
        alert('Name must be between 5 and 15 characters.');
        return false;
    }

    if (!validateAge(birthday)) {
        alert('Student must be older than 18.');
        return false;
    }

    if (!validatePhoneNumber(phoneNumber)) {
        alert('Phone number must be 10 or 11 digits, start with 0, and contain only numbers.');
        return false;
    }

    return true;
}

function validateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    return age > 18;
}

function validateName(name) {
    return name.length >= 5 && name.length <= 15;
}

function validatePhoneNumber(phoneNumber) {
    if (phoneNumber.length < 10 || phoneNumber.length > 11) {
        return false;
    }

    if (phoneNumber[0] !== '0') {
        return false;
    }

    for (let char of phoneNumber) {
        if (isNaN(char)) {
            return false;
        }
    }
    return true;
}

function checkExistingStudent(students, id) {
    return students.findIndex(student => student.id === id);
}
