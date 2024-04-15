
<?php
	session_start(); 

	$inData = getRequestInfo();
	
	$userId = 0;
	$firstName = "";
	$lastName = "";
	$email = "";
	$admin = "";

    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT UserID,FirstName,LastName,Email,Level FROM users WHERE Login=? AND Password =?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			$_SESSION["userId"] = $row['UserID'];
			http_response_code(200);
			returnWithInfo( $row['UserID'], $row['FirstName'], $row['LastName'], $row['Email'], $row['Level']);
		}
		else
		{
			http_response_code(409);
			returnWithError("No Records Found");
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
		$retValue = '{"userId":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $userId, $firstName, $lastName, $email, $admin)
	{
		$retValue = '{"userId":' . $userId . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email . '","admin":"' . $admin . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>