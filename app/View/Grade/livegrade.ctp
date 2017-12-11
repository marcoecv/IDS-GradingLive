<?php
echo $this->Html->css('grade');
echo $this->Html->script('grade/livegrade');
echo $this->Html->script('grade/subtypeids');
echo $this->Html->script('grade/scoreUpdater');
echo $this->Html->script('grade/subTypeIdsFeed');
?>
<?php echo $this->element('maintheader', array("pagename" => "Grade Game / Contest")); ?>
<?php echo $this->element('grade/livegradeaditionalinfo'); ?>

<div class="mainConteiner center">
    <form id="gameLiveGradeFiltersFrm" action="#" role="form" class="form-inline" method="post">
        <div id="gameLiveGradeFilters" class="form-group">
            <label for="sportLiveGradeFilter" class="control-label labelWidth">Sport:</label>
            <select name="sportLiveGradeFilter" id="sportLiveGradeFilter" class="form-control inlineElement ">
                <option value=""></option>
                <?php foreach ($sports as $sport) { ?>
                    <option value="<?= $sport['SportType'] ?>"><?= $sport['SportType'] ?></option>
                    <?php
                }
                ?>
            </select>
            <label for="subsportLiveGradeFilter" class="control-label labelWidth">Sub Sport:</label>
            <select name="subsportLiveGradeFilter" id="subsportLiveGradeFilter" class="form-control inlineElement">
                <option value=""></option>
            </select>
            <label for="input_dateFrom" class="control-label labelWidth">Game Date: </label>
            <div class="input-group date form_date elementSize" id='glg_gameDateDiv' data-date="" data-date-format="mm-dd-yyyy" data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
                <input class="form-control" id="glg_gameDate"size="10" type="text" value="" readonly required>
                <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
            </div>
            <label class="label-control  labelWidth2" for="gamesToLiveGradeFilter">Game:&nbsp;</label>
            <select id="glg_liveGames" name="glg_liveGames" class="form-control" style="width: 300px;">
                <option value=""></option>
            </select>
            <div class='glg_addon'>
                <input type='checkbox' name="glg_clearBetStatus" id="glg_clearBetStatus"/>&nbsp;<label class='' for='glg_clearBetStatus'>Active</label>
            </div>
            <button type="button" style="float: right" class="btn btn-info" name="glg_getGamePropsInfo" id="glg_getGamePropsInfo">Submit</button>
        </div>

        <div class="glg_bordered-div">
            <div id="glg_floatLeft">
                <table id="glg_gradeGame">
                    <tr>
                        <td><input type="text" class="form-control" size="35" disabled id="glg_awayTeam" value=""></td>
                        <td><input type="text" class="form-control" name="glg_awayTeamScore" id="glg_awayTeamScore" size="4"/></td>
                        <td><button type="button" class="btn btn-success inlineElement" id="glg_gradeGameButton" onclick="gradeLiveGame()">Grade</button></td>
                    </tr>
                    <tr>
                        <td><input type="text" class="form-control" size="35"disabled id="glg_homeTeam" value=""></td>
                        <td><input type="text" class="form-control" name="glg_homeTeamScore" id="glg_homeTeamScore" size="4"/></td>
                        <td><button type="button" class="btn btn-info" name="glg_more" id="glg_more" style="width: 65px" onclick="openLiveGradeAditionalInfoModal()"><i class="glyphicon glyphicon-plus"></i></button></td>
                    </tr>
                </table>
                <input type="hidden" name="glg_actionSP" id="glg_actionSP" value="A"/>
                <input type="hidden" name="glg_actionML" id="glg_actionML" value="A"/>
                <input type="hidden" name="glg_actionTL" id="glg_actionTL" value="A"/>
                <input type="hidden" name="glg_cancel" id="glg_cancel" value=""/>
                <input type="hidden" name="glg_fd" id="glg_fd" value=""/>
                <input type="hidden" name="glg_gameDateTime" id="glg_gameDateTime" value=""/>
                <input type="hidden" name="glg_rot" id="glg_rot" value=""/>
                <input type="hidden" name="glg_gameNum" id="glg_gameNum" value=""/>
            </div>
            <div id="glg_floatCenter">
                <table id="glg_scoreBoard">
                    <thead>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
            <div id="glg_floarRight">
                <center>
                    <button type="button" class="btn btn-info" id="glg_gradePendingProps">Check Pending Props</button>
                    <button type="button" class="btn btn-success" id="glg_gradeReadyProps">Grade clear bet props</button>
                    <button type="button" class="btn btn-warning" id="glg_deleteMarkets">Delete Clearbets</button>
                </center>
            </div>
        </div>
        <center>
            <div id="colorsDiv">
                <div class="colorDivContainer">
                    <label style="display: inline; margin-right: 5px;">Not Ended</label><div class="notEndetDiv">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                </div>
                <div class="colorDivContainer">
                    <label style="display: inline; margin-right: 5px;">Ready To Grade</label><div class="rtgradeDiv">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                </div> 
                <div class="colorDivContainer">
                    <label style="display: inline; margin-right: 5px;">Processing Grading</label><div class="processGradeDiv">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                </div> 
                <div class="colorDivContainer">
                    <label style="display: inline; margin-right: 5px;">Graded</label><div class="gradedDiv">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                </div> 
            </div>
        </center>
        <div id="glg_periodsFilter">
            <table id="glg_periodsFilterTable">
            </table>
        </div>
        <div id="glg_betRadarGames" >
            <div class="tabbable"> 
                <ul id="glg_propsSheeds" class="nav nav-tabs radius">
                </ul>
                <div id="glg_tabs" class="tab-content">
                </div>
            </div>
        </div>
        <div id="glg_donBestGames" style="display: none">
            <div class="tabbable"> 
                <ul id="glg_propsSheeds" class="nav nav-tabs radius">
                </ul>
                <div id="glg_tabs" class="tab-content">
                </div>
            </div>
        </div>
    </form>
</div>