
<?php
	$inData = getRequestInfo();
    $rsoId = $inData["rsoId"];
	$userId = $inData["userId"];
    $type = $inData["type"];

    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = $type == "a" ? "INSERT into rsomembers (RSOID, UserID) VALUES(?,?)" : "DELETE FROM rsomembers WHERE RSOID = ? AND UserID = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("ii", $rsoId, $userId);

		if ($stmt->execute())
        {
			$sql2 = $type == "a" ? "UPDATE rso SET members = members + 1 WHERE RSOID = ?" : "UPDATE rso SET members = members - 1 WHERE RSOID = ?";
            $stmt = $conn->prepare($sql2);
			$stmt->bind_param("i", $rsoId);
			
			if ($stmt->execute()){
				$stmt->close();
				$conn->close();
				http_response_code(200);
				returnWithError("");
			}else{
				$stmt->close();
				$conn->close();
				http_response_code(409);
				returnWithError("Could not update members");
			}
        }
        else
        {
            $stmt->close();
            $conn->close();
            http_response_code(400);
            returnWithError("Could not add/delete member");
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