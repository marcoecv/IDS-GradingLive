<?php
echo $this->Html->css('gradepregame');
echo $this->Html->script('gradepregame/gradepregame');
echo $this->Html->script('gradepregame/scoreLSUpdater');
?>
<?php echo $this->element('gradepregame/livegradeaditionalinfo'); ?>
<?php echo $this->element('gradepregame/closeperiodmodal'); ?>
<?php echo $this->element('gradepregame/lsgradeinfomodal'); ?>
<?php echo $this->element('gradepregame/betsinfomodal'); ?>

<?php echo $this->element('maintheader', array("pagename" => "Grading Pregame")); ?>

<div class="col-md-12">
    <div class="box">
        <div class="box-header">
            <div class="row">
                <div class="col-md-2 inlineElement">
                    <label for="pgg_DBFilter" tabindex="2" class="control-label headerLabel">DataBase:</label>
                    <select name="pgg_DBFilter" id="pgg_DBFilter" class="chosen-select headerSelect">
                        <option value="MASTER">MASTER</option>
                        <?php foreach ($dbs as $db) { ?>
                            <option value="<?= $db ?>"><?= $db ?></option>
                            <?php
                        }
                        ?>
                    </select>
                </div>
                <div class="col-md-2 inlineElement">
                    <label for="pgg_sportsFilter" class="control-label headerLabel">Sport:</label>
                    <select name="pgg_sportsFilter" tabindex="2" id="pgg_sportsFilter" class="chosen-select headerSelect">
                        <option value=""></option>
                        <?php foreach ($sports as $sport) { ?>
                            <option value="<?= $sport["SportType"] ?>"><?= $sport["SportType"] ?></option>
                            <?php
                        }
                        ?>
                    </select>
                </div>
                <div class="col-md-2 inlineElement">
                    <label class="label-control headerLabel">SubSport</label>
                    <select id="pgg_subSportFilter" tabindex="2" class="chosen-select headerSelect">
                        <option value=""></option>
                    </select>
                </div>
                <div class="col-md-1">
                    <label for="pgg_gameDate" class="control-label">Game Date: </label>
                </div>
                <div class="col-md-2">
                    <div class="input-group date form_date" id='pgg_gameDateDiv' data-date="" data-date-format="mm-dd-yyyy" data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
                        <input class="form-control" id="pgg_gameDate"size="10" type="text" value="" readonly required>
                        <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
                    </div>
                </div>
                <div class="col-md-2">
                    <table id="colorsDivls">
                        <tr>
                            <td class="colorTdContainer">
                                <span class="notEndetDiv">ABC</span><label style="display: inline; margin-left: 5px;">Not Ended</label>
                            </td>
                            <td class="colorTdContainer">
                                <span class="rtgradeDiv">ABC</span><label style="display: inline; margin-left: 5px;">Ready</label>
                            </td>
                        </tr>
                        <tr>
                            <td class="colorTdContainer">
                                <span class="processGradeDiv">ABC</span><label style="display: inline; margin-left: 5px;">Processing</label>
                            </td>
                            <td class="colorTdContainer">
                                <span class="gradedDiv">ABC</span><label style="display: inline; margin-left: 5px;">Graded</label>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="col-md-1" style="line-height: 50px;">
                    <button type="button"  class="btn btn-info" name="pgg_getGamePropsInfo" id="pgg_getGamePropsInfo">Submit</button>
                </div>
            </div>
        </div>
    </div>
    <div id="pgg_gamesContainerDiv" class="box-body">
    </div>

</div>