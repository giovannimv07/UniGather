
<?php
	$inData = getRequestInfo();
	$userId = $inData["userId"];
    $rsoId = $inData["rsoId"];
    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = "SELECT EXISTS(SELECT 1 FROM rsomembers WHERE UserId = ? AND RSOID = ?)";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("ii", $userId, $rsoId);

		if ($stmt->execute())
		{
            $stmt->bind_result($ret);
            $stmt->fetch();
			$stmt->close();
			$conn->close();
			http_response_code(200);
            returnWithInfo($ret);
		}
		else
		{
			$stmt->close();
			$conn->close();
            http_response_code(409);
			returnWithError("No Executable");
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

    function returnWithInfo($member)
	{
		$retValue = '{"member":' . $member . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>