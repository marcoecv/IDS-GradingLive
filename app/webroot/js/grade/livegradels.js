var periodsOrder = [2,3,4,5,6,7,1];
var periodsOrderBaskeball = [4,5,2,6,7,3,1];
var periodsOrderHockey = [2,3,4,5,1];
var periodsOrderBaseball = [6,7,8,9,10,11,12,13,14,15,1];

var periodInPlay;
var PropGroups;


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

    $('#glgls_gameDateDiv').datetimepicker({
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });


    $("#glgls_gameDate").change(function () {
        getGameLSByDate();
    });

    $("#glg_setGradeInfoButon").click(function (){
        validateSetAdInfo();
    });
    
    
    $("#glgls_getGamePropsInfo").click(function () {
        if ($("#sportLiveGradeLSFilter").val() === "" || $("#sportLiveGradeLSFilter").val() === null)
            alert("There's no sport selected");
        else if ($("#glgls_gameDate").val() === "" || $("#glgls_gameDate").val() === null)
            alert("There's no date selected");
        else if ($("#glgls_liveGames").val() === "" || $("#glgls_liveGames").val() === null)
            alert("There's no game selected");
        else {
            setScorePeriods();
        }
    });
    
    $("#glgls_gradeReadyProps").click(function (){
        sendMassiveGrading();
//        massiveGrading();
    });
    
    $("#glgls_deleteMarkets").click(function (){
        if(confirm("Are You sure you want to delete all correlated props?"))
            glgls_deleteMarkets();
    });
    
    $("#glgls_sendToArchive").click(function (){
        closeGames();
    });
    
    $("#glgls_closePeriods").click(function (){
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
    
    $("#glgls_modal_gradeInfo").click(function (){
        setWinnerContestant();
    });
});
/**
 * @author mcalderon
 * @param {type} sport
 * @description Set the propGruops for LS in a global var
 */
function setLSPropGroups(sport){
    switch (sport){
        case "L-Soccer":
            PropGroups=[{"GroupName":"Spread","GroupID":"Spread"},
            {"GroupName":"Money Line","GroupID":"Money"},
            {"GroupName":"Total","GroupID":"Total"},
            {"GroupName":"Additional","GroupID":"Additional"},
            {"GroupName":"Cards","GroupID":"Cards"},
            {"GroupName":"Corners","GroupID":"Corners"}];
            break;
        case "L-Tennis":
            PropGroups=[{"GroupName":"Spread","GroupID":"Spread"},
            {"GroupName":"Total","GroupID":"Total"},
            {"GroupName":"Money Line","GroupID":"Money"},
            {"GroupName":"Additional","GroupID":"Additional"},
            {"GroupName":"Scoring","GroupID":"SC"}];
            break;
        case "L-Basketball":
        case "L-Football":
            PropGroups=[{"GroupName":"Spread","GroupID":"Spread"},
            {"GroupName":"Total","GroupID":"Total"},
            {"GroupName":"Money Line","GroupID":"Money"},
            {"GroupName":"Additional","GroupID":"Additional"}];
            break;
        case "L-Ice Hockey":
            PropGroups=[{"GroupName":"Spread","GroupID":"Spread"},
            {"GroupName":"Total","GroupID":"Total"},
            {"GroupName":"Money Line","GroupID":"Money"},
            {"GroupName":"Additional","GroupID":"Additional"}];
            break;
    }
}

/**
 * @author mcalderon
 * @description AJAX function to get all gameNums and teams by date param and set them in the "Game" select
 */
function getGameLSByDate() {
    if ($("#glg_gameDate").val() !== "" && $("#sportLiveGradeFilter").val() !== "" && $("#subsportLiveGradeFilter").val() !== "") {
        $.ajax({
            url: "../grade/getGameNumsByCompany",
            type: 'POST',
            data: {
                "sport": $("#sportLiveGradeLSFilter").val().trim(),
                "dateFrom": $("#glgls_gameDate").val(),
                "company": 3
            }, success: function (data) {
                var obj = JSON.parse(data);
                var select = $("#glgls_liveGames");
                $("#glgls_liveGames option").remove();
                var opt = new Option('', '');
                select.append(opt);
                $.each(obj, function (key, val) {
                    var opt = new Option(val['Team1ID'].trim() + " vs " + val['Team2ID'].trim(), val['GameNum'].trim());
                    select.append(opt);
                });
            }
        });
    } else {
        alert("Sport, Sub Sport, and Date are required to select a game");
    }
}

