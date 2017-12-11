<!--BEGIN MODAL FADE-->
<div class="modal" id="lsGradeInfoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="width: 350px">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Close Periods</h4>
            </div>
            <div id="pgg_bodymodal" class="modal-body">
                <span class="form-control" id="pgg_modal_contestDesc"></span>
                <input type="hidden" id="pgg_modal_contestNum" value=""/>
                <input type="hidden" id="pgg_modal_contestantNums" value=""/>
                <table id="pgg_modal_ctTable">
                    <thead>
                        <tr>
                            <th>Contestant</th>
                            <th>W</th>
                            <th>L</th>
                            <th>&frac12; W</th>
                            <th>&frac12; L</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button id="pgg_modal_cancel" name="pgg_modal_cancel" type="button" class="btn btn-danger" data-dismiss="modal">
                    Cancel
                </button>
                <button id="pgg_modal_gradeInfo" name="pgg_modal_gradeInfo" type="button" class="btn btn-success" data-dismiss="modal">
                    Send
                </button>
            </div>
        </div>
    </div>
</div>
<!--END MODAL FADE-->