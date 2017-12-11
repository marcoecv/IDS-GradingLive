<!--BEGIN MODAL FADE-->
<div class="modal" id="betsPregameInfoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="width: 1300px">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Bets</h4>
            </div>
            <div class="modal-body" style="height: 400px;">
                <div id="bim_headerTableDiv">
                    <table id="bim_headerTable" class="table table-bordered table-hover">
                        <tr>
                            <th class="bim_ticket"># Ticket</th>
                            <th class="bim_date">Posted Date</th>
                            <th class="bim_custId">CustomerID</th>
                            <th class="bim_contestDesc">Contest Desc.</th>
                            <th class="bim_contestant">Contestant</th>
                            <th class="bim_threshold">Threshold</th>
                            <th class="bim_finalMoney">Final Money</th>
                            <th class="bim_amountWagered">Amount Wagered</th>
                            <th class="bim_toWin">To Win Amount</th>
                            <th class="bim_outcome">Outcome</th>
                        </tr>
                    </table>
                </div>
                <div id="bin_tableDiv">
                    <table id="bin_table" class="table table-bordered  table-striped table-hover">
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button id="cancelSendClose" name="cancelSendClose" type="button" class="btn btn-danger" data-dismiss="modal">
                    Close
                </button>
            </div>
        </div>
    </div>
</div>
<!--END MODAL FADE-->