/**
 * @author mcalderon
 * @description set the periods order according to the sport selected (in LS the order is the same for tennis and soccer) */
function setScorePeriods() {
    var sport = $("#sportLiveGradeLSFilter").val();
    $.ajax({
        url: "getDBPeriodBySport/" + sport,
        complete: function () {
            getGameScoreInfo();
        },
        success: function (data) {
            var obj = JSON.parse(data);
            setScoreboardTableHeaders(obj);
            var periodsArr = [];
            var array;
            if(sport.trim()==="L-Basketball"||sport.trim()==="L-Football")
                array=periodsOrderBaskeball;
            else if(sport.trim()==="L-Ice Hockey")
                array=periodsOrderHockey;
            else if(sport.trim()==="L-Baseball")
                array=periodsOrderBaseball;
            else
                array = periodsOrder;
            
            $.each(array, function (key, val) {
                if (obj["row" + val] !== undefined)
                    periodsArr.push(obj["row" + val]);
            });
            setPeriodButtons(periodsArr);
            setGroupsButtons();
        }
    });
}

function gradeLiveGame(){
    if($("#glgls_awayTeamScore").val()===""||$("#glgls_homeTeamScore").val()===""){
        alert("There is no score to grade this game");
    }else{
        var df=$("#glgls_df").val()===""?$("#glgls_gameDate").val():$("#glgls_df").val();
        $.ajax({
            url: "gradeindividualgame",
            type: 'POST',
            data: {
                "sp": $("#glgls_actionSP").val(),
                "ml": $("#glgls_actionML").val(),
                "tl": $("#glgls_actionTL").val(),
                "df": df,
                "team1": $("#glgls_awayTeam").val(),
                "team2": $("#glgls_homeTeam").val(),
                "period": 0,
                "periodname": "Game",
                "rot": $("#glgls_rot").val(),
                "gameDate": $("#glgls_gameDateTime").val(),
                "scoreAway": $("#glgls_awayTeamScore").val(),
                "pointsAway": $("#glgls_awayTeamScore").val(),
                "scoreHome": $("#glgls_homeTeamScore").val(),
                "pointsHome": $("#glgls_homeTeamScore").val(),
                "subSport": $("#sportLiveGradeLSFilter").val(),
                "adjustlinehome": "",
                "adjustlineaway": "",
                "comments": ""
            }, success: function (data) {
                alert(data);
            }
        });
    }
}


/**
 * @author mcalderon
 * @description set the table header for the scorboard table by sport type
 */
function setScoreboardTableHeaders() {
    var thead = $("#glgls_scoreBoardTable thead");
    var trHead = $("<tr></tr>");
    $("#glgls_scoreBoardTable thead tr").remove();
    trHead.append("<th>Teams</th>");
    switch ($("#sportLiveGradeLSFilter").val().trim()) {
        case "L-Soccer":
            trHead.append("<th>1H</th>");
            trHead.append("<th>2H</th>");
            trHead.append("<th>ET</th>");
            trHead.append("<th>Y. Card</th>");
            trHead.append("<th>R. Card</th>");
            trHead.append("<th>Corners</th>");
            trHead.append("<th>Game</th>");
            break;
        case "L-Tennis":
            trHead.append("<th>Game</th>");
            trHead.append("<th>1S</th>");
            trHead.append("<th>2S</th>");
            trHead.append("<th>3S</th>");
            trHead.append("<th>4S</th>");
            trHead.append("<th>5S</th>");
            trHead.append("<th>Match</th>");
            break;
        case "L-Basketball":
        case "L-Football":
            trHead.append("<th>1Q</th>");
            trHead.append("<th>2Q</th>");
            trHead.append("<th>1H</th>");
            trHead.append("<th>3Q</th>");
            trHead.append("<th>4Q</th>");
            trHead.append("<th>2H</th>");
            trHead.append("<th>Game</th>");
            break;
        case "L-Ice Hockey":
            trHead.append("<th>1P</th>");
            trHead.append("<th>2P</th>");
            trHead.append("<th>3P</th>");
            trHead.append("<th>OT</th>");
            trHead.append("<th>Game</th>");
            break;
        case "L-Baseball":
            trHead.append("<th>IN1</th>");
            trHead.append("<th>IN2</th>");
            trHead.append("<th>IN3</th>");
            trHead.append("<th>IN4</th>");
            trHead.append("<th>IN5</th>");
            trHead.append("<th>IN6</th>");
            trHead.append("<th>IN7</th>");
            trHead.append("<th>IN8</th>");
            trHead.append("<th>IN9</th>");
            trHead.append("<th>EX-IN</th>");
            trHead.append("<th>Game</th>");
    }
    thead.append(trHead);
    setScoreboardBodyTable();
}

