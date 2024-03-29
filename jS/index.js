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
	let currentUser = JSON.parse(localStorage.getItem("currentUser"))
	let headerTitle = document.getElementById("h1_title")
	headerTitle.innerHTML = "Welcome Supervisor " + currentUser.name
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

//* empDash page

function initEmp() {
	let currentUser = JSON.parse(localStorage.getItem("currentUser"))
	let headerTitle = document.getElementById("h1_title")
	headerTitle.innerHTML = "Welcome Supervisor " + currentUser.name
}

function requestFWA() {
	let currentUser = JSON.parse(localStorage.getItem("currentUser"))
	let WT = document.getElementById("workType").value
	let description = document.getElementById("description").value
	let reason = document.getElementById("reason").value

	let temp = {
		workType: WT,
		description: description,
		reason: reason,
		employeeID: currentUser.employeeID,
		departmentID: currentUser.departmentID,
	}
	console.log(temp)
	axios.post("http://localhost:3000/requestFWA", temp).then((res) => {
		alert("FWA Requested")
	})
}

function updateDaily() {
	let currentUser = JSON.parse(localStorage.getItem("currentUser"))
	let location = document.getElementById("location").value
	let date = document.getElementById("date").value
	let workHours = document.getElementById("workHour").value
	let report = document.getElementById("report").value

	date = new Date(date).toISOString().split("T")

	let temp = {
		employeeID: currentUser.employeeID,
		departmentID: currentUser.departmentID,
		date: date,
		workHours: workHours,
		workReport: report,
		workLocation: location,
	}

	axios.post("http://localhost:3000/addDaily", temp).then((res) => {
		alert("update successful")
	})
}

//*supervisor

