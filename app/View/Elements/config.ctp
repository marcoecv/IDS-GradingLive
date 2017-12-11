<?php 
$configUpdater="<script>
        var gameLinesQueue, gamesQueue,profitQueue,propLinesQueue,propsQueue,deleteQueue;
            var url = '".Configure::read('updater.ip')."';
            var login = '".Configure::read('updater.user')."';
            var passcode = '".Configure::read('updater.password')."';
        </script>";


echo $configUpdater;

?>