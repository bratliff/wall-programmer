<?php
$index = $_POST['index'];
$programs = array();
$programs = serialize($_POST['ids']);
$times = array();
$times = serialize($_POST['times']);

$file = "schedule.txt";
$fh = fopen( $file, 'w' );
$carriageReturn = "\n";
fwrite( $fh, $index );
fwrite( $fh, $programs );
fwrite( $fh, $carriageReturn );
fwrite( $fh, $times );
fwrite( $fh, $carriageReturn );
fwrite( $fh, $infinProgram );
fclose( $fh );

echo "{$index}";
echo "{$programs}";
echo "{$times}";

?>
