<?php
saveUsers();

function saveUsers() {
    $data = json_decode(file_get_contents('php://input'), true);
    if($data["fname"]) {
        $sql = "INSERT INTO users (first_name, last_name, middle_name, department_id, job, birthday, birthplace) VALUES (:first_name, :last_name, :middle_name, :department_id, :job, :birthday, :birthplace)";
        try {
            $db = getConnection();
            $dbh = $db->prepare($sql);
            $dbh->bindParam("first_name", $data["fname"]);
            $dbh->bindParam("last_name", $data["lname"]);
            $dbh->bindParam("middle_name", $data["mname"]);
            $dbh->bindParam("department_id", $data["department_id"]);
            $dbh->bindParam("job", $data["job"]);
            $dbh->bindParam("birthday", $data["birthday"]);
            $dbh->bindParam("birthplace", $data["birthplace"]);
            $dbh->execute();
            $data["id"] = $db->lastInsertId();
            $db = null;
            echo json_encode($data);
        }
        catch(PDOException $e) {
            error_log($e->getMessage(), 3, '/var/tmp/php.log');
            echo '{"error":{"text":'. $e->getMessage() .'}}'; 
        }

    }
}
function getConnection() {
    $dbhost="localhost";
    $dbuser="your-user-name";
    $dbpass="your-password";
    $dbname="your-database";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}
?>