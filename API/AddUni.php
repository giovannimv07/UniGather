<?php
// Retrieve request data
$inData = getRequestInfo();

// Extract inputs
$name = $inData["name"];
$locID = $inData["locID"];
$description = $inData["description"];
$uniStudents = $inData["uniStudents"];

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
    // Check if the provided LocID exists in the location table
    $checkLocIDSql = "SELECT LocID FROM location WHERE LocID = ?";
    $stmt = $conn->prepare($checkLocIDSql);
    $stmt->bind_param("i", $locID);
    $stmt->execute();
    $resultLocID = $stmt->get_result();

    if ($resultLocID->num_rows > 0) {
        // Check if there is already a university with the same LocID
        $checkUniSql = "SELECT UniID FROM university WHERE LocID = ?";
        $stmt = $conn->prepare($checkUniSql);
        $stmt->bind_param("i", $locID);
        $stmt->execute();
        $resultUni = $stmt->get_result();

        if ($resultUni->num_rows > 0) {
            // University with the same LocID already exists
            $stmt->close();
            $conn->close();
            http_response_code(409);
            returnWithError("University with the same LocID already exists");
        } else {
            // Insert the new university
            $insertUniSql = "INSERT INTO university (Name, LocID, Description, UniStudents) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($insertUniSql);
            $stmt->bind_param("sisi", $name, $locID, $description, $uniStudents);

            if ($stmt->execute()) {
                // University inserted successfully, retrieve the assigned UniID
                $newUniID = $stmt->insert_id;
                $stmt->close();
                $conn->close();
                http_response_code(200);
                sendResultInfoAsJson(array("UniID" => $newUniID));
            } else {
                // Failed to insert university
                $stmt->close();
                $conn->close();
                http_response_code(409);
                returnWithError("Failed to insert university");
            }
        }
    } else {
        // LocID does not exist in location table
        $stmt->close();
        $conn->close();
        http_response_code(404);
        returnWithError("Invalid LocID. Location not found.");
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
