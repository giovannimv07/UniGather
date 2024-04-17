
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
		$stmt = $conn->prepare("SELECT u.UserID, u.FirstName, u.LastName, u.Email, u.Level, um.UniID
		FROM users u
		INNER JOIN unimembers um ON u.UserID = um.UserID
		WHERE u.Login=? AND u.Password= ?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			$_SESSION["userId"] = $row['UserID'];
			http_response_code(200);
			returnWithInfo( $row['UserID'], $row['FirstName'], $row['LastName'], $row['Email'], $row['Level'], $row['UniID']);
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
	
	function returnWithInfo( $userId, $firstName, $lastName, $email, $admin, $uni)
	{
		$retValue = '{"userId":' . $userId . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email . '","admin":"' . $admin . '","uniId":"' . $uni . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>