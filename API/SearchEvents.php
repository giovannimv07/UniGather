<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM events WHERE Name like ? and EventID=?");
		$eventName = "%" . $inData["search"] . "%";
		$stmt->bind_param("ss", $eventName, $inData["eventID"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .='{"EventID" : "' . $row["EventID"]. '","Name" : "' . $row["Name"]. '", "Location" : "' . $row["Location"]. '", "Description" : "' . $row["Description"]. '", "Time" : "' . $row["Time"].'", "Date" : "' . $row["Date"]. '", "Phone" : "' . $row["Phone"]. '"}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Events Found" );
		}
		else
		{
			http_response_code(200);
			returnWithInfo( $searchResults );
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
		$retValue = '{"results":[],"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>