
<?php
	$inData = getRequestInfo();
	$eventId = $inData["eventId"];
    $userId = $inData["userId"];
    $text = $inData["text"];
    $rate = $inData["rating"];
    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = "INSERT into comment (EventID, UserID , Rating, Text) VALUES(?,?,?,?)";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("iiis", $eventId, $userId, $rate, $text);

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
			http_response_code(400);
			returnWithError("Failed to add comment.");
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