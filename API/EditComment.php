
<?php
	$inData = getRequestInfo();
	$eventId = $inData["eventId"];
    $userId = $inData["userId"];
    $text = $inData["text"];

    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = "UPDATE comment SET Text=? WHERE UserID=? AND EventID=?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("sii", $text, $eventId,$userId);
		$stmt->execute();
		$result = $stmt->get_result();
		if ($stmt->execute())
        {
            $stmt->close();
            $conn->close();
            http_response_code(200);
            returnWithInfo($text);
        }
        else
        {
            $stmt->close();
            $conn->close();
            returnWithError("Could not update contact");
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
		$retValue = '{"eventId":0,"Name":"","firstName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($newComment)
	{
		$retValue = '{"newComment":["' . $newComment . '"], "error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>