<!--BEGIN MODAL FADE-->
<div class="modal" id="systemSettingsModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="width: 815px">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">System Settings</h4>
            </div>
            <div id="settingsModalBody" class="modal-body" style="height: 400px">
                <form id="lineShadeGroupsFrm" action="#" role="form" class="form-horizontal">
                    <div class="headerDiv2 center">
                        <div id="leftDivSet" class="leftFloat3 bordered-div3">
                            <label class="label-control">Minimum Wager $: &nbsp;</label> <input type="text" size="3" name="minWager" id="minWager" value="2"/> &nbsp;
                            <input class="btn btn-default"type="button" name="st_maxBet" id="st_maxBet" value="Max Bet"/><br/>
                            <label class="label-control">Archive Data Older than (days):  &nbsp;</label><input type="text" name="st_archiveData" id="st_archiveData" size="3" value="91" disabled="disabled"/>
                            <br/>
                            <input type="checkbox" name="st_includeCents" id="st_includeCents"/><label class="label-control" for="includeCents"> &nbsp; Include Cents</label><br/>
                            <input type="checkbox" name="st_truncate" id="st_truncate"/><label class="label-control" for="truncate"> &nbsp; Truncate in Bank Favor</label><br/>
                            <label class="label-control">Weekly Figure Starts:  &nbsp;</label>
                            <select name="st_figureStartsDay" id="st_figureStartsDay" class="form-control inlineElement" style="width: 100px">
                                <option value="2">Monday</option>
                                <option value="3">Tuesday</option>
                                <option value="4">Wenesday</option>
                                <option value="5">Thursday</option>
                                <option value="6">Friday</option>
                                <option value="7">Saturday</option>
                                <option value="1">Sunday</option>
                            </select>
                        </div>
                        <div id="rightDivSet" class="rightFloat3 bordered-div3">
                            <label class="label-control">Seconds to update ticket writer lines: &nbsp;</label><input type="tex" size="7" name="st_UpdateGameMilliSeconds" id="st_UpdateGameMilliSeconds"/><br/>
                            <label class="label-control">Seconds to update administrador action: &nbsp;</label><input type="tex" size="7" name="st_UpdateMoneyMilliSeconds" id="st_UpdateMoneyMilliSeconds"/><br/>
                            <label class="label-control">Days to show completed game in admin: &nbsp;</label><input type="tex" size="7" name="st_AdminDisplayCompletedGamesDays" id="st_AdminDisplayCompletedGamesDays"/><br/>
                            <label class="label-control">Default wager cutoff minutes following game time: &nbsp;</label><input type="tex" size="7" name="st_DefaultCutoffMinutes" id="st_DefaultCutoffMinutes"/><br/>
                            <label class="label-control">Minutes to keep period open: &nbsp;</label><input type="tex" size="7" name="st_KeepOpenMinutes" id="st_KeepOpenMinutes"/><br/>
                            <label class="label-control">Post time lead minutes needed for horse wager: &nbsp;</label><input type="tex" size="7" name="st_PostTimeLeadMinutes" id="st_PostTimeLeadMinutes"/><br/>
                            <label class="label-control">Local time zone: &nbsp;</label>
                            <select name="st_timeZone" id="st_timeZone" class="form-control inlineElement" style="width: 93px">
                                <option value="0">Eastern</option>
                                <option value="1">Central</option>
                                <option value="2">Mountain</option>
                                <option value="3">Pacific</option>
                            </select>
                        </div>
                        <div id="notAdmin" class="bordered-div3">
                            <label class="label-control">Notify Administrator</label><br/>
                            <div class="leftFloat3">
                                <label class="label-control">Admin ID: &nbsp;</label><input type="text" name="st_adminId" id="st_adminId"/>
                            </div>
                            <div class="rightFloat3">
                                <input type="checkbox" name="st_exceedMaxWager" id="st_exceedMaxWager"/><label class="label-control" for=""> &nbsp;To Exceed Wager Maximum</label><br/>
                                <input type="checkbox" name="st_insuficentFounds" id="st_insuficentFounds"/><label class="label-control" for=""> &nbsp;Insuficent Funds</label><br/>
                                <input type="checkbox" name="st_CBNotificationMinutesAfterCutoff" id="st_CBNotificationMinutesAfterCutoff"/>
                                <label class="label-control" for="">To Acept Wagers &nbsp;<input type="text" name="st_NotificationMinutesAfterCutoff" id="st_NotificationMinutesAfterCutoff" size="3"/> &nbsp; Minutes following Cutoff</label><br/>
                            </div>
                        </div>
                        <br/>
                        <div id="centralValues" class="hide">
                            <div class="center modalDiv bordered-div3">
                                <label class="label-control marginElement">Parlay</label><br/>
                                <label class="label-control marginElement">Max. Call Unit Bet: &nbsp;</label>
                                <input class="marginElement" type="text" size="5"name="st_maxparlaybet" id="st_maxparlaybet" disabled="disabled"/>
                                <label class="label-control marginElement">Max. Internet Bet: &nbsp;</label>
                                <input class="marginElement" type="text" size="5"name="st_maxinetparlaybet" id="st_maxinetparlaybet" disabled="disabled"/>
                                <label class="label-control marginElement">Max Payout: &nbsp;</label>
                                <input class="marginElement" type="text" size="5"name="st_maxparlaypayout" id="st_maxparlaypayout" disabled="disabled"/>
                            </div>
                            <div class="center modalDiv bordered-div3">
                                <label class="label-control marginElement">Teaser</label><br/>
                                <label class="label-control marginElement">Max. Call Unit Bet: &nbsp;</label>
                                <input class="marginElement" type="text" size="5" name="st_maxteaserbet" id="st_maxteaserbet" disabled="disabled"/>
                                <label class="label-control marginElement">Max. Internet Bet: &nbsp;</label>
                                <input class="marginElement" type="text" size="5" name="st_maxinetteaserbet" id="st_maxinetteaserbet" disabled="disabled"/>
                            </div>
                            <div class="center modalDiv bordered-div3">
                                <label class="label-control marginElement">Contest</label><br/>
                                <label class="label-control marginElement">Max. Call Unit Bet: &nbsp;</label>
                                <input class="marginElement" type="text" size="5" name="st_maxcontestbet" id="st_maxcontestbet" disabled="disabled"/>
                                <label class="label-control marginElement">Max. Internet Bet: &nbsp;</label>
                                <input class="marginElement" type="text" size="5" name="st_maxinetcontestbet" id="st_maxinetcontestbet" disabled="disabled"/>
                                </table>
                            </div>
                            <input type="hidden" id="expandFlag" value="false"/>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button id="st_saveButton" name="st_saveButton" type="button" class="btn btn-success">
                    Save
                </button>
                <button id="st_cancelButton" name="st_cancelButton" type="button" data-dismiss="modal" class="btn btn-danger">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div>
<!--END MODAL FADE-->