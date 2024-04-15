
<?php
session_start(); 
	$inData = getRequestInfo();
    $searchResults = "";
	$searchCount = 0;

    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = "SELECT e.EventID, e.Name AS eventName, e.LocID, e.Start, e.End, e.Date, e.Description, e.Phone, l.Name AS LocationName, l.Desc AS LocationDesc
		FROM events e
		INNER JOIN location l ON e.LocID = l.LocID";
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
			$searchResults .= '{"eventId":"' . $row["EventID"] . '","eventName":"' . $row["eventName"] . '","LocID":"' . $row["LocID"] . '","LocationName":"' . $row["LocationName"] . '","LocationDesc":"' . $row["LocationDesc"] . '","start":"' . $row["Start"] . '","end":"' . $row["End"] . '","date":"' . $row["Date"] . '","description":"' . $row["Description"] . '","phone":"' . $row["Phone"] . '"}';
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