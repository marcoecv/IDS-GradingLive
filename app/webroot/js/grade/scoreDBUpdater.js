var client;
$(document).ready(function () {
    /***********************************************STOMP*************************************************************************/
    if (window.WebSocket) {
        connectToStomp();
    }

    /***********************************************STOMP*************************************************************************/
    
});

/**
 * @author mcalderon
 * @description connection to stomp to get updates for clearbet, grading and score changes
 * 
 */
function connectToStomp(){
    var scoreUpdatesQueue,clearBetQueue, gradeStatusQueue;
        scoreUpdatesQueue = "/topic/scoreInfoDBUpdateQueue";
        clearBetQueue = "/topic/clearbeatstatus";
        gradeStatusQueue = "/topic/gradingstatus";
        
        client = Stomp.client(url);

        client.debug = function (str) {
            $("#debug").append(document.createTextNode(str + "\n"));
        };
        client.heartbeat.outgoing = 0;
        client.heartbeat.incoming = 0;

        
        client.connect(login, passcode, function (frame) {
            client.debug("connected to Stomp");
            $('#connect').fadeOut({duration: 'fast'});
            $('#connected').fadeIn();
            client.subscribe(scoreUpdatesQueue, function (message) {
                processScoreUpdateInfo(message.body);
            });
            
            client.subscribe(clearBetQueue, function (message) {
                processClearBetDBUpdate(message.body);
            });
            client.subscribe(gradeStatusQueue, function (message) {
                processGradeUpdate(message.body);
            });
        });
}


function processScoreUpdateInfo(data){
    var obj=JSON.parse(data);
    $.each(obj["results"],function (key,val){
        if(val["GameNum"]===$("#glgdb_liveGames").val()){
            switch ($("#sportLiveGradeDBFilter").val().trim()){
                case 'L-Basketball':
                    basketballSetScore(val["PeriodID"], val["ScoreAway"], val["ScoreHome"],val["PeriodStatus"],val["ScheduleText"]);
                break;
                case 'L-Fooball':
                    footballSetScore(val["PeriodID"],val["ScoreAway"],val["ScoreHome"],val["PeriodStatus"]);
                    break;
                case 'L-Baseball':
                    baseballSetScore(val["PeriodID"],val["ScoreAway"],val["ScoreHome"],val["PeriodStatus"]);
                    break;
                case 'L-Ice Hockey':
                    hockeySetScore(val["PeriodID"],val["ScoreAway"],val["ScoreHome"],val["PeriodStatus"]);
                    break;
            }
        }
    });
}

function processClearBetDBUpdate(message){
    var obj=JSON.parse(message);
    $.each(obj["results"], function (key,val){
        $("tr[id^='"+val["ContestNum"]+"']").removeAttr("class");
        $("tr[id^='"+val["ContestNum"]+"']").attr("class","readyToGrade");
    });
}

function processGradeUpdate(message){
   var obj=JSON.parse(message);
    $.each(obj["results"], function (key,val){
        var wagerType=$("#glg_"+val["ContestNum"]+"_type").val(val["Score"]);
        if(wagerType==="P"||wagerType==="S"){
            $("#glg_odds_"+val["ContestNum"]).val();
            if(wagerType==="S"){
                $("#"+val["ContestNum"]+"_winner option[value='"+val["ContestantNum"]+"']").prop("selected",true);
            }
        }else if(wagerType==="M"){
            $("#"+val["ContestNum"]+"_winner option[value='"+val["ContestantNum"]+"']").prop("selected",true);
        }
        
        $("tr[id^='"+val["ContestNum"]+"']").removeAttr("class");
        $("tr[id^='"+val["ContestNum"]+"']").attr("class","graded");
        $("tr[id^='"+val["ContestNum"]+"']").find("button").removeAttr("class");
        $("tr[id^='"+val["ContestNum"]+"']").find("button").attr("class","btn btn-success");
        $("tr[id^='"+val["ContestNum"]+"']").find("button").prop("disabled",false);
    }); 

}