var periodsOrder = [2,3,4,5,6,7,1];
var periodsOrderBaskeball = [4,5,2,6,7,3,1];
var periodsOrderHockey = [2,3,4,5,1];
var periodsOrderBaseball = [6,7,8,9,10,11,12,13,14,15,1];
var currentPeriods;
var periodInPlay;


$(document).ready(function () {
    $(".btn-edit, .btn-cancel, .btn-save, #footer").hide();
    $('#glg_dailyFigureDate').datetimepicker({
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });

    $('#pgg_gameDateDiv').datetimepicker({
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });

    $(".chosen-select").chosen();

    $("#pgg_subSportFilter").change(function () {
        setPeriods();
    });

    $("#glg_setGradeInfoButon").click(function (){
        validateSetAdInfo();
    });
    
    
    $("#pgg_getGamePropsInfo").click(function () {
       getGameLSByDate(); 
    });
    
    $("#pgg_gradeReadyProps").click(function (){
        sendMassiveGrading();
//        massiveGrading();
    });
    
    $("#pgg_deleteMarkets").click(function (){
        if(confirm("Are You sure you want to delete all correlated props?"))
            pgg_deleteMarkets();
    });
    
    $("#pgg_sendToArchive").click(function (){
        closeGames();
    });
    
    $("#pgg_closePeriods").click(function (){
        $.ajax({
            url: "getDBPeriodBySport/"+$("#sportLiveGradeLSFilter").val(),
            success: function (data) {
                var obj = JSON.parse(data);
                var select = $("#cpm_PeriodId");
                $.each(obj,function (key,val){
                    var opt=new Option(val["PeriodDescription"],val["PeriodNumber"]);
                    select.append(opt);
                });
                
            }
        });
        $("#closePeriodModal").modal("toggle");
    });
    
    $("#sendClose").click(function (){
        sendPeriodScore();
    });
    
    $("#sportLiveGradeLSFilter").change(function (){
        setLSPropGroups($(this).val().trim());
    });
    
    $("#pgg_modal_gradeInfo").click(function (){
        setWinnerContestant();
    });
    
    
    $("#pgg_DBFilter").change(function (){
        setSports();
    });
    
    $("#pgg_sportsFilter").change(function (){
        setSubSports();
    });
});


function setSubSports(){
    var sport=$("#pgg_sportsFilter").val();
    $.ajax({
        url: "getSubSports",
        type: 'POST',
        data: {
            "sport":sport.trim(),
            "db":$("#pgg_DBFilter").val()
        },complete: function () {
            $("#pgg_subSportFilter").trigger("chosen:updated");
        },
        success: function (data) {
            var obj=JSON.parse(data);
            $("#pgg_subSportFilter option").remove();
            var select=$("#pgg_subSportFilter");
            $.each(obj,function (key,val){
                select.append("<option value='"+val["SportSubType"]+"'>"+val["SportSubType"]+"</option>");
            });
        }
    });
}

function setSports(){
    var db=$("#pgg_DBFilter").val();
    $.ajax({
        url: "getAjaxSports",
        type: 'POST',
        data: {
            "selectedDB":db
        },complete: function () {
            $("#pgg_sportsFilter").trigger("chosen:updated");
        },
        success: function (data) {
            var obj=JSON.parse(data);
            $("#pgg_sportsFilter option").remove();
            var select=$("#pgg_sportsFilter");
            select.append("<option value=''></option");
            $.each(obj, function (key,val){
                select.append("<option value='"+val["SportType"]+"'>"+val["SportType"]+"</option>");
            });
        }
    });
}


/**
 * @author mcalderon
 * @description AJAX function to get all gameNums and teams by date param and set them in the "Game" select
 */
function getGameLSByDate() {
    $.ajax({
        url: "getGameNumsPregame",
        type: 'POST',
        data: {
            "sport": $("#pgg_sportsFilter").val().trim(),
            "subSport": $("#pgg_subSportFilter").val().trim(),
            "dateFrom": $("#pgg_gameDate").val(),
            "db": $("#pgg_DBFilter").val()
        },complete: function () {
            getGameScores();
        }, success: function (data) {
            var obj = JSON.parse(data);
            $("#pgg_gamesContainerDiv > div").remove();
            $.each(obj, function (key, val) {
                createGameDiv(val['Team1ID'],val['Team2ID'],val['GameNum'],val["EventID"]);
            });
        }
    });
}

function getGameScores(){
    var games="";
    $.each($(".gameDiv"),function (){
        games+=$(this).attr("gameNum")+",";
    });
    games=games.substr(0,games.length-1);
    $.ajax({
        url: "getGameScores",
        type: 'POST',
        data: {
            "games":games,
            "db":$("#pgg_DBFilter").val()
        },success: function (data) {
            var obj=JSON.parse(data);
            console.log(obj)
            $.each(obj,function (key,val){
                $("#pggAway_"+val["GameNum"]+"_"+val["ASIPeriod"]).val(val["ScoreAway"]);
                $("#pggHome_"+val["GameNum"]+"_"+val["ASIPeriod"]).val(val["ScoreHome"]);
                if($("#pgg_sportsFilter").val().trim()==="Basketball"||$("#pgg_sportsFilter").val().trim()==="Football"){
                    if($("#pggAway_"+val["GameNum"]+"_3").val()!==""&&$("#pggAway_"+val["GameNum"]+"_4").val()!=""){
                        $("#pggAway_"+val["GameNum"]+"_1").val(parseInt($("#pggAway_"+val["GameNum"]+"_3").val())+parseInt($("#pggAway_"+val["GameNum"]+"_4").val()));
                        $("#pggHome_"+val["GameNum"]+"_1").val(parseInt($("#pggHome_"+val["GameNum"]+"_3").val())+parseInt($("#pggHome_"+val["GameNum"]+"_4").val()));
                    }
                    if($("#pggAway_"+val["GameNum"]+"_5").val()!==""&&$("#pggAway_"+val["GameNum"]+"_6").val()!=""){
                        $("#pggAway_"+val["GameNum"]+"_2").val(parseInt($("#pggAway_"+val["GameNum"]+"_5").val())+parseInt($("#pggAway_"+val["GameNum"]+"_6").val()));
                        $("#pggHome_"+val["GameNum"]+"_2").val(parseInt($("#pggHome_"+val["GameNum"]+"_5").val())+parseInt($("#pggHome_"+val["GameNum"]+"_6").val()));
                    }
            }
            });
        }
    });
}


