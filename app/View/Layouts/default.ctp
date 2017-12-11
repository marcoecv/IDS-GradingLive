<?php

$cakeDescription = __d('cake_dev', 'Administrator BookMarkersInc');
$cakeVersion = __d('cake_dev', 'CakePHP %s', Configure::version())
?>
<!DOCTYPE html>
<html>
    <head>
	<?php echo $this->Html->charset(); ?>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">	
        <title>
		<?php echo $cakeDescription ?>:
		<?php echo $title_for_layout; ?>
        </title>
	<?php
        $version='6';
		echo $this->Html->meta('icon');		
		echo $this->Html->css('bootstrap.min.css?v='.$version);
		echo $this->Html->css('bootstrap-theme.min.css?v='.$version);
		echo $this->Html->css('jquery.dataTables.min.css?v='.$version);
		echo $this->Html->css('plugins/bootstrap-datetimepicker.min.css?v='.$version);
		echo $this->Html->css('admin-nav.css?v='.$version);
                echo $this->Html->css('plugins/chosen.min.css?v='.$version);
                
                echo $this->Html->css('validationEngine/css/validationEngine.jquery.css.css?v='.$version);
		echo $this->Html->script('jquery-2.1.1.min.js?v='.$version);		
		echo $this->Html->script('bootstrap.min.js?v='.$version);
		echo $this->Html->script('plugins/jstree.min.js?v='.$version);
		echo $this->Html->script('plugins/bootstrap-datetimepicker.js?v='.$version);
		echo $this->Html->script('admin-nav.js?v='.$version);
                echo $this->Html->script('plugins/validationEngine/js/jquery.validationEngine.js?v='.$version);
                echo $this->Html->script('plugins/validationEngine/js/jquery.validationEngine-en.js?v='.$version);
//              data tables jquery
                echo $this->Html->script('plugins/DataTables/media/js/jquery.dataTables.js?v='.$version);
                echo $this->Html->script('plugins/DataTables/media/js/dataTables.fixedHeader.js?v='.$version);
                
//              STOMP
                echo $this->Html->script('stomp.js?v='.$version);
                
//              chosen jquery
                echo $this->Html->script('plugins/chosen.jquery.min.js?v='.$version);
                
		echo $this->fetch('meta');
		echo $this->fetch('css');
		echo $this->fetch('script');
                
                echo $this -> element('config', array());
             	?>    
    </head>
    <body>
        <div id="container_fluid" class="control-size">	
            <div id="menu">
            	<?php echo $this->element('menu'); ?>
            </div>
            <div id="content">
            	<?php echo $this->fetch('content'); ?>
            </div>
			<div id="footer">
				<?php echo $this->element('controls'); ?>
			</div>
            <div class="clear"></div>
            <input type="hidden" id="baseurl" name="baseurl" value="<?= ($this->Html->url('/')) ? $this->Html->url('/') : '/'; ?>"/>		
        </div>
    </body>
</html>
