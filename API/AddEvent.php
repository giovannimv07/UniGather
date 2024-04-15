<?php
	$inData = getRequestInfo();
	
	$eventName = $inData["eventName"];
	$location = $inData["location"];
    $description = $inData["description"];
	$time = $inData["time"];
	$date = $inData["date"];
	$phone = $inData["phone"];


	$conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Check for duplicate Event
		$sql = "SELECT EventID FROM events WHERE Location=? AND Time=? AND Date=?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("sss", $location, $time, $date);
		$stmt->execute();
		$result = $stmt->get_result();
		if ($result->num_rows == 0)
		{
			// If no duplicate, add event to the table
			$stmt = $conn->prepare("INSERT into events (Name, Location, Description, Time, Date, Phone) VALUES(?,?,?,?,?,?)");
			$stmt->bind_param("sssssi", $eventName, $location, $description, $time, $date, $phone);
			$stmt->execute();
			$id = $conn->insert_id;
			returnWithError("");
			http_response_code(200);

		} else {
			http_response_code(409);
			returnWithError("Event with the same location, time, and date already exists");
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
	
?>