async function initSup() {
	let currentUser = JSON.parse(localStorage.getItem("currentUser"))
	let headerTitle = document.getElementById("h1_title")
	headerTitle.innerHTML = "Welcome Supervisor " + currentUser.name
	let temp = {
		supervisorID: currentUser.employeeID,
	}

	axios.post("http://localhost:3000/getFWA", temp).then((res) => {
		console.log(res.data.data)

		async function acceptSubmit(reqID, comment) {
			let temp = {
				requestID: reqID,
				comment: comment,
				status: "Approved",
			}
			console.log(temp)
			await axios.post("http://localhost:3000/updateFWA", temp).then((res) => {
				console.log("request has been accepted")
				console.log(res)
				location.reload()
			})
		}
		async function rejectSubmit(reqID, comment) {
			let temp = {
				requestID: reqID,
				comment: comment,
				status: "Rejected",
			}
			console.log(temp)
			await axios.post("http://localhost:3000/updateFWA", temp).then((res) => {
				console.log("request has been rejected")
				console.log(res)
				location.reload()
			})
		}

		let data = res.data.data
		data.map((row, i) => {
			let tr = document.createElement("tr")
			let th = document.createElement("th")
			let td = document.createElement("td")
			let accordion = document.createElement("div")
			accordion.classList.add("accordion")
			let accordionItem = document.createElement("div")
			accordionItem.classList.add("accordion-item")
			let accordionHeader = document.createElement("h2")
			accordionHeader.classList.add("accordion-header")
			let accordionButton = document.createElement("button")
			let accordionCollapse = document.createElement("div")
			let accordionBody = document.createElement("div")
			accordionBody.classList.add("accordion-body")
			let reason = document.createElement("div")
			let description = document.createElement("div")
			let buttonContainer = document.createElement("div")
			let accept = document.createElement("button")
			let reject = document.createElement("button")
			let commentInput = document.createElement("input")
			commentInput.id = "comment" + i
			commentInput.placeholder = "write your comment here"
			commentInput.classList.add("form-control")

			buttonContainer.classList.add("d-grid")
			buttonContainer.classList.add("dgap-2")
			buttonContainer.classList.add("col-6")
			buttonContainer.classList.add("mx-auto")

			accept.style.marginBottom = "28px"
			accept.innerHTML = "Accept"
			accept.classList.add("btn")
			accept.classList.add("btn-primary")
			accept.onclick = () => acceptSubmit(row.requestID, commentInput.value)

			reject.style.marginBottom = "28px"
			reject.innerHTML = "Reject"
			reject.classList.add("btn")
			reject.classList.add("btn-primary")
			reject.onclick = () => rejectSubmit(row.requestID, commentInput.value)

			reason.innerHTML = "Reason: " + row.reason
			description.innerHTML = "Description: " + row.description

			th.style.width = "50px"
			th.innerHTML = row.requestID
			accordionHeader.id = "heading" + i
			accordion.id = "#accordionExample" + i
			accordionCollapse.classList.add("accordion-collapse")
			accordionCollapse.classList.add("collapse")
			accordionCollapse.id = "collapse" + i
			accordionCollapse.setAttribute("aria-labelledby", "heading" + i)
			accordionCollapse.setAttribute("data-bs-parent", "#accordionExample" + i)

			accordionButton.classList.add("accordion-button")
			accordionButton.setAttribute("data-bs-toggle", "collapse")
			accordionButton.setAttribute("data-bs-target", "#collapse" + i)
			accordionButton.setAttribute("aria-controls", "collapse" + i)
			accordionButton.ariaExpanded = true
			accordionButton.innerHTML = "EmployeeID: " + row.employeeID
			buttonContainer.appendChild(accept)
			buttonContainer.appendChild(reject)
			accordionBody.appendChild(description)
			accordionBody.appendChild(reason)
			accordionBody.appendChild(buttonContainer)
			accordionBody.appendChild(commentInput)
			accordionHeader.appendChild(accordionButton)
			accordionItem.appendChild(accordionHeader)
			accordionCollapse.appendChild(accordionBody)
			accordionItem.appendChild(accordionCollapse)
			accordion.appendChild(accordionItem)
			td.appendChild(accordion)
			tr.appendChild(th)
			tr.appendChild(td)
			let ye = document.getElementById("ye")
			ye.appendChild(tr)
		})
	})

	let requests
	let numEmp

	let depTemp = {
		departmentID: currentUser.departmentID,
	}

	await axios.post("http://localhost:3000/GetDepartmentByDepartmentID", depTemp).then((res) => {
		department = res.data.data[0]
		console.log(department)
	})

	await axios.post("http://localhost:3000/getDepartmentEmployee").then((res) => {
		numEmp = res.data
	})

	await axios.post("http://localhost:3000/GetFwaByDepartment", depTemp).then((res) => {
		requests = res.data.data
		console.log(requests)
	})

	document.getElementById("title1").innerHTML =
		department.deptName + " " + numEmp[department.deptID - 1].department + " employees"

	let cont1 = document.getElementById("container1")

	requests.map((req) => {
		let div = document.createElement("div")
		let date = req.requestDate.split("T")
		div.innerHTML = "Employee " + req.employeeID + " request date: " + date[0]
		console.log(req.departmentID)
		cont1.appendChild(div)
	})

	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	let d = new Date()
	let day = d.getDay()
	// let today = d.get()
	function getWeek(fromDate) {
		var sunday = new Date(fromDate.setDate(fromDate.getDate() - fromDate.getDay())),
			result = [new Date(sunday)]
		while (sunday.setDate(sunday.getDate() + 1) && sunday.getDay() !== 0) {
			result.push(new Date(sunday))
		}
		return result
	}
	// usage
	var week = getWeek(d)
	//  console.log(week[0].toISOString().split("T")[0]);

	let dateTemp = [
		{
			date: week[1].toISOString().split("T")[0],
			departmentID: currentUser.departmentID,
		},
		{
			date: week[2].toISOString().split("T")[0],
			departmentID: currentUser.departmentID,
		},
		{
			date: week[3].toISOString().split("T")[0],
			departmentID: currentUser.departmentID,
		},
		{
			date: week[4].toISOString().split("T")[0],
			departmentID: currentUser.departmentID,
		},
		{
			date: week[5].toISOString().split("T")[0],
			departmentID: currentUser.departmentID,
		},
	]

	await axios.post("http://localhost:3000/getDailyDate", dateTemp[0]).then((res) => {
		console.log(res.data.data)
		let respond = res.data.data
		if (respond != []) {
			respond.map((row) => {
				let tr = document.createElement("tr")
				let th = document.createElement("th")
				let tdLoc = document.createElement("td")
				let tdHour = document.createElement("td")
				let tdReport = document.createElement("td")
				let tdCheckBox = document.createElement("td")
				let checkBox = document.createElement("input")
				let body = document.getElementById("body10")

				th.innerHTML = row.employeeID
				tdHour.innerHTML = row.workHours
				tdLoc.innerHTML = row.workLocation
				tdReport.innerHTML = row.workReport
				checkBox.value = row.dailyID
				checkBox.type = "radio"
				checkBox.name = "depID10"
				tdCheckBox.appendChild(checkBox)
				tr.appendChild(tdCheckBox)
				tr.appendChild(th)
				tr.appendChild(tdLoc)
				tr.appendChild(tdHour)
				tr.appendChild(tdReport)
				body.appendChild(tr)
			})

			let cont = document.getElementById("cont10")
			let comment = document.createElement("input")
			let submit = document.createElement("button")
			comment.placeholder = "place you comment here"
			comment.classList.add("form-control")
			comment.style.marginBottom = "28px"
			comment.id = "comment10"
			submit.classList.add("btn")
			submit.classList.add("btn-primary")
			submit.ariaExpanded = true
			submit.innerHTML = "Submit"

			submit.onclick = () => onDailySubmit("10")
			cont.appendChild(comment)
			cont.appendChild(submit)
		}
	})

	await axios.post("http://localhost:3000/getDailyDate", dateTemp[1]).then((res) => {
		console.log(res.data.data)
		let respond = res.data.data
		if (respond != []) {
			respond.map((row) => {
				let tr = document.createElement("tr")
				let th = document.createElement("th")
				let tdLoc = document.createElement("td")
				let tdHour = document.createElement("td")
				let tdReport = document.createElement("td")
				let tdCheckBox = document.createElement("td")
				let checkBox = document.createElement("input")
				let body = document.getElementById("body11")

				th.innerHTML = row.employeeID
				tdHour.innerHTML = row.workHours
				tdLoc.innerHTML = row.workLocation
				tdReport.innerHTML = row.workReport
				checkBox.value = row.dailyID
				checkBox.type = "radio"
				checkBox.name = "depID11"
				tdCheckBox.appendChild(checkBox)
				tr.appendChild(tdCheckBox)
				tr.appendChild(th)
				tr.appendChild(tdLoc)
				tr.appendChild(tdHour)
				tr.appendChild(tdReport)
				body.appendChild(tr)
			})

			let cont = document.getElementById("cont11")
			let comment = document.createElement("input")
			let submit = document.createElement("button")
			comment.placeholder = "place you comment here"
			comment.classList.add("form-control")
			comment.style.marginBottom = "28px"
			comment.id = "comment11"
			submit.classList.add("btn")
			submit.classList.add("btn-primary")
			submit.ariaExpanded = true
			submit.innerHTML = "Submit"

			submit.onclick = () => onDailySubmit("11")
			cont.appendChild(comment)
			cont.appendChild(submit)
		}
	})
	await axios.post("http://localhost:3000/getDailyDate", dateTemp[2]).then((res) => {
		console.log(res.data.data)
		let respond = res.data.data
		if (respond != []) {
			respond.map((row) => {
				let tr = document.createElement("tr")
				let th = document.createElement("th")
				let tdLoc = document.createElement("td")
				let tdHour = document.createElement("td")
				let tdReport = document.createElement("td")
				let tdCheckBox = document.createElement("td")
				let checkBox = document.createElement("input")
				let body = document.getElementById("body12")

				th.innerHTML = row.employeeID
				tdHour.innerHTML = row.workHours
				tdLoc.innerHTML = row.workLocation
				tdReport.innerHTML = row.workReport
				checkBox.value = row.dailyID
				checkBox.type = "radio"
				checkBox.name = "depID12"
				tdCheckBox.appendChild(checkBox)
				tr.appendChild(tdCheckBox)
				tr.appendChild(th)
				tr.appendChild(tdLoc)
				tr.appendChild(tdHour)
				tr.appendChild(tdReport)
				body.appendChild(tr)
			})

			let cont = document.getElementById("cont12")
			let comment = document.createElement("input")
			let submit = document.createElement("button")
			comment.placeholder = "place you comment here"
			comment.classList.add("form-control")
			comment.style.marginBottom = "28px"
			comment.id = "comment11"
			submit.classList.add("btn")
			submit.classList.add("btn-primary")
			submit.ariaExpanded = true
			submit.innerHTML = "Submit"

			submit.onclick = () => onDailySubmit("12")
			cont.appendChild(comment)
			cont.appendChild(submit)
		}
	})
	await axios.post("http://localhost:3000/getDailyDate", dateTemp[3]).then((res) => {
		console.log(res.data.data)
		let respond = res.data.data
		if (respond != []) {
			respond.map((row) => {
				let tr = document.createElement("tr")
				let th = document.createElement("th")
				let tdLoc = document.createElement("td")
				let tdHour = document.createElement("td")
				let tdReport = document.createElement("td")
				let tdCheckBox = document.createElement("td")
				let checkBox = document.createElement("input")
				let body = document.getElementById("body113")

				th.innerHTML = row.employeeID
				tdHour.innerHTML = row.workHours
				tdLoc.innerHTML = row.workLocation
				tdReport.innerHTML = row.workReport
				checkBox.value = row.dailyID
				checkBox.type = "radio"
				checkBox.name = "depID13"
				tdCheckBox.appendChild(checkBox)
				tr.appendChild(tdCheckBox)
				tr.appendChild(th)
				tr.appendChild(tdLoc)
				tr.appendChild(tdHour)
				tr.appendChild(tdReport)
				body.appendChild(tr)
			})

			let cont = document.getElementById("cont13")
			let comment = document.createElement("input")
			let submit = document.createElement("button")
			comment.placeholder = "place you comment here"
			comment.classList.add("form-control")
			comment.style.marginBottom = "28px"
			comment.id = "comment13"
			submit.classList.add("btn")
			submit.classList.add("btn-primary")
			submit.ariaExpanded = true
			submit.innerHTML = "Submit"

			submit.onclick = () => onDailySubmit("13")
			cont.appendChild(comment)
			cont.appendChild(submit)
		}
	})
	await axios.post("http://localhost:3000/getDailyDate", dateTemp[4]).then((res) => {
		console.log(res.data.data)
		let respond = res.data.data
		if (respond != []) {
			respond.map((row) => {
				let tr = document.createElement("tr")
				let th = document.createElement("th")
				let tdLoc = document.createElement("td")
				let tdHour = document.createElement("td")
				let tdReport = document.createElement("td")
				let tdCheckBox = document.createElement("td")
				let checkBox = document.createElement("input")
				let body = document.getElementById("body14")

				th.innerHTML = row.employeeID
				tdHour.innerHTML = row.workHours
				tdLoc.innerHTML = row.workLocation
				tdReport.innerHTML = row.workReport
				checkBox.value = row.dailyID
				checkBox.type = "radio"
				checkBox.name = "depID14"
				tdCheckBox.appendChild(checkBox)
				tr.appendChild(tdCheckBox)
				tr.appendChild(th)
				tr.appendChild(tdLoc)
				tr.appendChild(tdHour)
				tr.appendChild(tdReport)
				body.appendChild(tr)
			})

			let cont = document.getElementById("cont14")
			let comment = document.createElement("input")
			let submit = document.createElement("button")
			comment.placeholder = "place you comment here"
			comment.classList.add("form-control")
			comment.style.marginBottom = "28px"
			comment.id = "comment14"
			submit.classList.add("btn")
			submit.classList.add("btn-primary")
			submit.ariaExpanded = true
			submit.innerHTML = "Submit"

			submit.onclick = () => onDailySubmit("14")
			cont.appendChild(comment)
			cont.appendChild(submit)
		}
	})

	// 	await let title10 = document.getElementById("title10")
	// 	title10.classList.add("accordion-button")
	// }

	// {
	/* <div class="accordion-body"></div> */
}

async function onDateSelect() {
	let currentUser = JSON.parse(localStorage.getItem("currentUser"))
	let date = new Date(document.getElementById("date1").value)
	let body1 = document.getElementById("body1")
	date = new Date(date).toISOString().split("T")

	let temp1 = {
		date: date[0],
		departmentID: currentUser.departmentID,
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

async function onDailySubmit(val) {
	let radioValue = document.querySelector("input[name=depID" + val + "]:checked").value
	let commentValue = document.getElementById("comment" + val).value

	let dataTemp = {
		dailyID: radioValue,
		comment: commentValue,
	}
	console.log(commentValue)
	console.log(dataTemp)
	if (dataTemp.comment != "") {
		axios.post("http://localhost:3000/commentDaily", dataTemp).then((res) => {
			alert("comment added successfully")
		})
	}
}
