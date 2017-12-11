<!--BEGIN MODAL FADE-->
<div class="modal" id="figureDateModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="width: 300px">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Figure Date</h4>
            </div>
            <div class="modal-body" style="height: 70px;">
                <div class="input-group date form_date" id='dailyFigureDateProps' data-date="" data-date-format="mm-dd-yyyy" data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
                    <input class="form-control" id="input_dailyFigureProps"size="16" type="text" value="" readonly required>
                    <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
                </div>
                <input type="hidden" id="df_contestNum" name="df_contestNum" value=""/>
            </div>
            <div class="modal-footer">
                <button id="cancelSetDF" name="cancelSetDF" type="button" class="btn btn-danger" data-dismiss="modal">
                    Cancel
                </button>
                <button id="SetDF" name="SetDF" type="button" class="btn btn-success" data-dismiss="modal">
                    Set
                </button>
            </div>
        </div>
    </div>
</div>
<!--END MODAL FADE-->