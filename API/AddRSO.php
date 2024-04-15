
<?php
	$inData = getRequestInfo();
	$name = $inData["name"];
    $uniId = $inData["uniId"];
    $info = $inData["info"];
    $members = $inData["members"];
    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = "INSERT into rso (RSOName, UniID, RSODescription, Members) VALUES(?,?,?,?)";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("sisi", $name, $uniId, $info, $members);

		if ($stmt->execute())
		{
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
			returnWithError("Failed to add RSO.");
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