function saveGameScores(gameNum){
    var checks=$(".scores"+gameNum);
    var gameScoresInto="";
    $.each(checks,function (){
        var period=$(this).attr("periodID");
        var scoreAway=$("#pggAway_"+gameNum+"_"+period).val();
        var scoreHome=$("#pggHome_"+gameNum+"_"+period).val();
        var scoresInfo=gameNum+"_"+scoreAway+"_"+scoreHome+"_"+period;
        gameScoresInto+=scoresInfo+",";
    });
    
    gameScoresInto=gameScoresInto.substr(0,gameScoresInto.lenght);
    $.ajax({
        url: "setGameScores",
        type: 'POST',
        data: {
            "gamesInfo":gameScoresInto,
            "db":$("#pgg_DBFilter").val()
        },success: function (data) {
            
        }
    })
}


function createGameDiv(Team1ID,Team2ID,GameNum,EventID){
    var mainDiv=$("#pgg_gamesContainerDiv");
    var size="6";
    if(currentPeriods.length>7)
        size="12";
    
    var gameDiv=$("<div class='col-md-"+size+" gameDiv' gameNum='"+EventID+"' id='"+EventID+"_game'></div>");
    var propsDiv=$("<div id='"+EventID+"_props' class='col-md-12 collapse' style='padding: 0px ! important; height: 0px;'></div>");
    
    var propsTable=$("<table class='pgg_propsTable' id='"+EventID+"_propsTable'></table>");
    
    var gameDivRight=$("<div class='col-md-2' style='line-height: 45px;' id='"+EventID+"_right'></div>");
    
    var gameSubDivLeft=$("<div class='col-md-12' style='margin:0;padding:0'></div>");
    var getPropsButton=$("<button type='button' style='width: 49%; margin:1px;padding: 6px 10px;' data-toggle='collapse' data-target='#"+EventID+"_props' onclick='getPregameLSProps("+EventID+")' class='btn btn-info' id='getPropsButton_"+EventID+"'>Props</button>");
    var saveScoresButton=$("<button type='button' style='width: 49%;padding: 6px 10px;' onclick='saveGameScores("+EventID+")' class='btn btn-success' id='saveScoresButton_"+EventID+"'>Save</button>");
    
    var gameSubDivRight=$("<div class='col-md-12' style='margin:0;padding:0'></div>");
    var gradeMainButton=$("<button type='button' style='width: 100%' class='btn btn-danger' id='saveGradeButton_"+EventID+"'>Grade</button>");
    
    
    gameSubDivLeft.append(saveScoresButton);
    gameSubDivLeft.append(getPropsButton);
    gameSubDivRight.append(gradeMainButton);
    gameDivRight.append(gameSubDivLeft);
    gameDivRight.append(gameSubDivRight);
    
    var gameDivLeft=$("<div class='col-md-10' id='"+GameNum+"_left'></div>");
    var table=$("<table class='gameContainerTable'></table>");
    var trHeader=$("<tr></tr>");
    var trAway=$("<tr></tr>");
    var trHome=$("<tr></tr>");

    trHeader.append("<th class='tdTeams'>Teams</th>");
    trAway.append("<td class='tdTeams'>"+Team1ID+"</td>");
    trHome.append("<td class='tdTeams'>"+Team2ID+"</td>");

    $.each(currentPeriods,function (key,val){
        trHeader.append("<th  style='width:calc(65% / "+currentPeriods.length+")'><input type='checkbox' periodID='"+val["PeriodNumber"]+"' class='scores"+GameNum+"' onclick='enablePeriodScoreBox("+GameNum+","+val["PeriodNumber"]+")' id='sendSave_"+GameNum+"_"+val["PeriodNumber"]+"'/>&nbsp;"+val["ShortDescription"]+"</th>");
        trAway.append("<td style='width:calc(65% / "+currentPeriods.length+")'><center><input type='text' class='form-control' readonly id='pggAway_"+GameNum+"_"+val["PeriodNumber"]+"'/></center></td>");
        trHome.append("<td style='width:calc(65% / "+currentPeriods.length+")'><center><input type='text' class='form-control' readonly id='pggHome_"+GameNum+"_"+val["PeriodNumber"]+"'/></center></td>");
    });

    table.append(trHeader);
    table.append(trAway);
    table.append(trHome);

    gameDivLeft.append(table)
    gameDiv.append(gameDivLeft);
    
    
    
    
    gameDiv.append(gameDivRight);

    mainDiv.append(gameDiv);

    propsDiv.append(propsTable);
    gameDiv.append(propsDiv);
    
}

function enablePeriodScoreBox(gameNum,period){
    if($("#sendSave_"+gameNum+"_"+period).is(":checked")){
        $("#pggAway_"+gameNum+"_"+period).removeAttr("readonly");
        $("#pggHome_"+gameNum+"_"+period).removeAttr("readonly");
    }else{
        $("#pggAway_"+gameNum+"_"+period).attr("readonly",true);
        $("#pggHome_"+gameNum+"_"+period).attr("readonly",true);
    }
}
/**
 * @author mcalderon
 * @description set the periods order according to the sport selected (in LS the order is the same for tennis and soccer) */
function setPeriods() {
    var sport = $("#pgg_sportsFilter").val().trim();
    $.ajax({
       url: "getPregamePeriodBySport/",
            type: 'POST',
            data:{
                "sport":sport,
                "subsport":$("#pgg_subSportFilter").val().trim(),
                "db":$("#pgg_DBFilter").val()
            },
        success: function (data) {
            var obj = JSON.parse(data);
            var periodsArr = [];
            var array;
            if(sport==="Basketball"||sport==="Football")
                array=periodsOrderBaskeball;
            else if(sport==="Ice Hockey")
                array=periodsOrderHockey;
            else if(sport==="L-Baseball")
                array=periodsOrderBaseball;
            else
                array = periodsOrder;
            
            $.each(array, function (key, val) {
                if (obj["row" + val] !== undefined)
                    periodsArr.push(obj["row" + val]);
            });
            currentPeriods=periodsArr;
        }
    });
}

