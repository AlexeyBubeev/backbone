<?php
saveUsers();

function saveUsers() {
    $data = $_REQUEST["remove_user_by_id"];
    if($data) {
        $sql = "DELETE FROM users WHERE id=:id";
        try {
            $db = getConnection();
            $dbh = $db->prepare($sql);
            $dbh->bindParam("id", $data);
            $dbh->execute();
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