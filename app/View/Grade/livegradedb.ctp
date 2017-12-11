<?php
echo $this->Html->css('grade');
echo $this->Html->script('grade/livegradedb');
echo $this->Html->script('grade/scoreDBUpdater');
?>
<?php echo $this->element('grade/livegradeaditionalinfo'); ?>
<?php echo $this->element('grade/closeperiodmodal'); ?>
<?php echo $this->element('maintheader', array("pagename" => "Grade Game / Contest Don Best")); ?>

<div class="mainConteiner center">
    <form id="gameLiveGradeDBFiltersFrm" action="#" role="form" class="form-inline" method="post">
        <div id="gameLiveGradeDBFilters" class="form-group">
            <label for="sportLiveGradeDBFilter" class="control-label labelWidth">Sport:</label>
            <select name="sportLiveGradeDBFilter" id="sportLiveGradeDBFilter" class="form-control inlineElement ">
                <option value=""></option>
                <?php foreach ($sports as $sport) { ?>
                    <option value="<?= $sport['SportType'] ?>"><?= $sport['SportType'] ?></option>
                    <?php
                }
                ?>
            </select>
            <label for="glgdb_gameDate" class="control-label labelWidth">Game Date: </label>
            <div class="input-group date form_date elementSize" id='glgdb_gameDateDiv' data-date="" data-date-format="mm-dd-yyyy" data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
                <input class="form-control" id="glgdb_gameDate"size="10" type="text" value="" readonly required>
                <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
            </div>
            <label class="label-control  labelWidth2" for="glgdb_liveGames">Game:&nbsp;</label>
            <select id="glgdb_liveGames" name="glgdb_liveGames" class="form-control" style="width: 300px;">
                <option value=""></option>
            </select>
            <div class='glg_addon'>
                <input type='checkbox' name="glgdb_clearBetStatus" id="glgdb_clearBetStatus"/>&nbsp;<label class='' for='glgdb_clearBetStatus'>Active</label>
            </div>
            <button type="button" style="float: right" class="btn btn-info" name="glgdb_getGamePropsInfo" id="glgdb_getGamePropsInfo">Submit</button>
        </div>
        <div id="glgdb_scoreBoard">
            <div id="glgdb_scoreBoardDiv">
                <table id="glgdb_scoreBoardTable">
                    <thead>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
        <div id="glgdb_periodsFilter">
            <table id="glgdb_periodsFilterTable">
            </table>
        </div>
        <div class="glg_bordered-div">
            <div id="glgdb_floatLeft">
                <table id="glgdb_gradeGame">
                    <tr>
                        <td><input type="text" class="form-control" size="35" disabled id="glgdb_awayTeam" value=""></td>
                        <td><input type="text" class="form-control" name="glgdb_awayTeamScore" id="glgdb_awayTeamScore" size="4"/></td>
                        <td><button type="button" class="btn btn-success inlineElement" id="glgdb_gradeGameButton" onclick="gradeLiveGame()">Grade</button></td>
                    </tr>
                    <tr>
                        <td><input type="text" class="form-control" size="35"disabled id="glgdb_homeTeam" value=""></td>
                        <td><input type="text" class="form-control" name="glg_homeTeamScore" id="glgdb_homeTeamScore" size="4"/></td>
                        <td><button type="button" class="btn btn-info" name="glgdb_more" id="glgdb_more" style="width: 65px" onclick="openLiveGradeAditionalInfoModal()"><i class="glyphicon glyphicon-plus"></i></button></td>
                    </tr>
                </table>
                <input type="hidden" name="glgdb_actionSP" id="glgdb_actionSP" value="A"/>
                <input type="hidden" name="glgdb_actionML" id="glgdb_actionML" value="A"/>
                <input type="hidden" name="glgdb_actionTL" id="glgdb_actionTL" value="A"/>
                <input type="hidden" name="glgdb_cancel" id="glgdb_cancel" value=""/>
                <input type="hidden" name="glgdb_df" id="glgdb_df" value=""/>
                <input type="hidden" name="glgdb_gameDateTime" id="glgdb_gameDateTime" value=""/>
                <input type="hidden" name="glgdb_rot" id="glgdb_rot" value=""/>
                <input type="hidden" name="glgdb_gameNum" id="glgdb_gameNum" value=""/>
            </div>
            <div id="glgdb_floatCenter">
                <center>
                    <table id="colorsDivdb">
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
            <div id="glgdb_floarRight">
                <button type="button" class="btn btn-success" id="glgdb_gradeReadyProps">Grade clear bet props</button>
                <button type="button" class="btn btn-warning" id="glgdb_deleteMarkets"></i>Delete Clearbets</button>
                <button type="button" class="btn btn-danger" id="glgdb_closePeriods"><i class="glyphicon glyphicon-warning-sign">&nbsp;</i>Manual Close</button>
            </div>
        </div>
        <center>

        </center>
        <div id="glgdb_Games">
            <div class="tabbable"> 
                <ul id="glgdb_propsSheeds" class="nav nav-tabs radius">
                    <li class="active glg_tabStyle"><a href="#tab_Spread" data-toggle="tab">Spreads</a></li>
                    <li class="glg_tabStyle"><a href="#tab_Money" data-toggle="tab">Money Lines</a></li>
                    <li class="glg_tabStyle"><a href="#tab_Total" data-toggle="tab">Totals</a></li>
                    <li class="glg_tabStyle"><a href="#tab_Aditional" data-toggle="tab">Aditionals</a></li>
                    <li class="glg_tabStyle"><a href="#tab_All" data-toggle="tab">All</a></li>
                </ul>
                <div id="glgdb_tabs" class="tab-content">
                    <div class='tab-pane active scroll' id='tab_Spread'></div>
                    <div class='tab-pane scroll' id='tab_Money'></div>
                    <div class='tab-pane scroll' id='tab_Total'></div>
                    <div class='tab-pane scroll' id='tab_Aditional'></div>
                    <div class='tab-pane scroll' id='tab_All'></div>
                </div>
            </div>
        </div>

    </form>
</div>