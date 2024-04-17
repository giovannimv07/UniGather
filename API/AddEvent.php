<?php
// Retrieve request data
$inData = getRequestInfo();

// Extract inputs
$name = $inData["Name"];
$locID = $inData["LocID"];
$description = $inData["Description"];
$start = $inData["Start"];
$end = $inData["End"];
$date = $inData["Date"];
$phone = $inData["Phone"];

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
    // Check if the LocID exists in the location table
    $checkLocationSql = "SELECT LocID FROM location WHERE LocID = ?";
    $stmt = $conn->prepare($checkLocationSql);
    $stmt->bind_param("i", $locID); // Assuming LocID is an integer (i) based on your table definition
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // LocID exists in location table, check for event conflicts
        $conflictCheckSql = "SELECT * FROM events WHERE LocID = ? AND Date = ? AND NOT ((End <= ?) OR (Start >= ?))";
        $stmt = $conn->prepare($conflictCheckSql);
        $stmt->bind_param("isss", $locID, $date, $start, $end);
        $stmt->execute();
        $conflictResult = $stmt->get_result();

        if ($conflictResult->num_rows > 0) {
            // Conflict detected, return error
            $stmt->close();
            $conn->close();
            http_response_code(409);
            returnWithError("Event conflicts with existing event");
        } else {
            // No conflicts, proceed with inserting the new event
            $insertEventSql = "INSERT INTO events (Name, LocID, Description, Start, End, Date, Phone) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($insertEventSql);
            $stmt->bind_param("sisssss", $name, $locID, $description, $start, $end, $date, $phone);

            if ($stmt->execute()) {
                // Event inserted successfully
                $newEventID = $stmt->insert_id;
                $stmt->close();
                $conn->close();
                http_response_code(200);
                sendResultInfoAsJson(array("EventID" => $newEventID));
            } else {
                $stmt->close();
                $conn->close();
                http_response_code(409);
                // Failed to insert event
                returnWithError("Failed to insert event");
            }
        }
    } else {
        $stmt->close();
        $conn->close();
        http_response_code(409);
        // LocID does not exist in location table
        returnWithError("LocID does not exist in location table");
    }
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err)
{
    $response = array("error" => $err);
    sendResultInfoAsJson($response);
}
?>