function gradeLiveGame(){
    if($("#pgg_awayTeamScore").val()===""||$("#pgg_homeTeamScore").val()===""){
        alert("There is no score to grade this game");
    }else{
        var df=$("#pgg_df").val()===""?$("#pgg_gameDate").val():$("#pgg_df").val();
        $.ajax({
            url: "gradeindividualgame",
            type: 'POST',
            data: {
                "sp": $("#pgg_actionSP").val(),
                "ml": $("#pgg_actionML").val(),
                "tl": $("#pgg_actionTL").val(),
                "df": df,
                "team1": $("#pgg_awayTeam").val(),
                "team2": $("#pgg_homeTeam").val(),
                "period": 0,
                "periodname": "Game",
                "rot": $("#pgg_rot").val(),
                "gameDate": $("#pgg_gameDateTime").val(),
                "scoreAway": $("#pgg_awayTeamScore").val(),
                "pointsAway": $("#pgg_awayTeamScore").val(),
                "scoreHome": $("#pgg_homeTeamScore").val(),
                "pointsHome": $("#pgg_homeTeamScore").val(),
                "subSport": $("#sportLiveGradeLSFilter").val(),
                "adjustlinehome": "",
                "adjustlineaway": "",
                "comments": ""
            }, success: function (data) {
                alert("Success");
            }
        });
    }
}

/**
 * @author mcalderon
 * @description grade all clearbet props un a specific group / period table
 */
function massiveGrading(){
    var table=$("#pgg_tabs .active").find(".showTable");
    var props=table.find(".readyToGrade");
    $(props).each(function (){
        $(this).find("button").trigger("click");
    });
}

/**
 * @author mcalderon
 * @description get the score Info and according to the sport send to fill the scoreboard
 * @returns {undefined}
 */
function getGameScoreInfo() {
    $.ajax({
        url: "getDBscoreByGameNum/" + $("#pgg_liveGames").val(),
        complete: function () {
            loadPropLSGroups();
        },
        success: function (data) {
            var obj = JSON.parse(data);
            $("#awayTeam").text(obj["row1"]["Team1ID"]);
            $("#homeTeam").text(obj["row1"]["Team2ID"]);
            $("#pgg_awayTeam").val(obj["row1"]["Team1ID"]);
            $("#pgg_homeTeam").val(obj["row1"]["Team2ID"]);
            $("#pgg_rot").val(obj["row1"]["Rot1Num"]);
            $("#pgg_gameDateTime").val(obj["row1"]["GameDate"]);
            $("#pgg_gradeGameButton").attr("class","btn btn-success");
            if(obj["row1"]["GradeDateTime"]!==""&&obj["row1"]["GradeDateTime"]!==null){
                $("#pgg_gradeGameButton").attr("class","btn btn-danger");
                $("#pgg_gradeGameButton").text("Re-Grade");
            }else{
                $("#pgg_gradeGameButton").attr("class","btn btn-success");
                $("#pgg_gradeGameButton").text("Grade");
            }
            $.each(obj,function(key,val){
                switch ($("#sportLiveGradeLSFilter").val().trim()) {
                    case 'L-Soccer':
                        soccerSetScore(val["PeriodID"], val["ScoreAway"], val["ScoreHome"],val["Corners"],val["YellowCard"],val["RedCards"],"N");
                        break;
                    case 'L-Tennis':
                        tennisSetScore(val["PeriodID"], val["ScoreAway"], val["ScoreHome"],val["1SetScore"],val["2SetScore"],val["3SetScore"],val["4SetScore"],val["5SetScore"],val["MatchScore"]);
                        break;
                    case 'L-Basketball':
                    case 'L-Football':
                        basketballFootballSetScore(val["PeriodID"], val["ScoreAway"], val["ScoreHome"]);
                        break;
                    case 'L-Ice Hockey':
                        iceHockeySetScore(val["PeriodID"], val["ScoreAway"], val["ScoreHome"]);
                        break;
                    case 'L-Baseball':
                        baseballSetScore(val["PeriodID"], val["ScoreAway"], val["ScoreHome"]);
                }
            });
        }
    });
}


/**
 * @author mcalderon
 * @description get the prop List from Data Base by gameNum and clearbet Status
 * @returns {undefined}
 */
function getPregameLSProps(gameNum) {
    if(!$("#"+gameNum+"_props").hasClass("in")){
        $("#"+gameNum+"_game").removeClass("gameDiv");
        $("#"+gameNum+"_game").addClass("gameDiv2")
        $.ajax({
            url: "getLSPregamePropsByGameNum",
            type: 'POST',
            data: {
                "gameNum": gameNum,
                "db":$("#pgg_DBFilter").val()
            }, success: function (data) {
                var obj = JSON.parse(data);
                $("#"+gameNum+"_propsTable tr").remove();
                var table = $("#"+gameNum+"_propsTable");
                $.each(obj,function (key,val){
                    var tr=createPropTD(val["oddid"].trim(),val["ContestDesc"].trim(),val["ContestType"].trim(),val["ContestType2"].trim(),val["ContestType3"].trim(),val["ContestantName"].trim(),val["ClearBetStatus"],val["Outcome"]);
                    table.append(tr);
                });
            }
        });
    }else{
        $("#"+gameNum+"_game").removeClass("gameDiv2");
        $("#"+gameNum+"_game").addClass("gameDiv")
    }
}

/**
 * @author mcalderon
 * @param {string} contestNum
 * @param {string} contestDesc
 * @param {string} ct1
 * @param {string} ct2
 * @param {string} ct3
 * @param {string} contestants
 * @param {string} wagerType
 * @param {boolean} ClearBetStatus
 * @param {char} Outcome
 * @param {boolean} allTable
 * @description Create the row where the prop information is displayed
 * @returns {createPropTD.tr|$}
 */
