
<?php
	$inData = getRequestInfo();
    // $eventId = $inData["eventId"]
    // $userId = $inData["userId"]
    // $commentId = $inData["commentId"]
    $eventName = $inData["eventName"];
    $searchResults = "";
	$searchCount = 0;

    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = "SELECT
        events.EventID,
        events.Name,
        users.FirstName,
        comment.Text
        FROM
        events
        JOIN
        comment ON events.EventID = comment.EventID
        JOIN
        users ON users.UserID = comment.UserID
        WHERE
        events.Name LIKE ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("s", $eventName);
		$stmt->execute();
		$result = $stmt->get_result();


        while($row = $result->fetch_assoc())
        {
            if ($searchCount > 0)
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .='{"eventId":' . $row["EventID"] . ',"name":"' . $row["Name"] . '","firstName":"' . $row["FirstName"] . '","text":"' . $row["Text"] . '"}';
        }

		if($searchCount == 0){
			http_response_code(409);
			returnWithError("No Records Found");
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
		$retValue = '{"eventId":0,"Name":"","firstName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($searchResults)
	{
		$retValue = '{"result":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>