<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$username = $inData["username"];
	$password = $inData["password"];
	$admin = $inData["admin"];
	$uni = $inData["uni"];

	$conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Check for duplicate User
		$sql = "SELECT UserID FROM users WHERE Login=?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("s", $username);
		$stmt->execute();
		$result = $stmt->get_result();
		$rows = mysqli_num_rows($result);
		if ($rows == 0)
		{
			// if no duplicate, add user to table.
			$stmt = $conn->prepare("INSERT into users (FirstName, LastName, Email, Login, Password, Level) VALUES(?,?,?,?,?,?)");
			$stmt->bind_param("ssssss", $firstName, $lastName, $email, $username, $password, $admin);
			if($stmt->execute()){
				$id = $conn->insert_id;
				$stmt = $conn->prepare("INSERT into unimembers (UniID, UserID) VALUES(?,?)");
				$stmt->bind_param("ii", $uni, $id);
				if($stmt->execute()){
					$stmt->close();
					$conn->close();
					returnWithError("");
					http_response_code(200);
				}else{
					$stmt->close();
					$conn->close();
					http_response_code(409);
					returnWithError("Could not add user to uni");
				}
			}else{
				$stmt->close();
				$conn->close();
				http_response_code(409);
				returnWithError("Could not create user");
			}
		} else {
			$stmt->close();
			$conn->close();
			http_response_code(409);
			returnWithError("Username taken");
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