/**
 * @author mcalderon
 * @description create an span tag for the score on each period and by team(Hom, Away)
 */
function setScoreboardBodyTable() {
    var tbody = $("#glgls_scoreBoardTable tbody");
    var trBodyAway = $("<tr></tr>");
    var trBodyHome = $("<tr></tr>");
    $("#glgls_scoreBoardTable tbody tr").remove();
    trBodyAway.append("<td><span id='awayTeam'>0</span></td>");
    trBodyHome.append("<td><span id='homeTeam'>0</span></td>");
    switch ($("#sportLiveGradeLSFilter").val().trim()) {
        case "L-Soccer":
            trBodyAway.append("<td><span id='A1H'>0</span></td>");
            trBodyAway.append("<td><span id='A2H'>0</span></td>");
            trBodyAway.append("<td><span id='AET'>0</span></td>");
            trBodyAway.append("<td><span id='YCA'>0</span></td>");
            trBodyAway.append("<td><span id='RCA'>0</span></td>");
            trBodyAway.append("<td><span id='COA'>0</span></td>");
            trBodyAway.append("<td><span id='AFG'>0</span></td>");

            trBodyHome.append("<td><span id='H1H'>0</span></td>");
            trBodyHome.append("<td><span id='H2H'>0</span></td>");
            trBodyHome.append("<td><span id='HET'>0</span></td>");
            trBodyHome.append("<td><span id='YCH'>0</span></td>");
            trBodyHome.append("<td><span id='RCH'>0</span></td>");
            trBodyHome.append("<td><span id='COH'>0</span></td>");
            trBodyHome.append("<td><span id='HFG'>0</span></td>");
            break;
        case "L-Tennis":
            trBodyAway.append("<td><span id='GameA'>0</span></td>");
            trBodyAway.append("<td><span id='1SetA'>0</span></td>");
            trBodyAway.append("<td><span id='2SetA'>0</span></td>");
            trBodyAway.append("<td><span id='3SetA'>0</span></td>");
            trBodyAway.append("<td><span id='4SetA'>0</span></td>");
            trBodyAway.append("<td><span id='5SetA'>0</span></td>");
            trBodyAway.append("<td><span id='AFG'>0</span></td>");

            trBodyHome.append("<td><span id='GameH'>0</span></td>");
            trBodyHome.append("<td><span id='1SetH'>0</span></td>");
            trBodyHome.append("<td><span id='2SetH'>0</span></td>");
            trBodyHome.append("<td><span id='3SetH'>0</span></td>");
            trBodyHome.append("<td><span id='4SetH'>0</span></td>");
            trBodyHome.append("<td><span id='5SetH'>0</span></td>");
            trBodyHome.append("<td><span id='HFG'>0</span></td>");
            break;
        case "L-Basketball":
        case "L-Football":
            trBodyAway.append("<td><span id='A1Q'>0</span></td>");
            trBodyAway.append("<td><span id='A2Q'>0</span></td>");
            trBodyAway.append("<td><span id='A1H'>0</span></td>");
            trBodyAway.append("<td><span id='A3Q'>0</span></td>");
            trBodyAway.append("<td><span id='A4Q'>0</span></td>");
            trBodyAway.append("<td><span id='A2H'>0</span></td>");
            trBodyAway.append("<td><span id='AFG'>0</span></td>");

            trBodyHome.append("<td><span id='H1Q'>0</span></td>");
            trBodyHome.append("<td><span id='H2Q'>0</span></td>");
            trBodyHome.append("<td><span id='H1H'>0</span></td>");
            trBodyHome.append("<td><span id='H3Q'>0</span></td>");
            trBodyHome.append("<td><span id='H4Q'>0</span></td>");
            trBodyHome.append("<td><span id='H2H'>0</span></td>");
            trBodyHome.append("<td><span id='HFG'>0</span></td>");
            break;
        case "L-Ice Hockey":
            trBodyAway.append("<td><span id='A1P'>0</span></td>");
            trBodyAway.append("<td><span id='A2P'>0</span></td>");
            trBodyAway.append("<td><span id='A3P'>0</span></td>");
            trBodyAway.append("<td><span id='AOT'>0</span></td>");
            trBodyAway.append("<td><span id='AFG'>0</span></td>");

            trBodyHome.append("<td><span id='H1P'>0</span></td>");
            trBodyHome.append("<td><span id='H2P'>0</span></td>");
            trBodyHome.append("<td><span id='H3P'>0</span></td>");
            trBodyHome.append("<td><span id='HOT'>0</span></td>");
            trBodyHome.append("<td><span id='HFG'>0</span></td>");
            break;
        case "L-Baseball":
            trBodyAway.append("<td><span id='IN1A'>0</span></td>");
            trBodyAway.append("<td><span id='IN2A'>0</span></td>");
            trBodyAway.append("<td><span id='IN3A'>0</span></td>");
            trBodyAway.append("<td><span id='IN4A'>0</span></td>");
            trBodyAway.append("<td><span id='IN5A'>0</span></td>");
            trBodyAway.append("<td><span id='IN6A'>0</span></td>");
            trBodyAway.append("<td><span id='IN7A'>0</span></td>");
            trBodyAway.append("<td><span id='IN8A'>0</span></td>");
            trBodyAway.append("<td><span id='IN9A'>0</span></td>");
            trBodyAway.append("<td><span id='EINA'>0</span></td>");
            trBodyAway.append("<td><span id='FGA'>0</span></td>");
            
            trBodyHome.append("<td><span id='IN1H'>0</span></td>");
            trBodyHome.append("<td><span id='IN2H'>0</span></td>");
            trBodyHome.append("<td><span id='IN3H'>0</span></td>");
            trBodyHome.append("<td><span id='IN4H'>0</span></td>");
            trBodyHome.append("<td><span id='IN5H'>0</span></td>");
            trBodyHome.append("<td><span id='IN6H'>0</span></td>");
            trBodyHome.append("<td><span id='IN7H'>0</span></td>");
            trBodyHome.append("<td><span id='IN8H'>0</span></td>");
            trBodyHome.append("<td><span id='IN9H'>0</span></td>");
            trBodyHome.append("<td><span id='EINH'>0</span></td>");
            trBodyHome.append("<td><span id='FGH'>0</span></td>");
            break;
    }
    tbody.append(trBodyAway);
    tbody.append(trBodyHome);


}

