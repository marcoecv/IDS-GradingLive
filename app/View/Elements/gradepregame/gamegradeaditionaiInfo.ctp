<!--BEGIN MODAL FADE-->
<div class="modal" id="gameGradeInfoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Aditional Info for Grading</h4>
            </div>
            <div class="modal-body" style="height: 300px">
                <div class="leftFloat">
                    <table class="tdCenter">
                        <tr>
                            <td><label for="" class="label-control labelWidth">Cancel</label></td>
                            <td><input type="checkbox" class="inlineElement" id="cancelGrade" name="cancelGrade"/></td>
                        </tr>
                        <tr>
                            <td><label for="reopenGame" class="label-control labelWidth">Re-Open</label></td>
                            <td><input id="reopenGame" type="checkbox" class="inlineElement"/></td>
                        </tr>
                    </table>
                    <span class="separator"></span>
                    <table class="gradeNoActionTable">
                        <tr>
                            <th></th>
                            <th>No Action</th>
                            <th>Grade</th>
                        </tr>
                        <tr>
                            <td><label for="" class="label-control labelWidth2">Spread</label></td>
                            <td><input type="checkbox" id="spread_na" name="spreadAction" class="inlineElement" onclick="gradeNoactionSelection(this.id)"/></td>
                            <td><input type="checkbox" id="spread_g" name="spreadAction" class="inlineElement" onclick="gradeNoactionSelection(this.id)"/></td>
                        </tr>
                        <tr>
                            <td><label for="" class="label-control labelWidth2">MoneyLine</label></td>
                            <td><input type="checkbox" id="money_na" name="moneyAction" class="inlineElement" onclick="gradeNoactionSelection(this.id)"/></td>
                            <td><input type="checkbox" id="money_g" name="moneyAction" class="inlineElement" onclick="gradeNoactionSelection(this.id)"/></td>
                        </tr>
                        <tr>
                            <td><label for="" class="label-control labelWidth2">Total Points</label></td>
                            <td><input type="checkbox" id="total_na" name="totalAction" class="inlineElement" onclick="gradeNoactionSelection(this.id)"/></td>
                            <td><input type="checkbox" id="total_g" name="totalAction" class="inlineElement" onclick="gradeNoactionSelection(this.id)"/></td>
                        </tr>
                    </table>
                </div>   
                <div class="rightFloat">
                    <label for="alAway" class="label-control labelWidth3">Adjusted Line Away:</label>
                    <input type="text" class="form-control inlineElement" name="alAway" id="alAway" style="width: 65px"/>
                    <label for="alHome" class="label-control labelWidth3">Adjusted Line Home:</label>
                    <input type="text" class="form-control inlineElement" name="alHome" id="alHome" style="width: 65px"/>
                    <span class="separator"></span>
                    <label for="" class="label-control">Daily Figure Date</label>
                    <div class="input-group date form_date" id='dailyFigureDate' data-date="" data-date-format="mm-dd-yyyy" data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
                        <input class="form-control" id="input_dailyFigure" size="16" type="text" value="" readonly required>
                        <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
                    </div>
                    <label for="" class="label-control labelWidth">Commnents</label>
                    <textarea class="taSize" name="gradeComments" id="gradeComments"></textarea>
                </div>      
            </div>
            <input type="hidden" name="gradeRotANum" id="gradeRotANum" value=""/>
            <div class="modal-footer">
                <button id="cancelSetGradeInfoButon" name="cancelSetGradeInfoButon" type="button" class="btn btn-danger" data-dismiss="modal">
                    Cancel
                </button>
                <button id="setGradeInfoButon" name="setGradeInfoButon" type="button" class="btn btn-success">
                    Set
                </button>
            </div>
        </div>
    </div>
</div>
<!--END MODAL FADE-->