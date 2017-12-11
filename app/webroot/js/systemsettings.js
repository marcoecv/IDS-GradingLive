$(document).ready(function () {
    $(".btn-edit").hide();
    
    $("#st_maxBet").click(function (){
        enableMaxBetFields();
    });
    
    $("#st_saveButton").click(function (){
        saveSystemSettings();
    });
});

function enableMaxBetFields(){
    if($("#expandFlag").val()==="false"){
        $("#expandFlag").val("true");
        $("#centralValues").removeClass("hide");
        $("#centralValues").addClass("show");
        $("#settingsModalBody").animate({
            height: "650px"
        });
    }else{
        $("#expandFlag").val("false");
        $("#centralValues").removeClass("show");
        $("#centralValues").addClass("hide");
        $("#settingsModalBody").animate({
            height: "400px"
        });
        
    }
    
    $.each($("#centralValues").find('input'),function (key, value){
        $(value).removeAttr('disabled');
    });
}

function openSystemSettingsModal(){
    $.ajax({
        url: "settings/getSystemSettings",
        success: function (data) {
            var obj=JSON.parse(data);
            if(obj["row1"]["TruncateMoney"]==="Y"){
                $("#st_truncate").prop("checked",true);
            }
            if(obj["row1"]["NotifyToExceedMaxWager"]==="Y"){
                $("#st_exceedMaxWager").prop("checked",true);
            }
            if(obj["row1"]["IncludeCents"]==="Y"){
                $("#st_includeCents").prop("checked",true);
            }
            if(obj["row1"]["NotifyOfInsufficientFunds"]==="Y"){
                $("#st_insuficentFounds").prop("checked",true);
            }
            if(obj["row1"]["NotificationMinutesAfterCutoff"]!==""&&obj["NotificationMinutesAfterCutoff"]!==null){
                $("#st_CBNotificationMinutesAfterCutoff").prop("checked",true);
            }
            
            $("#st_figureStartsDay option[value="+obj["row1"]["CloseDayOfWeek"]+"]").prop("selected",true);
            $("#st_timeZone option[value="+obj["row1"]["LocalTimeZone"]+"]").prop("selected",true);
            $("#st_archiveData").val();
            $("#minWager").val(obj["row1"]["MinimumWager"]);
            $("#st_UpdateGameMilliSeconds").val(obj["row1"]["UpdateGameMilliSeconds"]);
            $("#st_DefaultCutoffMinutes").val(obj["row1"]["DefaultCutoffMinutes"]);
            $("#st_adminId").val(obj["row1"]["NotificationAdministrator"]);
            $("#st_PostTimeLeadMinutes").val(obj["row1"]["PostTimeLeadMinutes"]);
            $("#st_KeepOpenMinutes").val(obj["row1"]["KeepOpenMinutes"]);
            $("#st_AdminDisplayCompletedGamesDays").val(obj["row1"]["AdminDisplayCompletedGamesDays"]);
            $("#st_UpdateMoneyMilliSeconds").val(obj["row1"]["UpdateMoneyMilliSeconds"]);
            $("#st_NotificationMinutesAfterCutoff").val(obj["row1"]["NotificationMinutesAfterCutoff"]);
            $("#st_maxparlaybet").val(obj["row1"]["MaxParlayBet"]);
            $("#st_maxinetparlaybet").val(obj["row1"]["MaxInetParlayBet"]);
            $("#st_maxparlaypayout").val(obj["row1"]["MaxParlayPayout"]);
            $("#st_maxteaserbet").val(obj["row1"]["MaxTeaserBet"]);
            $("#st_maxinetteaserbet").val(obj["row1"]["MaxInetTeaserBet"]);
            $("#st_maxcontestbet").val(obj["row1"]["MaxContestBet"]);
            $("#st_maxinetcontestbet").val(obj["row1"]["MaxInetContestBet"]);
            
        }
    });
    $("#systemSettingsModal").modal("toggle");
}

function saveSystemSettings(){
    var includeCents=($("#st_includeCents").is(":checked")?"Y":"N");
    var truncate=($("#st_truncate").is(":checked")?"Y":"N");
    var exceedMaxWager=($("#st_exceedMaxWager").is(":checked")?"Y":"N");
    var insuficentFounds=($("#st_insuficentFounds").is(":checked")?"Y":"N");
    
    $.ajax({
        url: "settings/saveSystemSettins",
        type: 'POST',
        data: {
            "minimumwager":$("#minWager").val(),
            "updategamemilliseconds":$("#st_UpdateGameMilliSeconds").val(),
            "updatemoneymilliseconds":$("#st_UpdateMoneyMilliSeconds").val(),
            "admindisplaycompletedgamedays":$("#st_AdminDisplayCompletedGamesDays").val(),
            "defaultcutoffminutes":$("#st_DefaultCutoffMinutes").val(),
            "keepopenminutes":$("#st_KeepOpenMinutes").val(),
            "posttimeleadminutes":$("#st_PostTimeLeadMinutes").val(),
            "weeklyfigurestarts":$("#st_figureStartsDay option[value="+$("#st_figureStartsDay").val()+"]").text(),
            "closedayofweek":$("#st_figureStartsDay").val(),
            "localtimezonedesc":$("#st_timeZone option[value="+$("#st_timeZone").val()+"]").text(),
            "localtimezone":$("#st_timeZone").val(),
            "notificationadministrator":$("#st_adminId").val(),
            "notifytoexceedmaxwager":exceedMaxWager,
            "notifyofinsufficientfunds":insuficentFounds,
            "notificationminutesaftercutoff":$("#st_NotificationMinutesAfterCutoff").val(),
            "includecents":includeCents,
            "truncatemoney":truncate,
            "maxparlaybet":$("#st_maxparlaybet").val(),
            "maxparlaypayout":$("#st_maxinetparlaybet").val(),
            "maxinetparlaybet":$("#st_maxparlaypayout").val(),
            "maxteaserbet":$("#st_maxteaserbet").val(),
            "maxinetteaserbet":$("#st_maxinetteaserbet").val(),
            "maxcontestbet":$("#st_maxcontestbet").val(),
            "maxinetcontestbet":$("#st_maxinetcontestbet").val()
        },success: function (data) {
            alert(data)
        }
    });
}