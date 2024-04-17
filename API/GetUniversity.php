
<?php
	// $inData = getRequestInfo();
    $searchResults = "";
	$searchCount = 0;

    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = "SELECT Name, UniID FROM university";
		$stmt = $conn->prepare($sql);
		// $stmt->bind_param("si", $eventName, $eventId);
		$stmt->execute();
		$result = $stmt->get_result();

        while($row = $result->fetch_assoc())
        {
            if ($searchCount > 0){
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .='{"uniId":' . $row["UniID"] . ',"name":"' . $row["Name"] . '"}';
        }

		if($searchCount == 0){
			http_response_code(409);
			returnWithError("No universities");
		}
		else{
			http_response_code(200);
			returnWithInfo($searchResults);
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
	
	function returnWithInfo($searchResults)
	{
		$retValue = '{"university":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>