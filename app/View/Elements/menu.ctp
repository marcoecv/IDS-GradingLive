<div class="btn-group">
    <a class="btn 
    <?= strpos($_SERVER["REQUEST_URI"], 'gradels') ? 'btn-menu-selected' : 'btn-menu' ?> 
       menu-group-value" type="button" href="<?php echo $this->Html->url(array('controller' => 'grade', 'action' => 'livegradels')) ?>">Live</a>
</div>
<div class="btn-group">
    <a class="btn 
    <?= strpos($_SERVER["REQUEST_URI"], 'Pregame') ? 'btn-menu-selected' : 'btn-menu' ?> 
       menu-group-value" type="button" href="<?php echo $this->Html->url(array('controller' => 'gradePregame', 'action' => 'gradepregame')) ?>">Pregame</a>
</div>