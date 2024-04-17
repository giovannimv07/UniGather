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
    $stmtCheckLocID = $conn->prepare($checkLocIDSql);
    $stmtCheckLocID->bind_param("i", $locID);
    $stmtCheckLocID->execute();
    $resultLocID = $stmtCheckLocID->get_result();

    if ($resultLocID->num_rows > 0) {
        // Check if there is already a university with the same LocID
        $checkUniSql = "SELECT UniID FROM university WHERE LocID = ?";
        $stmtCheckUni = $conn->prepare($checkUniSql);
        $stmtCheckUni->bind_param("i", $locID);
        $stmtCheckUni->execute();
        $resultUni = $stmtCheckUni->get_result();

        if ($resultUni->num_rows > 0) {
            // University with the same LocID already exists
            http_response_code(409);
            returnWithError("University with the same LocID already exists");
        } else {
            // Insert the new university
            $insertUniSql = "INSERT INTO university (Name, LocID, Description, UniStudents) VALUES (?, ?, ?, ?)";
            $stmtInsertUni = $conn->prepare($insertUniSql);
            $stmtInsertUni->bind_param("sisi", $name, $locID, $description, $uniStudents);

            if ($stmtInsertUni->execute()) {
                // University inserted successfully, retrieve the assigned UniID
                $newUniID = $stmtInsertUni->insert_id;
                http_response_code(200);
                sendResultInfoAsJson(array("UniID" => $newUniID));
            } else {
                // Failed to insert university
                http_response_code(409);
                returnWithError("Failed to insert university");
            }

            // Close insert statement
            $stmtInsertUni->close();
        }
    } else {
        // LocID does not exist in location table
        http_response_code(404);
        returnWithError("Invalid LocID. Location not found.");
    }

    // Close statements and connection
    $resultLocID->close();
    $stmtCheckLocID->close();
    $stmtCheckUni->close();
    $conn->close();
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