/**
 * @author mcalderon
 * @description grade all clearbet props un a specific group / period table
 */
function massiveGrading(){
    var table=$("#glgls_tabs .active").find(".showTable");
    var props=table.find(".readyToGrade");
    $(props).each(function (){
        $(this).find("button").trigger("click");
    });
}
/**
 * @author mcalderon
 * @param {array} periods
 * @description set the period buttons used to change the prop display
 */
function setPeriodButtons(periods) {
    var table = $("#glgls_periodsFilterTable");
    $("#glgls_periodsFilterTable tr").remove();
    var tr = $("<tr></tr>");
    var i=0;
    var cant=periods.length;
    $.each(periods, function (key, val) {
        var activeClass="btn-default";
        if(i===0)
            activeClass="btn-info";
        tr.append('<button type="button" class="btn '+activeClass+' " typeData="1" name="glgls_' + val["PeriodNumber"].trim() + '" id="glgls_' + val["PeriodNumber"].trim() + '" value="' + val["PeriodNumber"].trim() + '" style="width: calc( 100% / '+cant+');" onclick="getLiveLSProps(this)">' + val["PeriodDescription"].trim() + '</button>')
        i++;
    });
    table.append(tr);
}


function setGroupsButtons(){
    var gameNum=$("#glgls_liveGames").val();
    $.ajax({
        url: "getPropGroups/"+gameNum,
        success: function (data) {
            var obj = JSON.parse(data);
            var table=$("#glgls_groupsFilterTable");
            var cant=Object.keys(obj).length+1;
            $("#glgls_groupsFilterTable button").remove();
            $.each(obj,function (key,val){
                table.append("<button type='button'  class='btn btn-"+(val["GroupID"]!=="3"?"default":"success")+"' value='"+val["GroupID"]+"' onclick='getLiveLSProps(this)' typeData='2' style='width: calc( 100% / "+cant+");'>"+val["Group"]+"</button>")
            });
            table.append("<button type='button' class='btn btn-default' onclick='getLiveLSProps(this)' typeData='2' value='all' style='width: calc( 100% / "+cant+");'>All</button>")
        }
    })
}
/**
 * @author mcalderon
 * @description get the score Info and according to the sport send to fill the scoreboard
 * @returns {undefined}
 */
