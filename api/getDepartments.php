<?php
getDepartments();
function getDepartments() {
    $sql = "select id, name FROM department ORDER BY name";
    try {
        $db = getConnection();
        $dbh = $db->query($sql);
        $departments = $dbh->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        $niceiam = array();
        foreach($departments as $row) {
            $niceiam[] = array(
                id => $row->id,
                label  => $row->name
            );
        }
        echo json_encode($departments, JSON_UNESCAPED_UNICODE);

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
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