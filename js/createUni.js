
function canCreateUni() {
    let tmp = {
      userId: sessionStorage.getItem("userId"),
      admin: "",
    };
    let jsonPayload = JSON.stringify(tmp);
  
    let url = urlBase + "/AdminLevel." + extension;
  
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      //If user is found
      if (xhr.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        if (jsonObject != null) {
          let admin = jsonObject.admin;
          if (admin == "SA") {
            // If user is admin, toggle the popup form
            toggleUniPopup();
          } else {
            // If user is not admin, show alert
            alert("Only SuperAdmins are allowed to create University profiles.\n"+"You are not authorized.");
          }
        } else {
          // Handle error cases (e.g., server error, invalid response)
          console.error(
            "Error fetching admin level:",
            xhr.status,
            xhr.statusText
          );
        }
      }
    };
  
    // Send the JSON payload to the server
    xhr.send(jsonPayload);
  }