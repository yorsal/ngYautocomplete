<?php 
$query = $_GET['query'];
$data = array();
$data[] = array('name'=>$query.'hello world');
$data[] = array('name'=>$query.'hello bady');
echo json_encode($data);
?>