function createPropTD(oddid,contestDesc,ct1,ct2,ct3,contestants,ClearBetStatus,Outcome){
    var trClass;
    if(Outcome!==""&&Outcome!==null&&Outcome!==undefined)
        trClass="graded";
    else if(ClearBetStatus==="true")
        trClass="readyToGrade";
    else 
        trClass="inProgress";
    
    var tr=$("<tr id='"+oddid+"' class='"+trClass+"'></tr>");
    var td1=$("<td class='col-md-4 desc'></td>");
    td1.append("<input type='hidden' id='pgg_"+oddid+"_ct1' value='"+ct1+"'/>");
    td1.append("<input type='hidden' id='pgg_"+oddid+"_ct2' value='"+ct2+"'/>");
    td1.append("<input type='hidden' id='pgg_"+oddid+"_ct3' value='"+ct3.replace(new RegExp("'", 'g'), "&quot;")+"'/>");
    td1.append("<input type='hidden' id='pgg_"+oddid+"_contestant' value='"+contestants.replace(new RegExp("'", 'g'), "&quot;")+"'/>");
    td1.append("<span type='hidden' id='pgg_"+oddid+"_contestDesc'>"+contestDesc.replace(new RegExp("'", 'g'), "&quot;")+" <i class='glyphicon glyphicon-info-sign bin_info' onclick='openInfoModal("+oddid+")'></i></span>");
    td1.append("<input type='hidden' id='pgg_"+oddid+"_date' value='"+$("#pgg_gameDate").val()+"'/>");
    tr.append(td1);
    
    var td2=getContestantSelect(oddid,contestants);
    tr.append(td2);
    var checked="";
    if(isCancel(contestants))
        checked="checked='checked'";
    
    var td3="<td class='col-md-1 cancel'><input type='checkbox' name='pgg_"+oddid+"_cancel' id='pgg_"+oddid+"_cancel' "+checked+"/>&nbsp;&nbsp;<label for='pgg_"+oddid+"_cancel'>Cancel</label></td>";
    tr.append(td3);
    var type=2;
    var cn="";
    cn=oddid;
    var td4="<td class='col-md-1 grade'><button type='button' class='btn btn-success' onclick='gradeLiveProps("+cn+","+type+")'>Grade</button></td>";
    tr.append(td4);
    return tr;
}

function isCancel(contestants){
    var contestantsArray=contestants.split("@");
    var cancel=true;
    $.each(contestantsArray,function (key,val){
        var contestant=val.split("*");
        if(contestant[3]==="2"){
            cancel=(cancel&&true);
        }else{
            cancel=(cancel&&false);
        }
    });
    
    return cancel;
}

/**
 * @author mcalderon
 * @param {string} contestNum
 * @param {array} contestants
 * @description process and show the contestant information (winner and win type if it already ends)
 * @returns {getContestantSelect.td|$}
 */
function getContestantSelect(oddid,contestants){
    var td=$("<td class='col-md-6 winner'></td>");
    var winner;
    var winType;
    var contestansResult="";
    var contestantsArray=contestants.split("@");
    $.each(contestantsArray,function (key,val){
        var contestant=val.split("*");
        var outcomeProvided;
        if(contestant[2]!==""){
            outcomeProvided=contestant[2];
        }else{
            outcomeProvided=contestant[3];
        }
        switch (outcomeProvided){
            case "W":
            case "1":
                winner=contestant[0];
                winType="W";
                contestansResult+=winner+";"+winType+"@";
                break;
            case "2":
                contestansResult+=contestant[0]+";L@";
                winner="";
                winType="";
                break;
            case "4":
                winner=contestant[0];
                winType="&frac12; W";
                contestansResult+=winner+";HG@";
                break;
            case "L":
            case "0":
                contestansResult+=contestant[0]+";L@";
                break;
            case "3":
                contestansResult+=contestant[0]+";HP@";
                break;
            default :
                winner="";
                winType="";
                break;
        }
    });
    
    var contestantInput=("<span id='pgg_"+oddid+"_win' class='form-control inlineElement' style='width:200px;margin:5px'>"+winner+"</span>");
    var wineTypeInput=("<span id='pgg_"+oddid+"_winType' class='form-control inlineElement'style='width:80px;margin:5px'>"+winType+"</span>");
    var moreButton=("<button type='button' class='btn btn-success inlineElement' style='margin:5px' onclick='openGradePropInfo(&#39;"+oddid+"\&#39;)'><i class='glyphicon glyphicon-plus'></i></button>");
    var hiddenWinner=("<input type='hidden' id='pgg_"+oddid+"_winner' value='"+contestansResult.substring(0,contestansResult.length-1).replace(new RegExp("'", 'g'), "&quot;")+"'/>");
    td.append(contestantInput);
    td.append(wineTypeInput);
    td.append(moreButton);
    td.append(hiddenWinner);
    return td;
}

/**
 * @author mcalderon
 * @param {String} oddId
 * @description set the contestant and clearbet information on the + modal
 */
function openGradePropInfo(oddId){
    var contestantArr=$("#pgg_"+oddId+"_contestant").val().split("@");
    $("#pgg_modal_contestDesc").text($("#pgg_"+oddId+"_contestDesc").text());
    $("#pgg_modal_contestNum").val(oddId);
    var table=$("#pgg_modal_ctTable");
    $("#pgg_modal_ctTable tbody tr").remove()
    var width=contestantArr.length*80;
    table.attr("style",width+"px");
    var contestantNums="";
    $.each(contestantArr,function(key,val){
        var W="";
        var L="";
        var HG="";
        var HP="";
        var tr=$("<tr></tr>");
        var contestant=val.split("*");
        var outcomeprovided;
        if(contestant[2]!==""){
            outcomeprovided=contestant[2];
        }else{
            outcomeprovided=contestant[3];
        }
        switch (outcomeprovided){
            case "1":
            case "W":
                W="checked='checked'";
                break;
            case "L":
            case "0":
                L="checked='checked'";
                break;
            case "3":
                HG="checked='checked'";
                break;
            case "4":
                HP="checked='checked'";
                break;
                
        }
        
        var td1=$("<td></td>");
        td1.append("<span class='from-control'>"+contestant[0]+"</span>");
        var td2=$("<td></td>");
        td2.append("<input type='radio' id='result_1' name='results_"+contestant[1]+"' value='"+contestant[0]+";W' "+W+"/>");
        var td3=$("<td></td>");
        td3.append("<input type='radio' id='result_0' name='results_"+contestant[1]+"' value='"+contestant[0]+";L' "+L+"/>");
        var td4=$("<td></td>");
        td4.append("<input type='radio' id='result_3' name='results_"+contestant[1]+"' value='"+contestant[0]+";HG' "+HG+"/>");
        var td5=$("<td></td>");
        td5.append("<input type='radio' id='result_4' name='results_"+contestant[1]+"' value='"+contestant[0]+";HP' "+HP+"/>");
        
        tr.append(td1);
        tr.append(td2);
        tr.append(td3);
        tr.append(td4);
        tr.append(td5);
        
        table.append(tr);
        contestantNums+=contestant[1]+"*";
    });
    $("#pgg_modal_contestantNums").val((contestantNums).substring(0,contestantNums.length-1));
    $("#lsGradeInfoModal").modal("toggle");
}

