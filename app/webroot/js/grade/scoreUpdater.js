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
        

        scoreUpdatesQueue = "/topic/scoreInfoUpdateQueue";
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
                processClearBetUpdate(message.body);
            });
            client.subscribe(gradeStatusQueue, function (message) {
                processGradeUpdate(message.body);
            });
        });
}

/**
 * @author mcalderon
 * @description takes the update message for score changes, decodes the JSON and sendit to the proper sport method
 * @param {JSON} data
 */
function processScoreUpdateInfo(data){
    var sport=$("#sportLiveGradeFilter").val().trim();
    var gameNum=$("#glg_gameNum").val();
    var obj=JSON.parse(data);
    $.each(obj["results"],function (key,val){
        if(sport===val["SportType"].trim()&&gameNum===val["GameNum"]){
            switch (sport){
                case "L-Soccer":
                    setSoccerUpdate(val["PeriodNumber"],val["AwayScore"],val["HomeScore"],val["ScoreAway"],val["ScoreHome"],val["RedCardsAway"],val["RedCardsHome"],val["YellowCardsAway"],val["YellowCardsHome"],val["AwayCorners"],val["HomeCorners"],val["pensaway"],val["penshome"])
                    break;
                case "L-Basketball":
                case "L-Football":
                    setBasketBallFootballUpdate(val["PeriodNumber"],val["AwayScore"],val["HomeScore"],val["ScoreAway"],val["ScoreHome"]);
                    break;
                case "L-Tennis":
                    setTennisUpdate(val["PeriodNumber"],val["GameAwayScore"],val["GameHomeScore"],val["ScoreAway"],val["ScoreHome"],val["AwayTennis"],val["HomeTennis"]);
                    break;
                case "L-Baseball":
                    setBaseballUpdate(val["PeriodNumber"],val["AwayScore"],val["HomeScore"],val["ScoreAway"],val["ScoreHome"]);
                    break;
                case 'L-Ice Hockey':
                    setHockeyUpdate(val["PeriodNumber"],val["AwayScore"],val["HomeScore"],val["ScoreAway"],val["ScoreHome"]);
                    break;
            }
        }
    });
}

function setBaseballUpdate(PeriodNumber,AwayScore,HomeScore,ScoreAway,ScoreHome){
    $("#glg_awayTeamScore").val(AwayScore);
    $("#glg_homeTeamScore").val(HomeScore);
    $("#glg_scoreBoardA_r").text(AwayScore);
    $("#glg_scoreBoardH_r").text(HomeScore);
    
    switch (PeriodNumber){
        case "1":
            $("#glg_scoreBoardA_1").text(ScoreAway);
            $("#glg_scoreBoardH_1").text(ScoreHome);
            break;
        case "2":
            $("#glg_scoreBoardA_2").text(ScoreAway);
            $("#glg_scoreBoardH_2").text(ScoreHome);
            break;
        case "3":
            $("#glg_scoreBoardA_3").text(ScoreAway);
            $("#glg_scoreBoardH_3").text(ScoreHome);
            break;
        case "4":
            $("#glg_scoreBoardA_4").text(ScoreAway);
            $("#glg_scoreBoardH_4").text(ScoreHome);
            break;
        case "5":
            $("#glg_scoreBoardA_5").text(ScoreAway);
            $("#glg_scoreBoardH_5").text(ScoreHome);
            break;
        case "6":
            $("#glg_scoreBoardA_6").text(ScoreAway);
            $("#glg_scoreBoardH_6").text(ScoreHome);
            break;
        case "7":
            $("#glg_scoreBoardA_7").text(ScoreAway);
            $("#glg_scoreBoardH_7").text(ScoreHome);
            break;
        case "8":
            $("#glg_scoreBoardA_8").text(ScoreAway);
            $("#glg_scoreBoardH_8").text(ScoreHome);
            break;
        case "9":
            $("#glg_scoreBoardA_9").text(ScoreAway);
            $("#glg_scoreBoardH_9").text(ScoreHome);
            break;
        case "10":
            $("#glg_scoreBoardA_ei").text(ScoreAway);
            $("#glg_scoreBoardH_ei").text(ScoreHome);
            break;
    }
    
}





/**
 * @author mcalderon
 * @description set the score update for tennis games
 * @param {int} PeriodNumber
 * @param {int} GameAwayScore
 * @param {int} GameHomeScore
 * @param {int} ScoreAway
 * @param {int} ScoreHome
 * @param {int} AwayTennis
 * @param {int} HomeTennis
 */
