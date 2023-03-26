// import axios from "axios"

// const { default: axios } = require("axios")

// const {default: axios} = require("axios")

//* for general use
function backHome() {
	location.href = "/index.html"
}

//* index page

async function onLogIn() {
	let email = document.getElementById("email").value
	let password = document.getElementById("password").value
	let response
	let err

	let temp = {
		email: email,
		password: password,
	}

	// send data to backend
	await axios
		.post("http://localhost:3000/login", temp)
		.then((res) => {
			console.log(res)
			response = res.data.data
			localStorage.setItem("currentUser", JSON.stringify(response))
		})
		.catch((res) => {
			err = res
			if (err.response.data.error === "change password") {
				localStorage.setItem(
					"currentUser",
					JSON.stringify({
						email: email,
						password: password,
					})
				)
				location.href = "../newPassword.html"
			} else {
				alert(err.response.data.error)
			}
		})
	//* response
	if (response) {
		switch (response.role) {
			case "admin":
				// redirect to hr
				location.href = "/hrDash.html"
				break
			case "employee":
				// redirect to em
				location.href = "/empDash.html"
				break
			case "supervisor":
				// redirect to sup
				location.href = "/supDash.html"
				break

			default:
				break
		}
	}
}

//* change password page

async function newPassword() {
	let user = JSON.parse(localStorage.getItem("currentUser"))
	let pass1 = document.getElementById("inputPass").value
	let pass2 = document.getElementById("inputPassRe").value

	if (pass1 !== pass2) {
		alert("passwords dont match")
		return
	} else {
		console.log(user)
		let temp = {
			employeeEmail: user.email,
			oldPassword: user.password,
			newPassword: pass1,
		}
		console.log(temp)

		await axios
			.post("http://localhost:3000/changePassword", temp)
			.then((res) => {
				response = res.data.data
				alert("password changed successfully")
				location.href = "/index.html"
			})
			.catch((res) => {
				err = res
				alert(err.response.data.error)
			})
	}
}

//* hrdash page

async function Init() {
	let select = document.getElementById("department")
	let department
	let requests
	let numEmp

	await axios.post("http://localhost:3000/departments").then((res) => {
		department = res.data.data
	})
	let first = document.createElement("option")
	first.innerHTML = "ID-department"
	select.appendChild(first)

	await axios.post("http://localhost:3000/getDepartmentEmployee").then((res) => {
		numEmp = res.data
	})

	await axios.post("http://localhost:3000/getAllFWA").then((res) => {
		requests = res.data.data
	})

	department.map((row) => {
		let op = document.createElement("option")
		op.innerHTML = row.deptID + "-" + row.deptName
		op.value = row.deptID
		select.appendChild(op)
	})

	document.getElementById("title1").innerHTML =
		"Human Resources " + numEmp[0].department + " employees"
	document.getElementById("title2").innerHTML = "Engineering " + numEmp[1].department + " employees"
	document.getElementById("title3").innerHTML = "Finance " + numEmp[2].department + " employees"
	document.getElementById("title4").innerHTML = "Security " + numEmp[3].department + " employees"

	let cont1 = document.getElementById("container1")
	let cont2 = document.getElementById("container2")
	let cont3 = document.getElementById("container3")
	let cont4 = document.getElementById("container4")

	requests.map((req) => {
		let div = document.createElement("div")
		let date = req.requestDate.split("T")
		div.innerHTML = "Employee " + req.employeeID + " request date: " + date[0]
		console.log(req.departmentID)
		switch (req.departmentID) {
			case 1:
				cont1.appendChild(div)
				break
			case 2:
				cont2.appendChild(div)
				break
			case 3:
				cont3.appendChild(div)
				break
			case 4:
				cont4.appendChild(div)
				break
			default:
				break
		}
	})
}

async function onNewEmp() {
	let name = document.getElementById("inputName").value
	let empID = document.getElementById("inputEmpId").value
	let supID = document.getElementById("inputSupID").value
	let DepID = document.getElementById("department").value
	let email = document.getElementById("inputEmail4").value
	let position = document.getElementById("inputPosition").value

	let temp = {
		employeeID: empID,
		email: email,
		supervisorID: supID ? supID : "null",
		name: name,
		position: position,
		departmentID: DepID,
	}

	await axios
		.post("http://localhost:3000/register", temp)
		.then((res) => {
			console.log(res.data.data)
			alert("account registered, password for account is:" + res.data.data.password + "!!!")
		})
		.catch((err) => {
			console.log(err)
		})
}

