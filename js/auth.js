const defaultUsers = [
    {
        name: "Admin",
        email: "admin@pawpulse.com",
        password: "admin123",
        role: "admin"
    },
    {
        name: "Staff",
        email: "staff@pawpulse.com",
        password: "staff123",
        role: "staff"
    }
];

function getUsers() {
    const storedUsers = localStorage.getItem("pawpulseUsers");
    if (storedUsers) {
        return JSON.parse(storedUsers);
    }
    localStorage.setItem(
        "pawpulseUsers",
        JSON.stringify(defaultUsers)
    );

    return defaultUsers;
}

function saveUsers(users) {
    localStorage.setItem(
        "pawpulseUsers",
        JSON.stringify(users)
    );
}

function showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    if (!messageElement) {
        return;
    }
    messageElement.textContent = message;
    messageElement.className = "form-message text-" + type;
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document
            .getElementById("loginEmail")
            .value.trim()
            .toLowerCase();

        const password = document
            .getElementById("loginPassword")
            .value;

        if (email === "" || password === "") {
            showMessage(
                "loginMessage",
                "Please enter your email and password.",
                "danger"
            );
            return;
        }

        const users = getUsers();
        const matchedUser = users.find(function (user) {
            return user.email.toLowerCase() === email &&
                   user.password === password;
        });

        if (matchedUser) {

            const currentUser = {
                name: matchedUser.name,
                email: matchedUser.email,
                role: matchedUser.role
            };

            localStorage.setItem(
                "pawpulseCurrentUser",
                JSON.stringify(currentUser)
            );

            showMessage(
                "loginMessage",
                "Login successful! Redirecting...",
                "success"
            );

            window.location.href = "dashboard.html";

        } else {
            showMessage(
                "loginMessage",
                "Invalid email or password. Please try again.",
                "danger"
            );
        }
    });
}
function logoutUser() {
    localStorage.removeItem("pawpulseCurrentUser");
    window.location.href = "index.html";
}