/**
 * @author mcalderon
 * @description set the contestant information (Win-Lose) on a hide input where it can be reached by the grade button action
 */
function setWinnerContestant(){
    var contetantNums=$("#pgg_modal_contestantNums").val().split("*");
    var contestNum=$("#pgg_modal_contestNum").val();
    var contestResults="";
    var winner="";
    var winType="";
    $.each(contetantNums,function(key,val){
        var tmp=$("input[name='results_"+val+"']:checked").val()
        contestResults+=tmp+"@";
        var tmp2=tmp.split(";");
        if(tmp2[1]==="W"||tmp2[1]==="HG"){
            winner=tmp2[0];
            winType=(tmp2[1]==="W"?tmp2[1]:"½ W");
        }
        
    });
    
    $("#pgg_"+contestNum+"_win").text(winner);
    $("#pgg_"+contestNum+"_winType").text(winType);
    $("#pgg_"+contestNum+"_winner").val((contestResults).substring(0,contestResults.length-1).replace(new RegExp("'", 'g'), "&quot;"));
    
}

/**
 * @author mcalderon
 * @param {String} period
 * @description change the prop table displayed
 */
function changePeriodTable(period){
    var buttonClass=$("#sportLiveGradeLSFilter").val().trim()==="L-Baseball"?"periodButtonsLSBaseBall":"periodButtonsLS";
    $("#pgg_periodsFilterTable button").removeClass();
    $("#pgg_periodsFilterTable button").attr("class","btn btn-default "+buttonClass);
    $("#pgg_"+period).removeClass();
    $("#pgg_"+period).attr("class","btn btn-info "+buttonClass);
    
    var activeTableId=$(".tab-content").find(".showTable");
    activeTableId.each(function (){
        var tableId=$(this).attr("id");
    
        $("#"+tableId).removeClass();
        $("#"+tableId).attr("class","propsTableLS hideTable");

        var tmp=tableId.split("_");
        $("#"+tmp[0]+"_"+tmp[1]+"_"+period).removeClass();
        $("#"+tmp[0]+"_"+tmp[1]+"_"+period).attr("class","propsTableLS showTable");
    });
}

function iceHockeySetScore(PeriodID, ScoreAway, ScoreHome){
    var scoreSpanAway;
    var scoreSpanHome;
    switch (PeriodID.trim()) {
        case "1":
            scoreSpanAway=$("#A1P");
            scoreSpanHome=$("#H1P");
            break;
        case "2":
            scoreSpanAway=$("#A2P");
            scoreSpanHome=$("#H2P");
            break;
        case "3":
            scoreSpanAway=$("#A3P");
            scoreSpanHome=$("#H3P");
            break
        case "9":
            scoreSpanAway=$("#AOT");
            scoreSpanHome=$("#HOT");
            break
        default:
            return;
    }
    scoreSpanAway.text(ScoreAway);
    scoreSpanHome.text(ScoreHome);
    
    var AFG = parseInt($("#A1P").text()) + parseInt($("#A2P").text())+ parseInt($("#A3P").text());
    var HFG = parseInt($("#H1P").text()) + parseInt($("#H2P").text())+ parseInt($("#H3P").text());
    $("#AFG").text(AFG);
    $("#HFG").text(HFG);
    $("#pgg_awayTeamScore").val(AFG);
    $("#pgg_homeTeamScore").val(HFG);
}

function baseballSetScore(PeriodID, ScoreAway, ScoreHome){
    var scoreSpanAway;
    var scoreSpanHome;
    switch (PeriodID.trim()) {
        case "40":
            scoreSpanAway=$("#IN1A");
            scoreSpanHome=$("#IN1H");
            break;
        case "41":
            scoreSpanAway=$("#IN2A");
            scoreSpanHome=$("#IN2H");
            break;
        case "42":
            scoreSpanAway=$("#IN3A");
            scoreSpanHome=$("#IN3H");
            break;
        case "43":
            scoreSpanAway=$("#IN4A");
            scoreSpanHome=$("#IN4H");
            break;
        case "44":
            scoreSpanAway=$("#IN5A");
            scoreSpanHome=$("#IN5H");
            break;
        case "45":
            scoreSpanAway=$("#IN6A");
            scoreSpanHome=$("#IN6H");
            break;
        case "46":
            scoreSpanAway=$("#IN7A");
            scoreSpanHome=$("#IN7H");
            break;
        case "47":
            scoreSpanAway=$("#IN8A");
            scoreSpanHome=$("#IN8H");
            break;
        case "48":
            scoreSpanAway=$("#IN9A");
            scoreSpanHome=$("#IN9H");
            break;
        case "49":
            scoreSpanAway=$("#EINA");
            scoreSpanHome=$("#EINP");
            break;
        case "0":
            scoreSpanAway=$("#FGA");
            scoreSpanHome=$("#FGH");
            break;
            
        default:
            return;
    }
    scoreSpanAway.text(ScoreAway);
    scoreSpanHome.text(ScoreHome);
    
    var AFG = parseInt($("#IN1A").text()) + parseInt($("#IN2A").text()) + parseInt($("#IN3A").text()) + parseInt($("#IN4A").text()) + parseInt($("#IN5A").text()) + parseInt($("#IN6A").text()) + 
            parseInt($("#IN7A").text()) + parseInt($("#IN8A").text()) + parseInt($("#IN9A").text()) + parseInt($("#EINA").text());
    var HFG = parseInt($("#IN1H").text()) + parseInt($("#IN2H").text()) +parseInt($("#IN3H").text()) +parseInt($("#IN4H").text()) +parseInt($("#IN5H").text()) +
            parseInt($("#IN6H").text()) +parseInt($("#IN7H").text()) +parseInt($("#IN8H").text()) +parseInt($("#IN9H").text()) +parseInt($("#EINH").text());
    $("#FGA").text(AFG);
    $("#FGH").text(HFG);
    $("#pgg_awayTeamScore").val(AFG);
    $("#pgg_homeTeamScore").val(HFG);
}

