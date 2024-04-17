
<?php
	$inData = getRequestInfo();
	$uniId = $inData["uniId"];
    $searchResults = "";
	$uniInfo = "";
	$searchCount = 0;

    $conn = new mysqli("localhost", "Admins", "COP4710", "unigather");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        // $sql = "SELECT
        // university.Name,
		// university.Location,
		// university.Description,
		// university.UniStudents,
        // rso.RSOID,
		// rso.RSOName,
		// rso.RSODescription,
		// rso.Members
        // FROM
        // university
        // JOIN
        // rso ON university.UniID = rso.UniID
        // WHERE
        // university.UniID LIKE ? ";
		$sql = "SELECT
		university.Name,
		university.Location,
		university.Description,
		university.UniStudents,
		rso.RSOID,
		rso.RSOName,
		rso.RSODescription,
		rso.Members
		FROM
		university
		LEFT JOIN
		rso ON university.UniID = rso.UniID
		WHERE
		university.UniID LIKE ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $uniId);
		$stmt->execute();
		$result = $stmt->get_result();

        while($row = $result->fetch_assoc())
        {
            if ($searchCount > 0){
				$searchResults .= ",";
			}
			if ($searchCount == 0){
				$uniInfo = '{"name":"' . $row["Name"] . '","location":"' . $row["Location"] . '","description":"' . $row["Description"] . '","students":' . $row["UniStudents"] . '}';
			}
			$searchCount++;
			if(!($row['RSOID'] == null)){
				$searchResults .='{"rsoId":' . $row["RSOID"] . ',"name":"' . $row["RSOName"] . '","description":"' . $row["RSODescription"] . '","students":' . $row["Members"] . '}';
			}
        }

		if($searchCount == 0){
			http_response_code(409);
			returnWithError("No Records Found");
		}
		else{
			http_response_code(200);
			returnWithInfo($searchResults, $uniInfo);
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
	
	function returnWithInfo($searchResults, $uniInfo)
	{
		$retValue = '{"uniInfo":[' . $uniInfo . '],"rsos":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>