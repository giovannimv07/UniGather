<?php
$inData = getRequestInfo();
$userId = "";
$adminLvl = "";


// Connect to the database
$conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
if ($conn->connect_error) {
    // If there's a connection error, return an error
    returnWithError($conn->connect_error);
} 
else {
    // Prepare and execute the SQL query to fetch user data based on userID
    $stmt = $conn->prepare("SELECT UserID, Level FROM users WHERE UserID=?");
    $stmt->bind_param("i", $inData['userId']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc() ) {
        // If user found, fetch the data and return it
        http_response_code(200);
        returnWithInfo($row['UserID'], $row['Level']);
    } else {
        // If no user found with the provided UserID, return an error
        http_response_code(409);
        returnWithError("No user found with the provided UserID.");
    }

    // Close the statement and the database connection
    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send JSON response with error message
function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

// Function to return JSON response with error message
function returnWithError($err)
{
    $retValue = '{"userId":0,"admin":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

// Function to return JSON response with user information
function returnWithInfo($userId, $admin)
{
    $retValue = '{"userId":' . $userId . ',"admin":"' . $admin . '","error":""}';
    sendResultInfoAsJson($retValue);
}
?>
