<?php
echo $this->Html->css('grade');
echo $this->Html->script('grade/gradestatus');
?>
<?php echo $this->element('maintheader', array("pagename" => "Grade Status / Contest")); ?>

<div class="mainConteiner center">
    <form id="gradeStatusFiltersFrm" action="#" role="form" class="form-inline" method="post">
        <div id="gradeStatusFilters" class="form-group">
            <label for="gs_sportFilter" class="control-label labelWidth">Sport:</label>
            <select name="gs_sportFilter" id="gs_sportFilter" class="form-control inlineElement ">
                <option value=""></option>
                <?php foreach ($sports as $sport) { ?>
                    <option value="<?= $sport['SportType'] ?>"><?= $sport['SportType'] ?></option>
                    <?php
                }
                ?>
            </select>
            <label for="gs_subsportFilter" class="control-label labelWidth">Sub Sport:</label>
            <select name="gs_subsportFilter" id="gs_subsportFilter" class="form-control inlineElement">
                <option value=""></option>
            </select>
            <label class="control-label labelWidth">Game Date: </label>
            <div class="input-group date form_date elementSize" id='gs_gameDateDiv' data-date="" data-date-format="mm-dd-yyyy" data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
                <input class="form-control" id="gs_gameDate"size="10" type="text" value="" readonly required>
                <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
            </div>
            <label class="label-control  labelWidth2" for="gs_liveGames">Game:&nbsp;</label>
            <select id="gs_liveGames" name="gs_liveGames" class="form-control" style="width: 300px;">
                <option value=""></option>
            </select>
            <button type="button" style="float: right" class="btn btn-info" name="gs_getGradeStatus" id="gs_getGradeStatus">Submit</button>
        </div>
    </form>
</div>
<span id="test" onfocus="alert('f')">TEST</span>
