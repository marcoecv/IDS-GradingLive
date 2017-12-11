<!--BEGIN MODAL FADE-->
<div class="modal" id="gradeMlPropContestants" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Aditional Info for Grading</h4>
            </div>
            <div class="modal-body" style="height: 400px">
                <div id="contestantMLHeadercontainer">
                    <table id="contestantMLtableHeader">
                        <tr>
                            <th class="ctWidth">Contestant</th>
                            <th class="radioWidth">Win</th>
                            <th class="radioWidth">Tie</th>
                            <th class="radioWidth">Lose</th>
                            <th class="radioWidth">Scratch</th>
                        </tr>
                    </table>
                </div>
                <div id="contestantMLcontainer">
                    <table id="contestantMLtable">
                    </table>
                </div>
                <input type="hidden" name="contestantMLcontestNum" id="contestantMLcontestNum"value=""/>
                <input type="hidden" name="contestantMLTieFlag" id="contestantMLTieFlag" value=""/>
            </div>
            <div class="modal-footer">
                <button id="cancelSetContestantStatus" name="cancelSetContestantStatus" type="button" class="btn btn-danger" data-dismiss="modal">
                    Cancel
                </button>
                <button id="setContestantStatus" name="setContestantStatus" type="button" class="btn btn-success">
                    Set
                </button>
            </div>
        </div>
    </div>
</div>
<!--END MODAL FADE-->