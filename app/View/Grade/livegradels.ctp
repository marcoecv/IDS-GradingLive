<?php
echo $this->Html->css('grade');
echo $this->Html->script('grade/livegradels');
echo $this->Html->script('grade/scoreLSUpdater');
?>
<?php echo $this->element('grade/livegradeaditionalinfo'); ?>
<?php echo $this->element('grade/closeperiodmodal'); ?>
<?php echo $this->element('grade/lsgradeinfomodal'); ?>
<?php echo $this->element('grade/betsinfomodal'); ?>

<?php echo $this->element('maintheader', array("pagename" => "Grading Live")); ?>

<div class="mainConteiner center">
    <form id="gameLiveGradeLSFiltersFrm" action="#" role="form" class="form-inline" method="post">
        <div id="gameLiveGradeLSFilters" class="form-group">
            <label for="sportLiveGradeLSFilter" class="control-label labelWidth">Sport:</label>
            <select name="sportLiveGradeLSFilter" id="sportLiveGradeLSFilter" class="form-control inlineElement ">
                <option value=""></option>
                <?php foreach ($sports as $sport) { ?>
                    <option value="<?= $sport['SportType'] ?>"><?= $sport['SportType'] ?></option>
                    <?php
                }
                ?>
            </select>
            <label for="glgls_gameDate" class="control-label labelWidth">Game Date: </label>
            <div class="input-group date form_date elementSize" id='glgls_gameDateDiv' data-date="" data-date-format="mm-dd-yyyy" data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
                <input class="form-control" id="glgls_gameDate"size="10" type="text" value="" readonly required>
                <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
            </div>
            <label class="label-control  labelWidth2" for="glgls_liveGames">Game:&nbsp;</label>
            <select id="glgls_liveGames" name="glgls_liveGames" class="form-control" style="width: 300px;">
                <option value=""></option>
            </select>
            <label >Filter</label>
            <select id="glgls_filter" class="form-control">
                <option value="1">Non Graded</option>
                <option value="0">Graded</option>
                <option value="2">All</option>
            </select>
            <button type="button" style="float: right" class="btn btn-info" name="glgls_getGamePropsInfo" id="glgls_getGamePropsInfo">Submit</button>
        </div>
        <div id="glgls_scoreBoard">
            <div id="glgls_scoreBoardDiv">
                <table id="glgls_scoreBoardTable">
                    <thead>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
        <div id="glgls_periodsFilter">
            <table id="glgls_periodsFilterTable">
            </table>
        </div>
        <div id="glgls_groupsFilter">
            <table id="glgls_groupsFilterTable">
            </table>
        </div>
        <div class="glg_bordered-div">
            <div id="glgls_floatLeft">
                <table id="glgls_gradeGame">
                    <tr>
                        <td><input type="text" class="form-control" size="35" disabled id="glgls_awayTeam" value=""></td>
                        <td><input type="text" class="form-control" name="glgls_awayTeamScore" id="glgls_awayTeamScore" size="4"/></td>
                        <td><button type="button" class="btn btn-success inlineElement" id="glgls_gradeGameButton" onclick="gradeLiveGame()()">Grade</button></td>
                    </tr>
                    <tr>
                        <td><input type="text" class="form-control" size="35"disabled id="glgls_homeTeam" value=""></td>
                        <td><input type="text" class="form-control" name="glg_homeTeamScore" id="glgls_homeTeamScore" size="4"/></td>
                        <td><button type="button" class="btn btn-info" name="glgls_more" id="glgls_more" style="width: 65px" onclick="openLiveGradeAditionalInfoModal()"><i class="glyphicon glyphicon-plus"></i></button></td>
                    </tr>
                </table>
                <input type="hidden" name="glgls_actionSP" id="glgls_actionSP" value="A"/>
                <input type="hidden" name="glgls_actionML" id="glgls_actionML" value="A"/>
                <input type="hidden" name="glgls_actionTL" id="glgls_actionTL" value="A"/>
                <input type="hidden" name="glgls_cancel" id="glgls_cancel" value=""/>
                <input type="hidden" name="glgls_df" id="glgls_df" value=""/>
                <input type="hidden" name="glgls_gameDateTime" id="glgls_gameDateTime" value=""/>
                <input type="hidden" name="glgls_rot" id="glgls_rot" value=""/>
                <input type="hidden" name="glgls_gameNum" id="glgls_gameNum" value=""/>
            </div>
            <div id="glgls_floatCenter">
                <center>
                    <table id="colorsDivls">
                        <tr>
                            <td class="colorTdContainer">
                                <span class="notEndetDiv">ABC</span><label style="display: inline; margin-left: 5px;">Not Ended</label>
                            </td>
                            <td class="colorTdContainer">
                                <span class="rtgradeDiv">ABC</span><label style="display: inline; margin-left: 5px;">Ready To Grade</label>
                            </td>
                        </tr>
                        <tr>
                            <td class="colorTdContainer">
                                <span class="processGradeDiv">ABC</span><label style="display: inline; margin-left: 5px;">Processing Grading</label>
                            </td>
                            <td class="colorTdContainer">
                                <span class="gradedDiv">ABC</span><label style="display: inline; margin-left: 5px;">Graded</label>
                            </td>
                        </tr>
                    </table>
                </center>
            </div>
            <div id="glgls_floarRight">
                <button type="button" style="width: 170px;" class="btn btn-success" id="glgls_gradeReadyProps">Grade clear bet props</button>
                <button type="button" style="width: 170px;" class="btn btn-warning" id="glgls_deleteMarkets"></i>Delete Clearbets</button><br/>
                <button type="button" style="width: 170px;" class="btn btn-danger" id="glgls_sendToArchive"><i class="glyphicon glyphicon-warning-sign">&nbsp;</i>Archive</button>
                <button type="button" style="width: 170px;" class="btn btn-info" id="glgls_closePeriods"><i class="glyphicon glyphicon-pencil">&nbsp;</i>Edit Score</button>
            </div>
        </div>
        <center>

        </center>
        <div id="glgls_Games">
            <table id="glgls_propsTable"></table>
        </div>

    </form>
</div>