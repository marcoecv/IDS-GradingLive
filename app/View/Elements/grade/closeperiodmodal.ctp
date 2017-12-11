<!--BEGIN MODAL FADE-->
<div class="modal" id="closePeriodModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="width: 350px">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Close Periods</h4>
            </div>
            <div class="modal-body" style="height: 200px;">
                <label class="label-control" for="cpm_PeriodId">Period to Close:&nbsp;</label><select class="form-control" id="cpm_PeriodId"></select>
                <label class="label-control cpmScoreLabel" for="cpm_PeriodId">Away Score:&nbsp;</label><input type="text" id="awawScore" class="form-control cpmScoreTF"/><br/>
                <label class="label-control cpmScoreLabel" for="cpm_PeriodId">HomeScore:&nbsp;</label><input type="text" id="homeScore" class="form-control cpmScoreTF"/>
            </div>
            <input type="checkbox" value="1" id="cpmcloseOption"/><label for="cpmScoreLabel">Close period</label>
            <div class="modal-footer">
                <button id="cancelSendClose" name="cancelSendClose" type="button" class="btn btn-danger" data-dismiss="modal">
                    Cancel
                </button>
                <button id="sendClose" name="sendClose" type="button" class="btn btn-success" data-dismiss="modal">
                    Send
                </button>
            </div>
        </div>
    </div>
</div>
<!--END MODAL FADE-->