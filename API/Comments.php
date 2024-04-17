
<?php
	$inData = getRequestInfo();
    // $eventId = $inData["eventId"]
    // $userId = $inData["userId"]
    // $commentId = $inData["commentId"]
    // $eventName = $inData["eventName"];
	$eventId = $inData["eventId"];
    $searchResults = "";
	$eventInfo = "";
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
		events.Description,
		events.Date,
		events.Start,
		events.End,
		events.LocID,
		events.Phone,
		users.FirstName,
		users.UserID,
		comment.Text,
		comment.Rating,
		location.LocName
	FROM
		events
	LEFT JOIN
		comment ON events.EventID = comment.EventID
	LEFT JOIN
		users ON users.UserID = comment.UserID
	JOIN
		location ON location.LocID = events.LocID
	WHERE
		events.EventID = ?";
		$stmt = $conn->prepare($sql);
		// $stmt->bind_param("si", $eventName, $eventId);
		$stmt->bind_param("i",$eventId);
		$stmt->execute();
		$result = $stmt->get_result();

        while($row = $result->fetch_assoc())
        {
            if ($searchCount > 0){
				$searchResults .= ",";
			}
			if ($searchCount == 0){
				$eventInfo = '{"eventId":' . $row["EventID"] . ',"eventName":"' . $row["Name"] . '","location":"' . $row["LocName"] . '","date":"' . $row["Date"] . '","start":"' . $row["Start"] . '","end":"' . $row["End"] . '","description":"' . $row["Description"] . '","phone":"' . $row["Phone"] . '"}';
			}
			$searchCount++;
			if(!($row['UserID'] == null)){
			$searchResults .='{"userId":' . $row["UserID"] . ',"firstName":"' . $row["FirstName"] . '","text":"' . $row["Text"] . '","rating":' . $row["Rating"] . '}';
			}
        }

		if($searchCount == 0){
			http_response_code(409);
			returnWithError("No Records Found");
		}
		else{
			http_response_code(200);
			returnWithInfo($searchResults, $eventInfo);
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
	
	function returnWithInfo($searchResults, $eventInfo)
	{
		$retValue = '{"eventInfo":[' . $eventInfo . '] ,"comments":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>