async function onDateSelect1() {
	let date = new Date(document.getElementById("date1").value)
	let body1 = document.getElementById("body1")
	date = new Date(date).toISOString().split("T")

	let temp1 = {
		date: date[0],
		departmentID: 1,
	}

	await axios.post("http://localhost:3000/getDailyDate", temp1).then((res) => {
		console.log(res.data.data.length)
		if (res.data.data.length == 0) {
			body1.innerHTML = ""
		} else {
			body1.innerHTML = ""
			res.data.data.map((row) => {
				let tr = document.createElement("tr")
				let th = document.createElement("th")
				let tdLoc = document.createElement("td")
				let tdHour = document.createElement("td")
				th.innerHTML = row.employeeID
				tdHour.innerHTML = row.workHours
				tdLoc.innerHTML = row.workLocation
				tr.appendChild(th)
				tr.appendChild(tdLoc)
				tr.appendChild(tdHour)
				body1.appendChild(tr)
			})
		}
	})
}

async function onDateSelect2() {
	let date = new Date(document.getElementById("date2").value)
	let body1 = document.getElementById("body2")
	date = new Date(date).toISOString().split("T")

	let temp1 = {
		date: date[0],
		departmentID: 2,
	}

	await axios.post("http://localhost:3000/getDailyDate", temp1).then((res) => {
		console.log(res.data.data.length)
		if (res.data.data.length == 0) {
			body1.innerHTML = ""
		} else {
			body1.innerHTML = ""
			res.data.data.map((row) => {
				let tr = document.createElement("tr")
				let th = document.createElement("th")
				let tdLoc = document.createElement("td")
				let tdHour = document.createElement("td")
				th.innerHTML = row.employeeID
				tdHour.innerHTML = row.workHours
				tdLoc.innerHTML = row.workLocation
				tr.appendChild(th)
				tr.appendChild(tdLoc)
				tr.appendChild(tdHour)
				body1.appendChild(tr)
			})
		}
	})
}
async function onDateSelect3() {
	let date = new Date(document.getElementById("date3").value)
	let body1 = document.getElementById("body3")
	date = new Date(date).toISOString().split("T")

	let temp1 = {
		date: date[0],
		departmentID: 3,
	}

	await axios.post("http://localhost:3000/getDailyDate", temp1).then((res) => {
		console.log(res.data.data.length)
		if (res.data.data.length == 0) {
			body1.innerHTML = ""
		} else {
			body1.innerHTML = ""
			res.data.data.map((row) => {
				let tr = document.createElement("tr")
				let th = document.createElement("th")
				let tdLoc = document.createElement("td")
				let tdHour = document.createElement("td")
				th.innerHTML = row.employeeID
				tdHour.innerHTML = row.workHours
				tdLoc.innerHTML = row.workLocation
				tr.appendChild(th)
				tr.appendChild(tdLoc)
				tr.appendChild(tdHour)
				body1.appendChild(tr)
			})
		}
	})
}
async function onDateSelect4() {
	let date = new Date(document.getElementById("date4").value)
	let body1 = document.getElementById("body4")
	date = new Date(date).toISOString().split("T")

	let temp1 = {
		date: date[0],
		departmentID: 4,
	}

	await axios.post("http://localhost:3000/getDailyDate", temp1).then((res) => {
		console.log(res.data.data.length)
		if (res.data.data.length == 0) {
			body1.innerHTML = ""
		} else {
			body1.innerHTML = ""
			res.data.data.map((row) => {
				let tr = document.createElement("tr")
				let th = document.createElement("th")
				let tdLoc = document.createElement("td")
				let tdHour = document.createElement("td")
				th.innerHTML = row.employeeID
				tdHour.innerHTML = row.workHours
				tdLoc.innerHTML = row.workLocation
				tr.appendChild(th)
				tr.appendChild(tdLoc)
				tr.appendChild(tdHour)
				body1.appendChild(tr)
			})
		}
	})
}