function basketballFootballSetScore(PeriodID, ScoreAway, ScoreHome){
    var scoreSpanAway;
    var scoreSpanHome;
    switch (PeriodID.trim()) {
        case "3":
            scoreSpanAway=$("#A1Q");
            scoreSpanHome=$("#H1Q");
            break;
        case "4":
            scoreSpanAway=$("#A2Q");
            scoreSpanHome=$("#H2Q");
            break;
        case "5":
            scoreSpanAway=$("#A3Q");
            scoreSpanHome=$("#H3Q");
            break
        case "6":
            scoreSpanAway=$("#A4Q");
            scoreSpanHome=$("#H4Q");
            break
        case "2":
            scoreSpanAway=$("#A2H");
            scoreSpanHome=$("#H2H");
            break
        default:
            return;
    }
    scoreSpanAway.text(ScoreAway);
    scoreSpanHome.text(ScoreHome);
    
    var A1H = parseInt($("#A1Q").text()) + parseInt($("#A2Q").text());
    var H1H = parseInt($("#H1Q").text()) + parseInt($("#H2Q").text());
    $("#A1H").text(A1H);
    $("#H1H").text(H1H);
    
    var A2H = parseInt($("#A3Q").text()) + parseInt($("#A4Q").text());
    var H2H = parseInt($("#H3Q").text()) + parseInt($("#H4Q").text());
    $("#A2H").text(A2H);
    $("#H2H").text(H2H);

    var AFG = parseInt($("#A1H").text()) + parseInt($("#A2H").text());
    var HFG = parseInt($("#H1H").text()) + parseInt($("#H2H").text());
    $("#AFG").text(AFG);
    $("#HFG").text(HFG);
    $("#pgg_awayTeamScore").val(AFG);
    $("#pgg_homeTeamScore").val(HFG);
}
/**
 * @author mcalderon 
 * @param {String} PeriodID
 * @param {String} ScoreAway
 * @param {String} ScoreHome
 * @param {String} Set1Score
 * @param {String} Set2Score
 * @param {String} Set3Score
 * @param {String} Set4Score
 * @param {String} Set5Score
 * @param {String} MatchScore
 * @description fill tennis scoreboard
 */
function tennisSetScore(PeriodID, ScoreAway, ScoreHome,Set1Score,Set2Score,Set3Score,Set4Score,Set5Score,MatchScore){
    $("#GameA").text(ScoreAway);
    $("#GameH").text(ScoreHome);
    Set1Score=(Set1Score!==null)?Set1Score=Set1Score.split(":"):[0,0];
    $("#1SetA").text(Set1Score[1]);
    $("#1SetH").text(Set1Score[0]);
    Set2Score=(Set2Score!==null)?Set2Score=Set2Score.split(":"):[0,0];
    $("#2SetA").text(Set2Score[1]);
    $("#2SetH").text(Set2Score[0]);
    Set3Score=(Set3Score!==null)?Set3Score=Set3Score.split(":"):[0,0];
    $("#3SetA").text(Set3Score[1]);
    $("#3SetH").text(Set3Score[0]);
    Set4Score=(Set4Score!==null)?Set4Score=Set4Score.split(":"):[0,0];
    $("#4SetA").text(Set4Score[1]);
    $("#4SetH").text(Set4Score[0]);
    Set5Score=(Set5Score!==null)?Set5Score=Set5Score.split(":"):[0,0];
    $("#5SetA").text(Set5Score[1]);
    $("#5SetH").text(Set5Score[0]);
    MatchScore=(MatchScore!==null)?MatchScore=MatchScore.split(":"):[0,0];
    $("#AFG").text(MatchScore[1]);
    $("#HFG").text(MatchScore[0]);
}

/**
 * @author mcalderon
 * @param {type} PeriodID
 * @param {type} ScoreAway
 * @param {type} ScoreHome
 * @param {type} Corners
 * @param {type} YellowCard
 * @param {type} RedCards
 * @param {type} periodStatus
 * @description fill the soccer scoreboard
 */
function soccerSetScore(PeriodID,ScoreAway,ScoreHome,Corners,YellowCard,RedCards,periodStatus){
    if(periodStatus.trim()==="N"){
        var scoreSpanAway;
        var scoreSpanHome;
        switch (PeriodID.trim()) {
            case "1":
                scoreSpanAway=$("#A1H");
                scoreSpanHome=$("#H1H");
                break;
            case "2":
                scoreSpanAway=$("#A2H");
                scoreSpanHome=$("#H2H");
                break;
            case "3":
                scoreSpanAway=$("#AET");
                scoreSpanHome=$("#HET");
                break;
            case "0":
                scoreSpanAway=$("#AFG");
                scoreSpanHome=$("#HFG");
                break
            default:
                return;
        }
        var yCards=["",""];
        var rCards=["",""];
        var corners=["",""];
        if(YellowCard!==null)
            yCards=YellowCard.split(":");
        if(RedCards!==null)
            rCards=RedCards.split(":");
        if(Corners!==null)
            corners=Corners.split(":");

       $("#YCA").text(yCards[1]);
       $("#YCH").text(yCards[0]);

       $("#RCA").text(rCards[1]);
       $("#RCH").text(rCards[0]);

       $("#COA").text(corners[1]);
       $("#COH").text(corners[0]);

        scoreSpanAway.text(ScoreAway);
        scoreSpanHome.text(ScoreHome);

        var AFG = parseInt($("#A1H").text()) + parseInt($("#A2H").text());
        var HFG = parseInt($("#H1H").text()) + parseInt($("#H2H").text());

        $("#AFG").text(AFG);
        $("#HFG").text(HFG);
        $("#pgg_awayTeamScore").val(AFG);
        $("#pgg_homeTeamScore").val(HFG);
    }
}

/**
 * @author mcalderon
 * @description open the main bets info modal
 */
