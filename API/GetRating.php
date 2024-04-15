
<?php
	$inData = getRequestInfo();
    $userId = $inData["userId"];
	$eventId = $inData["eventId"];

    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = "SELECT Rating FROM comment WHERE EventID LIKE ? AND UserID LIKE ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("ii", $eventId, $userId);
		$stmt->execute();
		$result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
		{
			http_response_code(200);
			returnWithInfo( $row['Rating']);
		}
		else
		{
			http_response_code(409);
			returnWithError("No Records Found");
		}

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
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($rating,)
	{
		$retValue = '{"rating":' . $rating. '}';
		sendResultInfoAsJson( $retValue );
	}
	
?>