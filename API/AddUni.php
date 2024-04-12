<?php
	$inData = getRequestInfo();
	
	$uniID = $inData["UniID"];
	$uniName = $inData["Name"];
    $description = $inData["Description"];
	$location = $inData["Location"];
	$numStudents = $inData["numStudents"];


	$conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into university (UniID,Name,Location,Description, numStudents) VALUES(?,?,?,?,?)");
		$stmt->bind_param("ssssi", $uniID, $uniName, $location, $description, $numStudents);
		if ($stmt->execute())
		{
            $id = $conn->insert_id;
			$stmt->close();
			$conn->close();
			http_response_code(200);
			returnWithError("");
		}
		else
		{
			$stmt->close();
			$conn->close();
			http_response_code(400);
			returnWithError("Failed to add university.");
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
