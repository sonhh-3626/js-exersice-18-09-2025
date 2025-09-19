const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const mainContent = document.getElementById('mainContent');
const logoutButton = document.getElementById('logoutButton');

const initializeAdminData = () => {
    if (!localStorage.getItem('admin')) {
        const adminAccounts = [
            { name: 'admin', password: 'Aa@123456' },
            { name: 'admin2', password: 'admin123admin' }
        ];
        localStorage.setItem('admin', JSON.stringify(adminAccounts));
    }
};

const updateUI = (onLoginSuccess) => {
    if (localStorage.getItem('currentUser')) {
        // Nếu đã đăng nhập: ẩn modal, hiện nội dung chính
        loginModal.classList.add('hidden');
        mainContent.classList.remove('hidden');
        if (onLoginSuccess) {
            onLoginSuccess(); // Gọi callback để render danh sách sinh viên
        }
    } else {
        // Nếu chưa đăng nhập: hiện modal, ẩn nội dung chính
        loginModal.classList.remove('hidden');
        mainContent.classList.add('hidden');
    }
};

const handleLogin = (e, onLoginSuccess) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const adminAccounts = JSON.parse(localStorage.getItem('admin'));
    const foundUser = adminAccounts.find(
        user => user.name === username && user.password === password
    );

    if (foundUser) {
        // Đăng nhập thành công
        localStorage.setItem('currentUser', username);
        loginError.textContent = '';
        loginForm.reset();
        updateUI(onLoginSuccess);
    } else {
        // Đăng nhập thất bại
        loginError.textContent = 'Invalid username or password.';
    }
};

const handleLogout = () => {
    localStorage.removeItem('currentUser');
    location.reload();
};

export function initAuth(onLoginSuccess) {
    initializeAdminData();

    loginForm.addEventListener('submit', (e) => handleLogin(e, onLoginSuccess));
    logoutButton.addEventListener('click', handleLogout);

    updateUI(onLoginSuccess);
}
