<div class="modal" id="gradeGameModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div id="gm_modal" class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <span id="gm_sport"></span>&nbsp;<span id="gm_subSport"></span>&nbsp;-&nbsp;
                <span id="gm_gameDateTime"></span>&nbsp;-&nbsp;
                <span id="gm_teamA"></span>&nbsp;<span>vs</span>&nbsp;<span id="gm_teamH"></span>&nbsp;-&nbsp;
                <span id="gm_periodDesc"></span> 
            </div>
            <div id="gm_modalBody" class="modal-body">
                <form id="gm_form" name="gm_form" method="post" action="">
                <div class="left2">
                    <div class="tablesContainer">
                        <table id="scoresTable">
                            <tr>
                                <th>Teams</th>
                                <th>EOP</th>
                                <th>Pts</th>
                            </tr>
                            <tr>
                                <td>
                                    <span id="teamAgradeGame"></span>&nbsp;&nbsp;-&nbsp;&nbsp;<span name="pitcherAgrade" id="pitcherAgrade"></span>
                                </td>
                                <td class="scoreGradeModalTd">
                                    <input type="text" class="form-control" id="gm_scoreA" name=gm_"scoreA" size="2" onkeydown="return validateNumberScore(event)" onkeyup="calculateGamePoints(this, 'A')"/>
                                    <input type="hidden" name="gm_ptsA" id="gm_ptsA" value=""/>
                                </td>
                                <td class="pointsGradeModalTd">
                                    <span class="pointsModalSpan" id="gm_pointsA" name="gm_pointsA" >&nbsp;</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span id="teamHgradeGame"></span>&nbsp;&nbsp;-&nbsp;&nbsp;<span name="pitcherHgrade" id="pitcherHgrade" ></span>
                                </td>
                                <td class="scoreGradeModalTd">
                                    <input type="text" class="form-control" id="gm_scoreH" name="gm_scoreH" size="2" onkeydown="return validateNumberScore(event)" onkeyup="calculateGamePoints(this, 'H')"/>
                                    <input type="hidden" name="gm_ptsH" id="gm_ptsH" value=""/>
                                </td>
                                <td class="pointsGradeModalTd">
                                    <span id="gm_pointsH" name="gm_pointsH">&nbsp;</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="checkboxCenter">
                        <label for="cancelGradeGameModal" class="label-control">Cancel&nbsp;</label>
                        <input type="checkbox" name="cancelGradeGameModal" id="cancelGradeGameModal"/>
                    </div>
                    <label for="" class="label-control">Commnents</label><br/>
                    <textarea class="taSize" name="gradeComments" id="gradeComments" cols="50" rows="3"></textarea>
                </div>
                <div class="right2">
                    <div class="tablesContainer">
                        <table id="gradeNoActionTable" class="gradeNoActionTable">
                            <tr>
                                <th></th>
                                <th>No Action</th>
                                <th>Grade</th>
                            </tr>
                            <tr>
                                <td><label for="" class="label-control labelWidth2">Spread</label></td>
                                <td class="checkboxTd"><input type="checkbox" id="gm_spread_na" name="gm_spreadAction" value="C" class="inlineElement" onclick="gradeNoactionSelection(this.id)"/></td>
                                <td class="checkboxTd"><input type="checkbox" id="gm_spread_g" name="gm_spreadAction" value="A" class="inlineElement" onclick="gradeNoactionSelection(this.id)"/></td>
                            </tr>
                            <tr>
                                <td><label for="" class="label-control labelWidth2">MoneyLine</label></td>
                                <td class="checkboxTd"><input type="checkbox" id="gm_money_na" name="gm_moneyAction" value="C"class="inlineElement" onclick="gradeNoactionSelection(this.id)"/></td>
                                <td class="checkboxTd"><input type="checkbox" id="gm_money_g" name="gm_moneyAction" value="A" class="inlineElement" onclick="gradeNoactionSelection(this.id)"/></td>
                            </tr>
                            <tr>
                                <td><label for="" class="label-control labelWidth2">Total Points</label></td>
                                <td class="checkboxTd"><input type="checkbox" id="gm_total_na" name="gm_totalAction" value="C"class="inlineElement" onclick="gradeNoactionSelection(this.id)"/></td>
                                <td class="checkboxTd"><input type="checkbox" id="gm_total_g" name="gm_totalAction" value="A" class="inlineElement" onclick="gradeNoactionSelection(this.id)"/></td>
                            </tr>
                        </table>
                    </div>
                    <br/>
                    <div id="ajustedLineDiv">
                        <table>
                            <tr>
                                <th></th>
                                <th>Away</th>
                                <th>Home</th>
                            </tr>
                            <tr>
                                <td><label class="label-control">Ajusted Line:&nbsp;</label></td>
                                <td><input type="text" class="form-control" name="gm_ajustLineA" id="gm_ajustLineA" size="3" readonly/></td>
                                <td><input type="text" class="form-control" name="gm_ajustLineH" id="gm_ajustLineH" size="3" readonly/></td>
                            </tr>
                        </table>
                    </div>
                    <br/>
                    <label for="" class="label-control">Daily Figure Date</label>
                    <div class="input-group date form_date" id='gm_dailyFigureDate' data-date="" data-date-format="mm-dd-yyyy" data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
                        <input class="form-control" id="gm_input_dailyFigure" size="16" type="text" value="" readonly required>
                        <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
                    </div>
                </div>
                <input type="hidden" name="gm_rotNum" id="gm_rotNum" value=""/>
                <input type="hidden" name="gm_periodNumber" id="gm_periodNumber" value=""/>
                <input type="hidden" name="gameNumRedirect" id="gameNumRedirect" value=""/>
                </form>
            </div>
            
            <div class="modal-footer">
                <button id="cancelScheduleGrade" name="cancelScheduleGrade" type="button" class="btn btn-danger" data-dismiss="modal">
                    Cancel
                </button>
                <button id="gotoPropsGrade" name="gotoPropsGrade" type="button" class="btn btn-info">
                    Go to Props
                </button>
                <button id="confirmScheduleGrade" name="confirmScheduleGrade" type="button" class="btn btn-success">
                    Grade
                </button>
            </div>
        </div>
    </div>
</div>

