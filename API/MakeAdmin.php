
<?php
	$inData = getRequestInfo();
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = "UPDATE users SET LEVEL = 'A' WHERE UserID=?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $userId);
		if ($stmt->execute())
        {
            $stmt->close();
            $conn->close();
            http_response_code(200);
            returnWithError("");
        }
        else
        {
            $stmt->close();
            $conn->close();
            returnWithError("Could not update user");
        }

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
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}	
?>