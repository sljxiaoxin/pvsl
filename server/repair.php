<?php
$arr = array('cardJokerBlack','cardJokerRed');
$idx = 52;
for($j=0;$j<2;$j++){
    $i = $arr[$j];
    echo "'s$i' : {idx:$idx,frame:'$i'},";
    $idx += 1;
    echo "<br>";
}
?>
