<?php
$timestamp = date('Y-m-d H:i:s O');
$index = $_POST['index'];
$programs = $_POST['ids'];
$times = $_POST['times'];
$infinProgram = $_POST['infinValue'];
$file = "schedule.txt";
$fh = fopen( $file, 'w' );
$carriageReturn = "\n";
fwrite( $fh, $timestamp);
fwrite( $fh, $carriageReturn );
fwrite( $fh, $index );
fwrite( $fh, $carriageReturn );
fwrite( $fh, $programs );
fwrite( $fh, $carriageReturn );
fwrite( $fh, $times );
fwrite( $fh, $carriageReturn );
fwrite( $fh, $infinProgram );
fclose( $fh );

setcookie(CurrentIndex, $index);
setcookie(ProgramTimes, $times);
setcookie(CurrentPrograms, $programs);
?>