function setTennisUpdate(PeriodNumber,GameAwayScore,GameHomeScore,ScoreAway,ScoreHome,AwayTennis,HomeTennis){
    $("#glg_scoreBoardA_pts").text(GameAwayScore);
    $("#glg_scoreBoardH_pts").text(GameHomeScore);
    $("#glg_scoreBoardA_sets").text(AwayTennis);
    $("#glg_scoreBoardH_sets").text(HomeTennis);
    $("#glg_awayTeamScore").text(AwayTennis);
    $("#glg_homeTeamScore").text(HomeTennis);
    switch (PeriodNumber){
        case '1':
            $("#glg_scoreBoardA_1s").text(ScoreAway);
            $("#glg_scoreBoardH_1s").text(ScoreHome);
            break;
        case '2':
            $("#glg_scoreBoardA_2s").text(ScoreAway);
            $("#glg_scoreBoardH_2s").text(ScoreHome);
            break;
        case '3':
            $("#glg_scoreBoardA_3s").text(ScoreAway);
            $("#glg_scoreBoardH_3s").text(ScoreHome);
            break;
        case '5':
            $("#glg_scoreBoardA_4s").text(ScoreAway);
            $("#glg_scoreBoardH_4s").text(ScoreHome);
            break;
        case '6':
            $("#glg_scoreBoardA_5s").text(ScoreAway);
            $("#glg_scoreBoardH_5s").text(ScoreHome);
            break;
    }
}
/**
 * 
 * @author mcalderon
 * @description set the score update for hockey games
 * @param {type} PeriodNumber
 * @param {type} GameAwayScore
 * @param {type} GameHomeScore
 * @param {type} ScoreAway
 * @param {type} ScoreHome
 * @returns {undefined}
 */
function setHockeyUpdate(PeriodNumber,GameAwayScore,GameHomeScore,ScoreAway,ScoreHome){
    $("#glg_scoreBoardA_total").text(GameAwayScore);
    $("#glg_scoreBoardH_total").text(GameHomeScore);
    $("#glg_awayTeamScore").val(GameAwayScore);
    $("#glg_homeTeamScore").val(GameHomeScore);
    switch (PeriodNumber){
        case '1':
            $("#glg_scoreBoardA_1p").text(ScoreAway);
            $("#glg_scoreBoardH_1p").text(ScoreHome);
            break;
        case '2':
            $("#glg_scoreBoardA_2p").text(ScoreAway);
            $("#glg_scoreBoardH_2p").text(ScoreHome);
            break;
        case '3':
            $("#glg_scoreBoardA_3p").text(ScoreAway);
            $("#glg_scoreBoardH_3p").text(ScoreHome);
            break;
        case '5':
            $("#glg_scoreBoardA_ot").text(ScoreAway);
            $("#glg_scoreBoardH_ot").text(ScoreHome);
            break;
    }
}
/**
 * @author mcalderon
 * @description set the score info for updates in soccer games
 * @param {int} PeriodNumber
 * @param {int} GameAwayScore
 * @param {int} GameHomeScore
 * @param {int} ScoreAway
 * @param {int} ScoreHome
 * @param {int} RedCardsAway
 * @param {int} RedCardsHome
 * @param {int} YellowCardsAway
 * @param {int} YellowCardsHome
 * @param {int} AwayCorners
 * @param {int} HomeCorners
 * @param {int} pensaway
 * @param {int} penshome
 * @returns {undefined}
 */

