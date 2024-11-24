document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
	const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);

        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Email and password cannot be empty.');
            return;
        }

        const data = {
            email: email,
            password: password
        };

        const xhr = new XMLHttpRequest();
        const url = 'http://localhost:8000/api/login';

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (xhr.responseText) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            console.log(response.role);
							alert("Login success");
                            if (response.role === 'jobseeker') {
                                window.location.href = 'http://localhost:8000/dashboard';
                            } else if (response.role === 'company') {
                                window.location.href = 'http://localhost:8000/dashboard';
                            } else {
                                throw new Error('Unknown role');
                            }
                        } catch (error) {
                            alert('An unexpected error occurred.');
                            console.error('Error:', error);
                        }
                    } else {
                        alert('Empty response from server.');
                    }
                } else if(xhr.status === 201){
					const errorResponse = JSON.parse(xhr.responseText);
					alert(errorResponse.error);
					window.location.href = 'http://localhost:8000/dashboard';
				}else if (xhr.status === 401) {
                    alert('Invalid email or password. Please try again.');
                } else {
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        alert(errorResponse.error);
                    } catch (error) {
                        alert('An unexpected error occurred.');
                        console.error('Error:', error);
                    }
                }
            }
        };

        xhr.send(JSON.stringify(data));
    });
});