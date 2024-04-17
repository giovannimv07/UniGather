<?php
// Retrieve request data
$inData = getRequestInfo();

// Extract LocID input
$locID = $inData["LocID"];

$conn = new mysqli("localhost", "Admins", "COP4710", "unigather");

// Check connection
if ($conn->connect_error) {
    returnWithError("Connection failed: " . $conn->connect_error);
} else {
    // Check if the location exists based on LocID
    $checkLocationSql = "SELECT LocID, Name, Longitude, Latitude FROM location WHERE LocID = ?";
    $stmt = $conn->prepare($checkLocationSql);
    $stmt->bind_param("i", $locID); // Use "i" for integer
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Location found, return the location information
        $row = $result->fetch_assoc();
        http_response_code(200);
        returnWithLocationInfo($row["LocID"], $row["Name"], $row["Longitude"], $row["Latitude"]);
    } else {
        // Location not found
        http_response_code(404); // Use 404 Not Found status for resource not found
        returnWithError("Location not found");
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithLocationInfo($locID, $name, $longitude, $latitude)
{
    // Construct the response JSON string with location details
    $retValue = '{"LocID":' . $locID . ',"Name":"' . $name . '","Longitude":' . $longitude . ',"Latitude":' . $latitude . ',"error":""}';
    sendResultInfoAsJson($retValue);
}


function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
