const urlBase = "http://localhost/UniGather/API";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";
let email = "";
let admin = "S";

function showSignup() {
	const loginFields = document.getElementById("loginForm");
	const signUpFields = document.getElementById("signupForm");
	const container = document.getElementById("field-container");
	document.querySelector(".slider").classList.add("moveslider");

	loginFields.style.left = "-500px";
	signUpFields.style.left = "0px";
	container.style.height = "570px";
}

function showLogin() {
	const loginFields = document.getElementById("loginForm");
	const signUpFields = document.getElementById("signupForm");
	const container = document.getElementById("field-container");
	document.querySelector(".slider").classList.remove("moveslider");

	loginFields.style.left = "0px";
	signUpFields.style.left = "500px";
	container.style.height = "500px";
}

function togglePasswordVisibility(check) {
	var input =
		check === "register"
			? document.getElementById("password")
			: document.getElementById("loginPassword");

	if (input.type === "password") {
		input.type = "text";
	} else {
		input.type = "password";
	}
}

document.addEventListener("DOMContentLoaded", function () {
	let register = document.getElementById("registerSelect");
	let login = document.getElementById("loginSelect");
	let slider = document.getElementById("slider");
	let loginPassword = document.getElementById("loginPassword");
	let regPassword = document.getElementById("password");

	if (register && login && slider) {
		register.addEventListener("click", () => {
			slider.classList.add("moveslider");
		});

		login.addEventListener("click", () => {
			slider.classList.remove("moveslider");
		});
	}

	if (loginPassword && regPassword) {
		loginPassword.addEventListener("keydown", function (event) {
			if (event.key === "Enter") {
				doLogin();
			}
		});
		regPassword.addEventListener("keydown", function (event) {
			if (event.key === "Enter") {
				doLogin();
			}
		});
	}
});

function doRegister() {
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	email = document.getElementById("email").value;
	admin = document.querySelector('input[name="role"]:checked').value;

	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;

	document.getElementById("signupResult").innerHTML = "";

	let tmp = {
		firstName: firstName,
		lastName: lastName,
		email: email,
		username: username,
		password: password,
		admin: admin,
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/Register." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	let registerSuccess = false;

	try {
		xhr.onreadystatechange = function () {
			if (this.status == 409) {
				document.getElementById("signupResult").innerHTML =
					"User already exists";
				return;
			}

			if (this.status == 200) {
				if (!registerSuccess) {
					window.alert("User account created!");
					registerSuccess = true;
				}
				showLogin();
			}
		};

		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("signupResult").innerHTML = err.message;
	}
}

function doLogin() {
	userId = 0;
	uniId = 0;
	firstName = "";
	lastName = "";
	admin = 0;

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	let loginResult = document.getElementById("loginResult");

	loginResult.innerHTML = "";
	var tmp = { login: login, password: password };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/Login." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			console.log(this.readyState);
			console.log(this.responseText);
			console.log(this.status);
			console.log(this.responseType);
			if (this.status === 409) {
				loginResult.innerHTML = "User/Password combination incorrect";
				return;
			} else if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.userId;
				uniId = jsonObject.uniId;

				if (userId < 1) {
					loginResult.innerHTML =
						"User/Password combination incorrect";
					return;
				}

				// Store userId in session storage
				sessionStorage.setItem("userId", userId);
				sessionStorage.setItem("uniId", uniId);
				console.log(userId);
				console.log(uniId);

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				email = jsonObject.email;
				admin = jsonObject.admin;

				saveCookie();

				loginResult.innerHTML = "Login successful!";
				window.location.href = "adminDash.html";
			} else {
				loginResult.innerHTML = "Login failed!";
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		loginResult.innerHTML = err.message;
	}
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + minutes * 60 * 1000);
	document.cookie =
		"firstName=" +
		firstName +
		",lastName=" +
		lastName +
		",userId=" +
		userId +
		",email=" +
		email +
		",admin=" +
		admin +
		";expires=" +
		date.toGMTString();
}

document.addEventListener("DOMContentLoaded", function () {
	var studentRadio = document.getElementById("student");
	var adminRadio = document.getElementById("admin");
	var superRadio = document.getElementById("superAdmin");
	var universitySelection = document.getElementById("universitySelection");

	studentRadio.addEventListener("change", function () {
		if (this.checked) {
			universitySelection.style.display = "block";
		} else {
			universitySelection.style.display = "none";
		}
	});

	adminRadio.addEventListener("change", function () {
		if (this.checked) {
			universitySelection.style.display = "block";
		} else {
			universitySelection.style.display = "none";
		}
	});
	superRadio.addEventListener("change", function () {
		if (this.checked) {
			universitySelection.style.display = "none";
		}
	});
});

// function fetchUniversities() {
// 	// Make an AJAX request to fetch universities
// 	let url = urlBase + "/GetUniversities." + extension;
// 	let xhr = new XMLHttpRequest();
// 	xhr.open("GET", url, true);
// 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

// 	xhr.onreadystatechange = function () {
// 		if (this.readyState === 4 && this.status === 200) {
// 			let universities = JSON.parse(xhr.responseText);

// 			// Clear existing options
// 			universitySelect.innerHTML = "";

// 			// Add fetched universities to the select dropdown
// 			universities.forEach(function (university) {
// 				let option = document.createElement("option");
// 				option.value = university.id; // Assuming id and name properties in the JSON response
// 				option.textContent = university.name;
// 				universitySelect.appendChild(option);
// 			});
// 		}
// 	};

// 	xhr.send();
// }
