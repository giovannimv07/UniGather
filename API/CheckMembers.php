
<?php
	$inData = getRequestInfo();
	$user1 = $inData["user1"];
	$user2 = $inData["user2"];
	$user3 = $inData["user3"];
	$user4 = $inData["user4"];
    // $uniId = $inData["uniId"];
    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        // echo "UserIDs: $user1, $user2, $user3, $user4\n";
        // echo "UniID: $uniId\n";
        $sql = "SELECT uniID
        FROM unimembers
        WHERE userID IN (?, ?, ?, ?)
        GROUP BY uniID
        HAVING COUNT(DISTINCT userID) = 4";
        // echo "SQL Query: $sql\n";
		$stmt = $conn->prepare($sql);
		// $stmt->bind_param("iiiii", $user1, $user2, $user3, $user4, $uniId);
		$stmt->bind_param("iiii", $user1, $user2, $user3, $user4);
        $stmt->execute();
        $result = $stmt->get_result();
        // Debugging output
        // echo "Number of rows: " . $result->num_rows ."\n";
		if ($result->num_rows == 1)
		{
			$stmt->close();
			$conn->close();
			http_response_code(200);
            returnWithInfo(1);
		}
		else
		{
			$stmt->close();
			$conn->close();
            http_response_code(200);
			returnWithInfo(0);
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

    function returnWithInfo($valid)
	{
		$retValue = '{"valid":' . $valid . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>