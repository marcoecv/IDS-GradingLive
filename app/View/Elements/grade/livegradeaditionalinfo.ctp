<!--BEGIN MODAL FADE-->
<div class="modal" id="liveGradeInfoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Aditional Info for Grading</h4>
            </div>
            <div class="modal-body" style="height: 170px">
                <div class="leftFloat">
                    <table class="gradeNoActionTable">
                        <tr>
                            <th></th>
                            <th>No Action</th>
                            <th>Grade</th>
                        </tr>
                        <tr>
                            <td><label for="" class="label-control labelWidth2">Spread</label></td>
                            <td><input type="checkbox" id="glg_spread_na" name="glg_spreadAction" class="inlineElement" onclick="gradeNoactionLiveSelection(this.id)"/></td>
                            <td><input type="checkbox" id="glg_spread_g" name="glg_spreadAction" class="inlineElement" onclick="gradeNoactionLiveSelection(this.id)"/></td>
                        </tr>
                        <tr>
                            <td><label for="" class="label-control labelWidth2">MoneyLine</label></td>
                            <td><input type="checkbox" id="glg_money_na" name="glg_moneyAction" class="inlineElement" onclick="gradeNoactionLiveSelection(this.id)"/></td>
                            <td><input type="checkbox" id="glg_money_g" name="glg_moneyAction" class="inlineElement" onclick="gradeNoactionLiveSelection(this.id)"/></td>
                        </tr>
                        <tr>
                            <td><label for="" class="label-control labelWidth2">Total Points</label></td>
                            <td><input type="checkbox" id="glg_total_na" name="glg_totalAction" class="inlineElement" onclick="gradeNoactionLiveSelection(this.id)"/></td>
                            <td><input type="checkbox" id="glg_total_g" name="glg_totalAction" class="inlineElement" onclick="gradeNoactionLiveSelection(this.id)"/></td>
                        </tr>
                    </table>
                </div>   
                <div class="rightFloat">
                    <table class="tdCenter">
                        <tr>
                            <td><label for="" class="label-control labelWidth">Cancel</label></td>
                            <td><input type="checkbox" class="inlineElement" id="glg_cancelGrade" name="glg_cancelGrade"/></td>
                        </tr>
                        <tr>
                            <td><label for="glg_reopen" class="label-control labelWidth">Re-Open</label></td>
                            <td><input id="glg_reopen" type="checkbox" class="inlineElement"/></td>
                        </tr>
                    </table>
                    <label for="" class="label-control">Daily Figure Date</label>
                    <div class="input-group date form_date" id='glg_dailyFigureDate' data-date="" data-date-format="mm-dd-yyyy" data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
                        <input class="form-control" id="glg_input_dailyFigure" size="16" type="text" value="" readonly required>
                        <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
                    </div>
                </div>      
            </div>
            <input type="hidden" name="gradeRotANum" id="gradeRotANum" value=""/>
            <div class="modal-footer">
                <button id="glg_cancelSetGradeInfoButon" name="glg_cancelSetGradeInfoButon" type="button" class="btn btn-danger" data-dismiss="modal">
                    Cancel
                </button>
                <button id="glg_setGradeInfoButon" name="glg_setGradeInfoButon" type="button" class="btn btn-success">
                    Set
                </button>
            </div>
        </div>
    </div>
</div>
<!--END MODAL FADE-->