function openLiveGradeAditionalInfoModal(){
    var date=$("#pgg_gameDate").val();
    $("#glg_input_dailyFigure").val(date);
    if($("#pgg_actionSP").val()==="A"){
        $("#glg_spread_g").prop("checked",true);
        $("#glg_spread_na").prop("checked",false);
    }else if($("#pgg_actionSP").val()==="C"){
        $("#glg_spread_na").prop("checked",true);
        $("#glg_spread_g").prop("checked",false);
    }
    if($("#pgg_actionML").val()==="A"){
        $("#glg_money_g").prop("checked",true);
        $("#glg_money_na").prop("checked",false);
    }else if($("#pgg_actionML").val()==="C"){
        $("#glg_money_na").prop("checked",true);
        $("#glg_money_g").prop("checked",false);
    }
    if($("#pgg_actionTL").val()==="A"){
        $("#glg_total_g").prop("checked",true);
        $("#glg_total_na").prop("checked",false);
    }else if($("#pgg_actionTL").val()==="C"){
        $("#glg_total_na").prop("checked",true);
        $("#glg_total_g").prop("checked",false);
    }
    if($("#pgg_cancel").val()==="C"){
        $("#pgg_cancelGrade").prop("checked",true);
    }else{
        $("#pgg_cancelGrade").prop("checked",false);
    }
    $("#liveGradeInfoModal").modal("toggle");
}

/**
 * @author mcalderon
 * @description grade a Game
 * @param {String} sp Action for Spreads (A=action, C=No Action)
 * @param {String} tl Action for totals (A=action, C=No Action)
 * @param {String} ml Action for MoneyLines (A=action, C=No Action)
 * @param {String} team1 Away team name
 * @param {String} team2 home team name
 * @param {int} period period number (Always 0);
 * @param {String} periodname Always Game
 * @param {date} gameDate 
 * @param {int} scoreAway 
 * @param {int} pointsAway == scoreAway
 * @param {int} scoreHome 
 * @param {int} pointsHome == ScoreHome
 * @param {String} subSport 
 */
function closeGames(){
    $.ajax({
        url: "checkPendingProps/"+$("#pgg_liveGames").val(),
        success: function (data) {
            alert(data);
        }
    });
}
/**
 * @author mcalderon
 * @description not used yet
 * @returns {undefined}
 */
function validateSetAdInfo(){
    var gameDateTime=$("#glg_gameDateTime").val().split(" ");
    var dfDate=$("#glg_input_dailyFigure").val();
    var dfDateArr=dfDate.split("-");
    var d1=new Date(dfDateArr[2]+"-"+dfDateArr[0]+"-"+dfDateArr[1]);
    var d2=new Date(gameDateTime[0]);
    if(d1.getTime()!==d2.getTime()){
        var date1=(d1.getMonth() + 1) + '/' + (d1.getDate()+1) + '/' +  d1.getFullYear();
        var date2=(d2.getMonth() + 1) + '/' + (d2.getDate()+1) + '/' +  d2.getFullYear();
        var message="The game date ("+date2+") is different than the daily Figure Date("+datea+"), Do you want to continue?";
	bootbox.confirm(message,function (result){
            if(result){
                setAditionalLiveGradeInfo();
            }
        });        
    }else{
        setAditionalLiveGradeInfo();
    }
}

/**
 * @author mcalderon
 * @description not used yet
 * @returns {undefined}
 */
function setAditionalLiveGradeInfo(){
    if($("#glg_spread_g").is(":checked")){
        $("#pgg_actionSP").val("A");
    }else if($("#glg_spread_na").is(":checked")){
        $("#pgg_actionSP").val("C");
    }
    if($("#glg_money_g").is(":checked")){
        $("#pgg_actionML").val("A");
    }else if($("#glg_money_na").is(":checked")){
        $("#pgg_actionML").val("C");
    }
    if($("#glg_total_g").is(":checked")){
        $("#pgg_actionTL").val("A");
    }else if($("#glg_total_na").is(":checked")){
        $("#pgg_actionTL").val("C");
    }
    $("#pgg_df").val($("#glg_input_dailyFigure").val());
    
    if($("#glg_cancelGrade").is(":checked")){
        $("#pgg_cancel").val("C");
    }else if($("#glg_reopen").is(":checked")){
        $("#pgg_actionTL").val("RO");
        $("#pgg_actionML").val("RO");
        $("#pgg_actionSP").val("RO");
    }else{
        $("#pgg_cancel").val("A");
    }
    
    $("#liveGradeInfoModal").modal("toggle");
}

/**
 * @author mcalderon
 * @description action=selected <=> no action= not selected
 * @param {object} fieldId
 */
function gradeNoactionLiveSelection(fieldId) {
    var id = fieldId.split("_");
    if (id[2] === "g") {
        if ($("#" + fieldId).is(":checked")) {
            $("#glg_" + id[1] + "_na").prop("checked", false);
        }
    } else if (id[2] === "na") {
        if ($("#" + fieldId).is(":checked")) {
            $("#glg_" + id[1] + "_g").prop("checked", false);
        }
    }
}

/**
 * @author mcalderon
 * @param {type} contestNum
 * @param {type} type
 * @param {type} doubleChance
 * @description send to grade according to the bettype (ML,TL,SP) and set the row color on black
 * @returns {undefined}
 */
function gradeLiveProps(contestNum,type,doubleChance){
    var validate=true;
    switch (type){
        case 2:
            if($("#pgg_"+contestNum+"_winner").val()===""){
                validate=false;
                alert("There is no winner for "+$("#pgg_"+contestNum+"_contestDesc").val());
            }else{
                sendGradeMoneyLine(contestNum,doubleChance);
            }
            break;
    }
    if(validate){
        $("tr[id^='"+contestNum+"']").find("button").removeAttr("class");
        $("tr[id^='"+contestNum+"']").find("button").attr("class","btn btn-default");
        $("tr[id^='"+contestNum+"']").find("button").prop("disabled",true);
        $("tr[id^='"+contestNum+"']").removeAttr("class");
        $("tr[id^='"+contestNum+"']").attr("class","gradeInProgress");
    }
}

/**
 * @author mcalderon
 * @param {type} contestNum
 * @param {type} contestantsArray
 * @param {type} dailyFigure
 * @param {type} cancel
 * @description catch the prop information and send to grade
 * @returns {undefined}
 */
