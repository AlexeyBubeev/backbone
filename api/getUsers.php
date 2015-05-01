<?php
getUsers();
function getUsers() {
    $sql = 'SELECT u.id, u.first_name, u.last_name, u.middle_name, d.name as department_name, u.job, DATE_FORMAT(u.birthday,\'%d.%m.%Y\') as birthday, u.birthplace, u.department_id as dep_id FROM users u JOIN department d ON u.department_id = d.id';
    try {
        $db = getConnection();
        $dbh = $db->query($sql);
        $users = $dbh->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        $niceiam = array();
        foreach($users as $row) {
            $niceiam[] = array(
                user_id => $row->id,
                first_name => $row->first_name,
                last_name => $row->last_name,
                middle_name => $row->middle_name,
                department_name => $row->department_name,
                job => $row->job,
                birthday => $row->birthday,
                birthplace => $row->birthplace
            );
        }
        echo json_encode($users);
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