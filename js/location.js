// Checks if location already exists in Location table, return new locID
function checkForLocation(callback) {
	let name = locationData.name;
	let longitude = locationData.longitude;
	let latitude = locationData.latitude;

	// check through AddLocation.php and use the returned userID for location to be added into Events.LocID
	let tmp = {
		name: name,
		longitude: longitude,
		latitude: latitude,
	};
	console.log(tmp);

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/AddLocation." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.onload = function () {
		//If location has issues
		if (xhr.status == 500) {
			document.getElementById("addEventResult").innerHTML =
				"Failed to insert location";
		}
		// else if locID is returned
		else if (xhr.status == 200) {
			let jsonObject = JSON.parse(xhr.responseText);
			if (jsonObject.error) {
				console.log(jsonObject.error);
				return;
			}
			console.log("What is object: " + jsonObject);
			console.log("check for loc: " + jsonObject.LocID);
			callback(jsonObject.LocID);
		} else {
			// Handle error cases (e.g., server error, invalid response)
			console.error(
				"Error fetching admin level:",
				xhr.status,
				xhr.statusText
			);
		}
	};

	xhr.send(jsonPayload);
}

function searchLocation() {}