function setSoccerUpdate(PeriodNumber,GameAwayScore,GameHomeScore,ScoreAway,ScoreHome,RedCardsAway,RedCardsHome,YellowCardsAway,YellowCardsHome,AwayCorners,HomeCorners,pensaway,penshome){
    $("#glg_scoreBoardA_red").text(RedCardsAway);
    $("#glg_scoreBoardH_red").text(RedCardsHome);
    $("#glg_scoreBoardA_yel").text(YellowCardsAway);
    $("#glg_scoreBoardH_yel").text(YellowCardsHome);
    $("#glg_scoreBoardA_cor").text(AwayCorners);
    $("#glg_scoreBoardH_cor").text(HomeCorners);
    $("#glg_scoreBoardA_pen").text(pensaway);
    $("#glg_scoreBoardH_pen").text(penshome);
    $("#glg_scoreBoardA_sco").text(GameAwayScore);
    $("#glg_scoreBoardH_sco").text(GameHomeScore);
    $("#glg_awayTeamScore").val(GameAwayScore);
    $("#glg_homeTeamScore").val(GameHomeScore);
    switch (PeriodNumber){
        case '1':
            $("#glg_scoreBoardA_1h").text(ScoreAway);
            $("#glg_scoreBoardH_1h").text(ScoreHome);
            break;
        case '2':
            $("#glg_scoreBoardA_2h").text(ScoreAway);
            $("#glg_scoreBoardH_2h").text(ScoreHome);
            break;
        case '3':
            $("#glg_scoreBoardA_1e").text(ScoreAway);
            $("#glg_scoreBoardH_1e").text(ScoreHome);
            break;
        case '4':
            $("#glg_scoreBoardA_2e").text(ScoreAway);
            $("#glg_scoreBoardH_2e").text(ScoreHome);
            break;
    }
}

/**
 * @author mcalderon
 * @description set the score info for updates in bascketball games
 * @param {int} PeriodNumber
 * @param {int} GameAwayScore
 * @param {int} GameHomeScore
 * @param {int} ScoreAway
 * @param {int} ScoreHome
 * @returns {undefined}
 */
function setBasketBallFootballUpdate(PeriodNumber,GameAwayScore,GameHomeScore,ScoreAway,ScoreHome){
    $("#glg_scoreBoardA_sco").text(GameAwayScore);
    $("#glg_scoreBoardH_sco").text(GameHomeScore);
    $("#glg_scoreBoardA_total").text(GameAwayScore);
    $("#glg_scoreBoardH_total").text(GameHomeScore);
    $("#glg_awayTeamScore").val(GameAwayScore);
    $("#glg_homeTeamScore").val(GameHomeScore);
    switch (PeriodNumber){
        case '1':
            $("#glg_scoreBoardA_1q").text(ScoreAway);
            $("#glg_scoreBoardH_1q").text(ScoreHome);
            var score1hA=parseInt($("#glg_scoreBoardA_2q").text())+parseInt(ScoreAway);
            var score1hH=parseInt($("#glg_scoreBoardH_2q").text())+parseInt(ScoreHome);
            $("#glg_scoreBoardA_1h").text(score1hA);
            $("#glg_scoreBoardH_1h").text(score1hH);
            break;
        case '2':
            $("#glg_scoreBoardA_2q").text(ScoreAway);
            $("#glg_scoreBoardH_2q").text(ScoreHome);
            var score1hA=parseInt($("#glg_scoreBoardA_1q").text())+parseInt(ScoreAway);
            var score1hH=parseInt($("#glg_scoreBoardH_1q").text())+parseInt(ScoreHome);
            $("#glg_scoreBoardA_1h").text(score1hA);
            $("#glg_scoreBoardH_1h").text(score1hH);
            break;
        case '3':
            $("#glg_scoreBoardA_3q").text(ScoreAway);
            $("#glg_scoreBoardH_3q").text(ScoreHome);
            break;
        case '4':
            $("#glg_scoreBoardA_4q").text(ScoreAway);
            $("#glg_scoreBoardH_4q").text(ScoreHome);
            break;
        case '5':
            $("#glg_scoreBoardA_ot").text(ScoreAway);
            $("#glg_scoreBoardH_ot").text(ScoreHome);
            break;
    }
}

/**
 * @author mcalderon
 * @description process the clear bet updates and change the color of the respective props
 * @param {String} message
 * @returns {undefined}
 */
function processClearBetUpdate(message){
    var obj=JSON.parse(message);
    $.each(obj["results"], function (key,val){
        $("#"+val["ContestNum"]).removeAttr("class");
        $("#"+val["ContestNum"]).attr("class","readyToGrade");
    });
}

/**
 * @author mcalderon
 * @description set the grade color for every graded game
 * @param {String} message
 * @returns {undefined}
 */
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
        
        $("div[id^='"+val["ContestNum"]+"']").removeAttr("class");
        $("div[id^='"+val["ContestNum"]+"']").attr("class","graded");
        $("div[id^='"+val["ContestNum"]+"']").find("button").removeAttr("class");
        $("div[id^='"+val["ContestNum"]+"']").find("button").attr("class","btn btn-success");
        $("div[id^='"+val["ContestNum"]+"']").find("button").prop("disabled",false);
    }); 

}