function sendGradeProps(contestNum,contestantsArray,dailyFigure,cancel){
    $.ajax({
            url: "getProspGrading",
            type: 'POST',
            data: {
                "db":$("#pgg_DBFilter").val(),
                "contestNum":(contestNum+"").replace("_A",""),
                "ct":$("#pgg_"+contestNum+"_ct1").val(),
                "ct2":$("#pgg_"+contestNum+"_ct2").val(),
                "ct3":$("#pgg_"+contestNum+"_ct3").val(),
                "cd":$("#pgg_"+contestNum+"_contestDesc").text(),
                "contestants":contestantsArray,
                "points":$("#pgg_"+contestNum+"_points").val(),
                "df":dailyFigure,
                "status":cancel,
                "contestantNumbers":$("#pgg_"+contestNum+"_ctString").val()
            },success: function (data) {
    //            alert(data);
            }
        });
}

function sendMassiveGrading(){
    var trs=$("#pgg_propsTable .readyToGrade");
    var ids=[];
    $.each(trs,function (key,val){
        ids.push($(this).attr("id"));
        $(this).removeClass("readyToGrade");
        $(this).attr("class","gradeInProgress");
    })
    gradingArrayCreation(ids);
}


function gradingArrayCreation(ids){
    var gradingArray=[];
    $.each(ids,function (key,val){
        var cancel=$("#pgg_"+val+"_cancel").is(":checked")?"C":"A";

        var dateTime;
        var dailyFigure;
        if($("#glg_input_dailyFigure").val()===""){
            dateTime=$("#pgg_"+val+"_date").val().split(" ");
            var dateArray=dateTime[0].split("-");
            dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
        }else{
            dateTime=$("#glg_input_dailyFigure").val();
            var dateArray=dateTime.split("-");
            dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
        }
        
        gradingArray.push({
            contestNum:(val+"").replace("_A",""),
            ct:$("#pgg_"+val+"_ct1").val(),
            ct2:$("#pgg_"+val+"_ct2").val(),
            ct3:$("#pgg_"+val+"_ct3").val(),
            cd:$("#pgg_"+val+"_contestDesc").text(),
            contestants:$("#pgg_"+val+"_winner").val(),
            df:dailyFigure,
            status:cancel,
            contestantNumbers:$("#pgg_"+val+"_ctString").val(),
            contestDate:$("#pgg_"+val+"_date").val()
        })
    });
    
    $.ajax({
        url: "massiveGrading",
        type: 'POST',
        data: {
            "array":gradingArray
        },success: function (data) {
            
        }
    })
    
}


/**
 * @author mcalderon
 * @param {type} contestNum
 * @description format the information to send to grade
 * @returns {undefined}
 */
function sendGradeMoneyLine(contestNum){
    var contestantsArray=$("#pgg_"+contestNum+"_winner").val().split("@");
    var cancel=$("#pgg_"+contestNum+"_cancel").is(":checked")?"C":"A";
    
    var dateTime;
    var dailyFigure;
    if($("#glg_input_dailyFigure").val()===""){
        dateTime=$("#pgg_"+contestNum+"_date").val().split(" ");
        var dateArray=dateTime[0].split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    }else{
        dateTime=$("#glg_input_dailyFigure").val();
        var dateArray=dateTime.split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    }
    sendGradeProps(contestNum,contestantsArray,dailyFigure,cancel);
}

function pgg_deleteMarkets(){
    $.ajax({
        url: "clearNoBetProps/"+$("#pgg_liveGames").val(),
        success: function (data) {
            if ($("#sportLiveGradeLSFilter").val() === "" || $("#sportLiveGradeLSFilter").val() === null)
                alert("There's no sport selected");
            else if ($("#pgg_gameDate").val() === "" || $("#pgg_gameDate").val() === null)
                alert("There's no date selected");
            else if ($("#pgg_liveGames").val() === "" || $("#pgg_liveGames").val() === null)
                alert("There's no game selected");
            else {
                setScorePeriods();
            }
        }
    });
}


/**
 * @author mcalderon
 * @description load the prop Groups, create a tab for each group and a table for each period in each group id tab
 */
function loadPropLSGroups(){
    var sport=$("#sportLiveGradeLSFilter").val();
    var periodButtons=$("#pgg_periodsFilterTable").find("button");
    getLiveLSProps();
            
}

function sendPeriodScore(){
    var closeOpt=($("#cpmcloseOption").is(":checked")?1:2);
    $.ajax({
        url: "sendPeriodScore",
        type: 'POST',
        data: {
            "gameNum":$("#pgg_liveGames").val(),
            "awayScore":$("#awawScore").val(),
            "homeScore":$("#homeScore").val(),
            "periodID":$("#cpm_PeriodId").val(),
            "option":closeOpt
        },success: function (data) {
            alert(data)
        }
    })
}

function openInfoModal(contestNum){
    $("#bin_table tr").remove()
    $.ajax({
        url: "getPregameBetInfo",
        type: 'POST',
        data: {
            "contestNum":contestNum,
            "db":$("#pgg_DBFilter").val()
        },
        success: function (data) {
            var obj=JSON.parse(data);
            var table=$("#bin_table");
            $.each(obj,function (key,val){
                var tr=$("<tr>"+val[""]+"</tr>");
                var td1=$("<td class='bim_ticket'>"+val["TicketNumber"]+"</td>");
                tr.append(td1);
                var td2=$("<td class='bim_date'>"+val["PostedDateTime"]+"</td>");
                tr.append(td2);
                var td3=$("<td class='bim_custId'>"+val["CustomerID"]+"</td>");
                tr.append(td3);
                var td4=$("<td class='bim_contestDesc'>"+val["ContestDesc"]+"</td>");
                tr.append(td4);
                var td5=$("<td class='bim_contestant'>"+val["ContestantName"]+"</td>");
                tr.append(td5);
                var td6=$("<td  class='bim_threshold'>"+val["ThresholdLine"]+"</td>");
                tr.append(td6);
                var td7=$("<td class='bim_finalMoney'>"+val["FinalMoney"]+"</td>");
                tr.append(td7);
                var td8=$("<td class='bim_amountWagered'>"+val["AmountWagered"]+"</td>");
                tr.append(td8);
                var td9=$("<td class='bim_toWin'>"+val["ToWinAmount"]+"</td>");
                tr.append(td9);
                var td10=$("<td  class='bim_outcome'>"+val["Outcome"]+"</td>");
                tr.append(td10);
                
                table.append(tr);
            });
            $("#betsPregameInfoModal").modal("toggle");
        }
    })
    
}