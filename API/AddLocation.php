<?php
// Retrieve request data
$inData = getRequestInfo();

// Extract inputs
$name = $inData["name"];
$longitude = floatval($inData["longitude"]); // Convert to float for double type
$latitude = floatval($inData["latitude"]); // Convert to float for double type

// Database connection parameters
$servername = "localhost";
$username = "Admins";
$password = "COP4710";
$dbname = "unigather";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    returnWithError("Connection failed: " . $conn->connect_error);
} else {
    // Check if the location already exists
    $checkLocationSql = "SELECT LocID FROM location WHERE LocName = ? AND Longitude = ? AND Latitude = ?";
    $stmt = $conn->prepare($checkLocationSql);
    $stmt->bind_param("sdd", $name, $longitude, $latitude); // Use "sdd" for string, double, double
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Location already exists, return existing LocID
        $row = $result->fetch_assoc();
        returnWithLocID($row["LocID"]);
        // returnWithError("Location already exists");
    } 
    else {
        // Location does not exist, insert new location and return new LocID
        $insertLocationSql = "INSERT INTO location (LocName, Longitude, Latitude) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($insertLocationSql);
        $stmt->bind_param("sdd", $name, $longitude, $latitude); // Use "sdd" for string, double, double
        if ($stmt->execute()) {
            // Successfully inserted new location, retrieve the new LocID
            $newLocID = $stmt->insert_id;
            http_response_code(200);
            returnWithLocID($newLocID);
        } else {
            returnWithError("Failed to insert location");
        }
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function returnWithLocID($locID)
{
    $response = array("LocID" => $locID);
    sendResultInfoAsJson($response);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
