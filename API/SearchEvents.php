<?php
// session_start(); 
	$inData = getRequestInfo();
	$userId = $inData['userId'];
    $searchResults = "";
	$searchCount = 0;

    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = "SELECT e.EventID, e.Name, e.LocID, loc.LocName, e.Description, e.Start, e.End, e.Date, e.Phone
		FROM events e
		INNER JOIN public p ON e.EventID = p.EventID
		INNER JOIN location loc ON e.LocID = loc.LocID
		UNION
		SELECT e.EventID, e.Name, e.LocID, loc.LocName, e.Description, e.Start, e.End, e.Date, e.Phone
		FROM events e
		INNER JOIN private pr ON e.EventID = pr.EventID
		INNER JOIN unimembers um ON pr.UniID = um.UniID AND um.UserID = ?
		INNER JOIN location loc ON e.LocID = loc.LocID
		UNION
		SELECT e.EventID, e.Name, e.LocID, loc.LocName, e.Description, e.Start, e.End, e.Date, e.Phone
		FROM events e
		INNER JOIN rosevent r ON e.EventID = r.EventID
		INNER JOIN rsomembers rm ON r.RSOID = rm.RSOID AND rm.UserID = ?
		INNER JOIN location loc ON e.LocID = loc.LocID		
		";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("ii", $userId, $userId);
		$stmt->execute();
		$result = $stmt->get_result();

        while($row = $result->fetch_assoc())
        {
            if ($searchCount > 0){
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"eventId":"' . $row["EventID"] . '","eventName":"' . $row["Name"] . '","LocID":"' . $row["LocID"] . '","LocationName":"' . $row["LocName"] . '","start":"' . $row["Start"] . '","end":"' . $row["End"] . '","date":"' . $row["Date"] . '","description":"' . $row["Description"] . '","phone":"' . $row["Phone"] . '"}';
        }

		if($searchCount == 0){
			http_response_code(409);
			returnWithError("No events Found");
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
		$retValue = '{"event":[' . $searchResults . '], "error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>