function getGameScoreInfo() {
    $.ajax({
        url: "getDBscoreByGameNum/" + $("#glgls_liveGames").val(),
        complete: function () {
            loadPropLSGroups();
        },
        success: function (data) {
            var obj = JSON.parse(data);
            $("#awayTeam").text(obj["row1"]["Team1ID"]);
            $("#homeTeam").text(obj["row1"]["Team2ID"]);
            $("#glgls_awayTeam").val(obj["row1"]["Team1ID"]);
            $("#glgls_homeTeam").val(obj["row1"]["Team2ID"]);
            $("#glgls_rot").val(obj["row1"]["Rot1Num"]);
            $("#glgls_gameDateTime").val(obj["row1"]["GameDate"]);
            $("#glgls_gradeGameButton").attr("class","btn btn-success");
            if(obj["row1"]["GradeDateTime"]!==""&&obj["row1"]["GradeDateTime"]!==null){
                $("#glgls_gradeGameButton").attr("class","btn btn-danger");
                $("#glgls_gradeGameButton").text("Re-Grade");
            }else{
                $("#glgls_gradeGameButton").attr("class","btn btn-success");
                $("#glgls_gradeGameButton").text("Grade");
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
function getLiveLSProps(button) {
    if($(button).attr("typedata")==="1"){
        selectPeriodButton(button);
    }else if($(button).attr("typedata")==="2"){
        selectGroupButton(button);
    }
    var period=$("#glgls_periodsFilterTable").find(".btn-info").val();
    var group=$("#glgls_groupsFilterTable").find(".btn-success").val();
    var clearbet = $("#glgls_filter").val();
    if(group==="all"){
        clearbet=3;
    }
    $.ajax({
        url: "getLiveLSProps",
        type: 'POST',
        data: {
            "gameNum": $("#glgls_liveGames").val(),
            "clearBetStatus": clearbet,
            "period":period,
            "group":group
        }, success: function (data) {
            var obj = JSON.parse(data);
            $("#glgls_propsTable tr").remove();
            var table = $("#glgls_propsTable");
            $.each(obj,function (key,val){
                var tr=createPropTD(val["ContestNum"].trim(),val["ContestDesc"].trim(),val["ContestType"].trim(),val["ContestType2"].trim(),val["ContestType3"].trim(),val["ContestantName"].trim(),val["group"].trim(),val["ClearBetStatus"],val["Outcome"]);
                table.append(tr);
            });
        }
    });
}


function selectPeriodButton(button){
    $("#glgls_periodsFilterTable").find(".btn-info").attr("class","btn btn-default periodButtonsLS");
    $(button).attr("class","btn btn-info periodButtonsLS");
}

function selectGroupButton(button){
    $("#glgls_groupsFilterTable").find(".btn-success").attr("class","btn btn-default");
    $(button).attr("class","btn btn-success");
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
function createPropTD(contestNum,contestDesc,ct1,ct2,ct3,contestants,wagerType,ClearBetStatus,Outcome){
    var trClass;
    if(Outcome!==""&&Outcome!==null&&Outcome!==undefined)
        trClass="graded";
    else if(ClearBetStatus==="true")
        trClass="readyToGrade";
    else 
        trClass="inProgress";
    
    var tr=$("<tr id='"+contestNum+"' class='"+trClass+"'></tr>");
    var td1=$("<td class='desc'></td>");
    td1.append("<input type='hidden' id='glgls_"+contestNum+"_ct1' value='"+ct1+"'/>");
    td1.append("<input type='hidden' id='glgls_"+contestNum+"_ct2' value='"+ct2+"'/>");
    td1.append("<input type='hidden' id='glgls_"+contestNum+"_ct3' value='"+ct3.replace(new RegExp("'", 'g'), "&quot;")+"'/>");
    td1.append("<input type='hidden' id='glgls_"+contestNum+"_contestant' value='"+contestants.replace(new RegExp("'", 'g'), "&quot;")+"'/>");
    td1.append("<span type='hidden' id='glgls_"+contestNum+"_contestDesc'>"+contestDesc.replace(new RegExp("'", 'g'), "&quot;")+" <i class='glyphicon glyphicon-info-sign bin_info' onclick='openInfoModal("+contestNum+")'></i></span>");
    td1.append("<input type='hidden' id='glgls_"+contestNum+"_wt' value='"+wagerType+"'/>");
    td1.append("<input type='hidden' id='glgls_"+contestNum+"_date' value='"+$("#glgls_gameDate").val()+"'/>");
    tr.append(td1);
    
    var td2=getContestantSelect(contestNum,contestants);
    tr.append(td2);
    var checked="";
    if(isCancel(contestants))
        checked="checked='checked'";
    
    var td3="<td class='cancel'><input type='checkbox' name='glgls_"+contestNum+"_cancel' id='glgls_"+contestNum+"_cancel' "+checked+"/><label for='glgls_"+contestNum+"_cancel'>Cancel</label></td>";
    tr.append(td3);
    var type=2;
    var cn="";
    cn=contestNum;
    var td4="<td class='grade'><button type='button' class='btn btn-success' onclick='gradeLiveProps("+cn+","+type+")'>Grade</button></td>";
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
function getContestantSelect(contestNum,contestants){
    var td=$("<td class='winner'></td>");
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
    
    var contestantInput=("<span id='glgls_"+contestNum+"_win' class='form-control' style='width:200px;margin:5px'>"+winner+"</span>");
    var wineTypeInput=("<span id='glgls_"+contestNum+"_winType' class='form-control'style='width:80px;margin:5px'>"+winType+"</span>");
    var moreButton=("<button type='button' class='btn btn-success' onclick='openGradePropInfo(&#39;"+contestNum+"\&#39;)'><i class='glyphicon glyphicon-plus'></i></button>");
    var hiddenWinner=("<input type='hidden' id='glgls_"+contestNum+"_winner' value='"+contestansResult.substring(0,contestansResult.length-1).replace(new RegExp("'", 'g'), "&quot;")+"'/>");
    td.append(contestantInput);
    td.append(wineTypeInput);
    td.append(moreButton);
    td.append(hiddenWinner);
    return td;
}

/**
 * @author mcalderon
 * @param {String} contestNum
 * @description set the contestant and clearbet information on the + modal
 */
function openGradePropInfo(contestNum){
    var contestantArr=$("#glgls_"+contestNum+"_contestant").val().split("@");
    $("#glgls_modal_contestDesc").text($("#glgls_"+contestNum+"_contestDesc").text());
    $("#glgls_modal_contestNum").val(contestNum);
    var table=$("#glgls_modal_ctTable");
    $("#glgls_modal_ctTable tbody tr").remove()
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
    $("#glgls_modal_contestantNums").val((contestantNums).substring(0,contestantNums.length-1));
    $("#lsGradeInfoModal").modal("toggle");
}

/**
 * @author mcalderon
 * @description set the contestant information (Win-Lose) on a hide input where it can be reached by the grade button action
 */
function setWinnerContestant(){
    var contetantNums=$("#glgls_modal_contestantNums").val().split("*");
    var contestNum=$("#glgls_modal_contestNum").val();
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
    
    $("#glgls_"+contestNum+"_win").text(winner);
    $("#glgls_"+contestNum+"_winType").text(winType);
    $("#glgls_"+contestNum+"_winner").val((contestResults).substring(0,contestResults.length-1).replace(new RegExp("'", 'g'), "&quot;"));
    
}

/**
 * @author mcalderon
 * @param {String} period
 * @description change the prop table displayed
 */
function changePeriodTable(period){
    var buttonClass=$("#sportLiveGradeLSFilter").val().trim()==="L-Baseball"?"periodButtonsLSBaseBall":"periodButtonsLS";
    $("#glgls_periodsFilterTable button").removeClass();
    $("#glgls_periodsFilterTable button").attr("class","btn btn-default "+buttonClass);
    $("#glgls_"+period).removeClass();
    $("#glgls_"+period).attr("class","btn btn-info "+buttonClass);
    
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
    $("#glgls_awayTeamScore").val(AFG);
    $("#glgls_homeTeamScore").val(HFG);
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
    $("#glgls_awayTeamScore").val(AFG);
    $("#glgls_homeTeamScore").val(HFG);
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
    $("#glgls_awayTeamScore").val(AFG);
    $("#glgls_homeTeamScore").val(HFG);
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
        $("#glgls_awayTeamScore").val(AFG);
        $("#glgls_homeTeamScore").val(HFG);
    }
}

/**
 * @author mcalderon
 * @description open the main bets info modal
 */
function openLiveGradeAditionalInfoModal(){
    var date=$("#glgls_gameDate").val();
    $("#glg_input_dailyFigure").val(date);
    if($("#glgls_actionSP").val()==="A"){
        $("#glg_spread_g").prop("checked",true);
        $("#glg_spread_na").prop("checked",false);
    }else if($("#glgls_actionSP").val()==="C"){
        $("#glg_spread_na").prop("checked",true);
        $("#glg_spread_g").prop("checked",false);
    }
    if($("#glgls_actionML").val()==="A"){
        $("#glg_money_g").prop("checked",true);
        $("#glg_money_na").prop("checked",false);
    }else if($("#glgls_actionML").val()==="C"){
        $("#glg_money_na").prop("checked",true);
        $("#glg_money_g").prop("checked",false);
    }
    if($("#glgls_actionTL").val()==="A"){
        $("#glg_total_g").prop("checked",true);
        $("#glg_total_na").prop("checked",false);
    }else if($("#glgls_actionTL").val()==="C"){
        $("#glg_total_na").prop("checked",true);
        $("#glg_total_g").prop("checked",false);
    }
    if($("#glgls_cancel").val()==="C"){
        $("#glgls_cancelGrade").prop("checked",true);
    }else{
        $("#glgls_cancelGrade").prop("checked",false);
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
        url: "checkPendingProps/"+$("#glgls_liveGames").val(),
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
    var gameDateTime=$("#glgls_gameDateTime").val().split(" ");
    var dfDate=$("#glg_input_dailyFigure").val();
    var dfDateArr=dfDate.split("-");
    var d1=new Date(dfDateArr[2]+"-"+dfDateArr[0]+"-"+dfDateArr[1]);
    var d2=new Date(gameDateTime[0]);
    if(d1.getTime()!==d2.getTime()){
        var date1=(d1.getMonth() + 1) + '/' + (d1.getDate()+1) + '/' +  d1.getFullYear();
        var date2=(d2.getMonth() + 1) + '/' + (d2.getDate()+1) + '/' +  d2.getFullYear();
        var message="The game date ("+date2+") is different than the daily Figure Date("+date1+"), Do you want to continue?";
	if(confirm(message)){
            setAditionalLiveGradeInfo();
        }
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
        $("#glgls_actionSP").val("A");
    }else if($("#glg_spread_na").is(":checked")){
        $("#glgls_actionSP").val("C");
    }
    if($("#glg_money_g").is(":checked")){
        $("#glgls_actionML").val("A");
    }else if($("#glg_money_na").is(":checked")){
        $("#glgls_actionML").val("C");
    }
    if($("#glg_total_g").is(":checked")){
        $("#glgls_actionTL").val("A");
    }else if($("#glg_total_na").is(":checked")){
        $("#glgls_actionTL").val("C");
    }
    $("#glgls_df").val($("#glg_input_dailyFigure").val());
    
    if($("#glg_cancelGrade").is(":checked")){
        $("#glgls_cancel").val("C");
    }else if($("#glg_reopen").is(":checked")){
        $("#glgls_actionTL").val("RO");
        $("#glgls_actionML").val("RO");
        $("#glgls_actionSP").val("RO");
    }else{
        $("#glgls_cancel").val("A");
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
            if($("#glgls_"+contestNum+"_winner").val()===""){
                validate=false;
                alert("There is no winner for "+$("#glgls_"+contestNum+"_contestDesc").val());
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
                "contestNum":(contestNum+"").replace("_A",""),
                "ct":$("#glgls_"+contestNum+"_ct1").val(),
                "ct2":$("#glgls_"+contestNum+"_ct2").val(),
                "ct3":$("#glgls_"+contestNum+"_ct3").val(),
                "cd":$("#glgls_"+contestNum+"_contestDesc").text(),
                "contestants":contestantsArray,
                "points":$("#glgls_"+contestNum+"_points").val(),
                "df":dailyFigure,
                "status":cancel,
                "contestantNumbers":$("#glgls_"+contestNum+"_ctString").val()
            },success: function (data) {
                if(data!=="1"){
                    alert(data);
                    window.location="livegradels";
                }
            }
        });
}

function sendMassiveGrading(){
    var trs=$("#glgls_propsTable .readyToGrade");
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
        var cancel=$("#glgls_"+val+"_cancel").is(":checked")?"C":"A";

        var dateTime;
        var dailyFigure;
        if($("#glg_input_dailyFigure").val()===""){
            dateTime=$("#glgls_"+val+"_date").val().split(" ");
            var dateArray=dateTime[0].split("-");
            dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
        }else{
            dateTime=$("#glg_input_dailyFigure").val();
            var dateArray=dateTime.split("-");
            dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
        }
        
        gradingArray.push({
            contestNum:(val+"").replace("_A",""),
            ct:$("#glgls_"+val+"_ct1").val(),
            ct2:$("#glgls_"+val+"_ct2").val(),
            ct3:$("#glgls_"+val+"_ct3").val(),
            cd:$("#glgls_"+val+"_contestDesc").text(),
            contestants:$("#glgls_"+val+"_winner").val(),
            df:dailyFigure,
            status:cancel,
            contestantNumbers:$("#glgls_"+val+"_ctString").val(),
            contestDate:$("#glgls_"+val+"_date").val()
        })
    });
    
    $.ajax({
        url: "massiveGrading",
        type: 'POST',
        data: {
            "array":gradingArray
        },success: function (data) {
            if(data!=="1"){
                alert(data);
                window.location="livegradels";
            }
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
    var contestantsArray=$("#glgls_"+contestNum+"_winner").val().split("@");
    var cancel=$("#glgls_"+contestNum+"_cancel").is(":checked")?"C":"A";
    
    var dateTime;
    var dailyFigure;
    if($("#glg_input_dailyFigure").val()===""){
        dateTime=$("#glgls_"+contestNum+"_date").val().split(" ");
        var dateArray=dateTime[0].split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    }else{
        dateTime=$("#glg_input_dailyFigure").val();
        var dateArray=dateTime.split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    }
    sendGradeProps(contestNum,contestantsArray,dailyFigure,cancel);
}

function glgls_deleteMarkets(){
    $.ajax({
        url: "clearNoBetProps/"+$("#glgls_liveGames").val(),
        success: function (data) {
            if ($("#sportLiveGradeLSFilter").val() === "" || $("#sportLiveGradeLSFilter").val() === null)
                alert("There's no sport selected");
            else if ($("#glgls_gameDate").val() === "" || $("#glgls_gameDate").val() === null)
                alert("There's no date selected");
            else if ($("#glgls_liveGames").val() === "" || $("#glgls_liveGames").val() === null)
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
    var periodButtons=$("#glgls_periodsFilterTable").find("button");
    getLiveLSProps();
            
}

function sendPeriodScore(){
    var closeOpt=($("#cpmcloseOption").is(":checked")?1:2);
    $.ajax({
        url: "sendPeriodScore",
        type: 'POST',
        data: {
            "gameNum":$("#glgls_liveGames").val(),
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
        url: "getBetInfo",
        type: 'POST',
        data: {
            "contestNum":contestNum
        },
        success: function (data) {
            var obj=JSON.parse(data);
            var table=$("#bin_table");
            $.each(obj,function (key,val){
                var tr=$("<tr>"+val[""]+"</tr>");
                var td1=$("<td class='bim_ticket2'>"+val["TicketNumber"]+"</td>");
                tr.append(td1);
                var td2=$("<td class='bim_date2'>"+val["PostedDateTime"]+"</td>");
                tr.append(td2);
                var td3=$("<td class='bim_custId2'>"+val["CustomerID"]+"</td>");
                tr.append(td3);
                var td4=$("<td class='bim_contestDesc2'>"+val["ContestDesc"]+"</td>");
                tr.append(td4);
                var td5=$("<td class='bim_contestant2'>"+val["ContestantName"]+"</td>");
                tr.append(td5);
                var td6=$("<td  class='bim_threshold2'>"+val["ThresholdLine"]+"</td>");
                tr.append(td6);
                var td7=$("<td class='bim_finalMoney2'>"+val["FinalMoney"]+"</td>");
                tr.append(td7);
                var td8=$("<td class='bim_amountWagered2'>"+val["AmountWagered"]+"</td>");
                tr.append(td8);
                var td9=$("<td class='bim_toWin2'>"+val["ToWinAmount"]+"</td>");
                tr.append(td9);
                var td10=$("<td  class='bim_outcome2'>"+val["Outcome"]+"</td>");
                tr.append(td10);
                
                table.append(tr);
            });
            $("#betsInfoModal").modal("toggle");
        }
    })
    
}