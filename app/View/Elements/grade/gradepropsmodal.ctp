<!--BEGIN MODAL FADE-->
<div class="modal" id="gradePropModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Grade Prop</h4>
            </div>
            <div class="modal-body" style="height: 550px">
                <form class="inline-form" action="" style="width: 100%" method="post">
                    <div class="bordered-div">
                        <span id="pgm_Desc1"></span><br/>
                        <span id="pgm_Desc2"></span><br/>
                        <span id="pgm_Desc3"></span><br/>
                        <span id="pgm_propDesc"></span><br/>
                        <span id="pgm_gameDateTime"></span>
                    </div>
                    <span class="separator"></span>
                    <div class="checkboxCenter">
                        <input type="checkbox" name="pgm_enableRegrade" id="pgm_enableRegrade"/>
                        <label for="pgm_enableRegrade" class="label-control inlineElement">Enable re-grading of graded contestans</label>
                    </div>
                    <div class="tablesContainer">
                        <table id="pgm_contestantTable" name="pgm_contestantTable">

                        </table>
                    </div>
                    <span class="separator"></span>
                    <div class="checkboxCenter">
                        <div id="pgm_winBy" class="checkboxCenter"></div>
                        <label class="label-control">Tie Win/loss ratio&nbsp;</label>
                        <input type="text" class="form-control inlineElement" style="width: 50px"id="pgm_wtlRatio" name="pgm_wtlRatio">
                        <label class="label-control">or push&nbsp;</label><input type="checkbox" name="pgm_push" id="pgm_push" class="inlineElement"/><br/>
                        <input type="checkbox" class="" name="pgm_cancel" id="pgm_cancel"/>&nbsp;<label class="label-control inlineElement">Contest Cancel</label>
                    </div>
                    <span class="separator"></span>
                    <div class="left">
                        <label for="" class="label-control">Daily Figure Date</label>
                        <div class="input-group date form_date" id='pgm_dailyFigureDate' data-date="" data-date-format="mm-dd-yyyy" data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
                            <input class="form-control" id="pgm_input_dailyFigure" size="16" type="text" value="" readonly required>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
                        </div>
                    </div>
                    <div class="right">
                        <label for="" class="label-control">Commnents</label><br/>
                        <textarea class="taSize" name="pgm_comments" id="pgm_comments" cols="26" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button id="pgm_cancelButton" name="pgm_cancelButton" type="button" class="btn btn-danger" data-dismiss="modal">
                    Cancel
                </button>
                <button id="pgm_confirmButton" name="pgm_confirmButton" type="button" class="btn btn-success">
                    OK
                </button>
            </div>
        </div>
    </div>
</div>
<!--END MODAL FADE-->