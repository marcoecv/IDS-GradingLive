var periodsOrder = [4, 5, 2, 6, 7, 3, 1];
var hockePeriodsOrder = [2, 3, 4, 1];
var baseballPeriodsOrder = [6,7,8,2,9,10,4,11,12,3,13,14,15,5,1];
var periodsAssocArray = [];
var periodInPlay;
periodsAssocArray[0] = ["FG"];
periodsAssocArray[1] = ["1H"];
periodsAssocArray[2] = ["2H"];
periodsAssocArray[3] = ["1Q"];
periodsAssocArray[4] = ["2Q"];
periodsAssocArray[5] = ["3Q"];
periodsAssocArray[6] = ["4Q"];

var baseballPeriodsAssocArray = [];
baseballPeriodsAssocArray[40]=["IN1"];
baseballPeriodsAssocArray[41]=["IN2"];
baseballPeriodsAssocArray[42]=["IN3"];
baseballPeriodsAssocArray[43]=["IN4"];
baseballPeriodsAssocArray[44]=["IN5"];
baseballPeriodsAssocArray[45]=["IN6"];
baseballPeriodsAssocArray[46]=["IN7"];
baseballPeriodsAssocArray[47]=["IN8"];
baseballPeriodsAssocArray[48]=["IN9"];
baseballPeriodsAssocArray[49]=["EXIN"];
baseballPeriodsAssocArray[0]=["FG"];
baseballPeriodsAssocArray[8]=["F3"];
baseballPeriodsAssocArray[9]=["F7"];
baseballPeriodsAssocArray[25]=["F5"];
baseballPeriodsAssocArray[26]=["S5"];

var hockeyPeriodsAssocArray = [];
hockeyPeriodsAssocArray[0] = ["FG"];
hockeyPeriodsAssocArray[1] = ["1P"];
hockeyPeriodsAssocArray[2] = ["2P"];
hockeyPeriodsAssocArray[3] = ["3P"];


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

    $('#glgdb_gameDateDiv').datetimepicker({
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });


    $("#glgdb_gameDate").change(function () {
        getGamesDBByDate();
    });

    $("#glg_setGradeInfoButon").click(function (){
        validateSetAdInfo();
    });
    
    
    $("#glgdb_getGamePropsInfo").click(function () {
        if ($("#sportLiveGradeDBFilter").val() === "" || $("#sportLiveGradeDBFilter").val() === null)
            alert("There's no sport selected");
        else if ($("#glgdb_gameDate").val() === "" || $("#glgdb_gameDate").val() === null)
            alert("There's no date selected");
        else if ($("#glgdb_liveGames").val() === "" || $("#glgdb_liveGames").val() === null)
            alert("There's no game selected");
        else {
            setScorePeriods();
        }
    });
    
    $("#glgdb_gradeReadyProps").click(function (){
        massiveGrading();
    });
    
    $("#glgdb_deleteMarkets").click(function (){
        if(confirm("Are You sure you want to delete all clearbet props?"))
            glgdb_deleteMarkets();
    });
    
    $("#glgls_closePeriods").click(function (){
        $.ajax({
            url: "getDBPeriodBySport/"+$("#sportLiveGradeDBFilter").val(),
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
});



function getGamesDBByDate() {
    if ($("#glg_gameDate").val() !== "" && $("#sportLiveGradeFilter").val() !== "" && $("#subsportLiveGradeFilter").val() !== "") {
        $.ajax({
            url: "../grade/getGameNumsByCompany",
            type: 'POST',
            data: {
                "sport": $("#sportLiveGradeDBFilter").val().trim(),
                "dateFrom": $("#glgdb_gameDate").val(),
                "company": 1
            }, success: function (data) {
                var obj = JSON.parse(data);
                var select = $("#glgdb_liveGames");
                $("#glgdb_liveGames option").remove();
                var opt = new Option('', '');
                select.append(opt);
                $.each(obj, function (key, val) {
                    var opt = new Option(val['Team1ID'].trim() + " vs " + val['Team2ID'].trim(), val['GameNum'].trim());
                    select.append(opt);
                });
                obj=null;
            }
        });
    } else {
        alert("Sport, Sub Sport, and Date are required to select a game");
    }
}


function setScorePeriods() {
    var sport = $("#sportLiveGradeDBFilter").val();
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
            if (sport.trim() === "L-Ice Hockey") {
                array = hockePeriodsOrder;
            } else if(sport.trim() === "L-Baseball"){
                array = baseballPeriodsOrder;
            }else{
                array = periodsOrder;
            }
            $.each(array, function (key, val) {
                if (obj["row" + val] !== undefined)
                    periodsArr.push(obj["row" + val]);
            });
            setPeriodSelect(periodsArr);
            setPeriodButtons(periodsArr);
            setTablesForProps(periodsArr);
        }
    });
}

function setTablesForProps(periods) {
    $("#glgdb_tabs .tab-pane").find("table").remove();
    var tabs = $("#glgdb_tabs .tab-pane");
    var idArray;
    var cont;
    $.each(tabs, function (key, val) {
        cont = 0;
        idArray = $(val).attr("id").split("_");
        $.each(periods, function (key2, val2) {
            var activeClass;
            if (cont === 0)
                activeClass = "showTable";
            else
                activeClass = "hideTable";
            $(val).append("<table id='propsTable_" + idArray[1].trim() + "_" + val2["Abbreviation"].trim() + "' class='propsTableDB " + activeClass + "' style='width:100%'></table>");
            cont++;
        });
    });
}


function setScoreboardTableHeaders() {
    var thead = $("#glgdb_scoreBoardTable thead");
    var trHead = $("<tr></tr>");
    $("#glgdb_scoreBoardTable thead tr").remove();
    trHead.append("<th>Teams</th>");
    switch ($("#sportLiveGradeDBFilter").val().trim()) {
        case "L-Soccer":
            trHead.append("<th>1H</th>");
            trHead.append("<th>2H</th>");
            trHead.append("<th>Game</th>");
            break;
        case "L-Tennis":
            trHead.append("<th></th>");
            trHead.append("<th></th>");
            trHead.append("<th></th>");
            trHead.append("<th></th>");
            trHead.append("<th></th>");
            trHead.append("<th></th>");
            break;
        case "L-Ice Hockey":
            trHead.append("<th>1P</th>");
            trHead.append("<th>2P</th>");
            trHead.append("<th>3P</th>");
            trHead.append("<th>OT</th>");
            trHead.append("<th>Game</th>");
            break;
        case "L-Basketball":
            trHead.append("<th>1Q</th>");
            trHead.append("<th>2Q</th>");
            trHead.append("<th>1H</th>");
            trHead.append("<th>3Q</th>");
            trHead.append("<th>4Q</th>");
            trHead.append("<th>2H</th>");
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
            break;
        case "L-Football":
            trHead.append("<th>1Q</th>");
            trHead.append("<th>2Q</th>");
            trHead.append("<th>1H</th>");
            trHead.append("<th>3Q</th>");
            trHead.append("<th>4Q</th>");
            trHead.append("<th>OT</th>");
            trHead.append("<th>Game</th>");
            break;
    }
    thead.append(trHead);
    setScoreboardBodyTable();
}
function setScoreboardBodyTable() {
    var tbody = $("#glgdb_scoreBoardTable tbody");
    var trBodyAway = $("<tr></tr>");
    var trBodyHome = $("<tr></tr>");
    $("#glgdb_scoreBoardTable tbody tr").remove();
    trBodyAway.append("<td><span id='awayTeam'>0</span></td>");
    trBodyHome.append("<td><span id='homeTeam'>0</span></td>");
    switch ($("#sportLiveGradeDBFilter").val().trim()) {
        case "L-Soccer":
            trBodyAway.append("<td><span id='A1H'>0</span></td>");
            trBodyAway.append("<td><span id='A2H'>0</span></td>");
            trBodyAway.append("<td><span id='AFG'>0</span></td>");

            trBodyHome.append("<td><span id='H1H'>0</span></td>");
            trBodyHome.append("<td><span id='H2H'>0</span></td>");
            trBodyHome.append("<td><span id='HFG'>0</span></td>");
            break;
        case "L-Tennis":
            break;
        case "L-Ice Hockey":
            trBodyAway.append("<td><span id='A1P'>0</span></td>");
            trBodyAway.append("<td><span id='A2P'>0</span></td>");
            trBodyAway.append("<td><span id='A3P'>0</span></td>");
            trBodyAway.append("<td><span id='AO'>0</span></td>");
            trBodyAway.append("<td><span id='AFG'>0</span></td>");

            trBodyHome.append("<td><span id='H1P'>0</span></td>");
            trBodyHome.append("<td><span id='H2P'>0</span></td>");
            trBodyHome.append("<td><span id='H3P'>0</span></td>");
            trBodyHome.append("<td><span id='HO'>0</span></td>");
            trBodyHome.append("<td><span id='HFG'>0</span></td>");
            break;
        case "L-Basketball":
            trBodyAway.append("<td><span id='A1Q'>0</span></td>");
            trBodyAway.append("<td><span id='A2Q'>0</span></td>");
            trBodyAway.append("<td><span id='A1H'>0</span></td>");
            trBodyAway.append("<td><span id='A3Q'>0</span></td>");
            trBodyAway.append("<td><span id='A4Q'>0</span></td>");
            trBodyAway.append("<td><span id='A2H'>0</span></td>");
            trBodyAway.append("<td><span id='AO'>0</span></td>");
            trBodyAway.append("<td><span id='AFG'>0</span></td>");

            trBodyHome.append("<td><span id='H1Q'>0</span></td>");
            trBodyHome.append("<td><span id='H2Q'>0</span></td>");
            trBodyHome.append("<td><span id='H1H'>0</span></td>");
            trBodyHome.append("<td><span id='H3Q'>0</span></td>");
            trBodyHome.append("<td><span id='H4Q'>0</span></td>");
            trBodyHome.append("<td><span id='H2H'>0</span></td>");
            trBodyHome.append("<td><span id='HO'>0</span></td>");
            trBodyHome.append("<td><span id='HFG'>0</span></td>");
            break;
        case "L-Baseball":
            trBodyAway.append("<td><span id='AIN1'>0</span></td>");
            trBodyAway.append("<td><span id='AIN2'>0</span></td>");
            trBodyAway.append("<td><span id='AIN3'>0</span></td>");
            trBodyAway.append("<td><span id='AIN4'>0</span></td>");
            trBodyAway.append("<td><span id='AIN5'>0</span></td>");
            trBodyAway.append("<td><span id='AIN6'>0</span></td>");
            trBodyAway.append("<td><span id='AIN7'>0</span></td>");
            trBodyAway.append("<td><span id='AIN8'>0</span></td>");
            trBodyAway.append("<td><span id='AIN9'>0</span></td>");
            trBodyAway.append("<td><span id='AEXIN'>0</span></td>");
            trBodyAway.append("<td><span id='AFG'>0</span></td>");

            trBodyHome.append("<td><span id='HIN1'>0</span></td>");
            trBodyHome.append("<td><span id='HIN2'>0</span></td>");
            trBodyHome.append("<td><span id='HIN3'>0</span></td>");
            trBodyHome.append("<td><span id='HIN4'>0</span></td>");
            trBodyHome.append("<td><span id='HIN5'>0</span></td>");
            trBodyHome.append("<td><span id='HIN6'>0</span></td>");
            trBodyHome.append("<td><span id='HIN7'>0</span></td>");
            trBodyHome.append("<td><span id='HIN8'>0</span></td>");
            trBodyHome.append("<td><span id='HIN9'>0</span></td>");
            trBodyHome.append("<td><span id='HEXIN'>0</span></td>");
            trBodyHome.append("<td><span id='HFG'>0</span></td>");
            break;
        case "L-Football":
            trBodyAway.append("<td><span id='A1Q'>0</span></td>");
            trBodyAway.append("<td><span id='A2Q'>0</span></td>");
            trBodyAway.append("<td><span id='A1H'>0</span></td>");
            trBodyAway.append("<td><span id='A3Q'>0</span></td>");
            trBodyAway.append("<td><span id='A4Q'>0</span></td>");
            trBodyAway.append("<td><span id='AO'>0</span></td>");
            trBodyAway.append("<td><span id='AFG'>0</span></td>");

            trBodyHome.append("<td><span id='H1Q'>0</span></td>");
            trBodyHome.append("<td><span id='H2Q'>0</span></td>");
            trBodyHome.append("<td><span id='H1H'>0</span></td>");
            trBodyHome.append("<td><span id='H3Q'>0</span></td>");
            trBodyHome.append("<td><span id='H4Q'>0</span></td>");
            trBodyHome.append("<td><span id='HO'>0</span></td>");
            trBodyHome.append("<td><span id='HFG'>0</span></td>");
            break;
    }
    tbody.append(trBodyAway);
    tbody.append(trBodyHome);


}

function massiveGrading(){
    var table=$("#glgdb_tabs .active").find(".showTable");
    var props=table.find(".readyToGrade");
    $(props).each(function (){
        $(this).find("button").trigger("click");
    });
}

function setPeriodSelect(periodsArr){
    $("#cpm_PeriodId option").remove();
    var select=$("#cpm_PeriodId");
    var opt=new Option("","");
    select.append(opt)
    $.each(periodsArr,function (key,val){
        var opt=new Option(val["PeriodDescription"],val["PeriodNumber"]);
        select.append(opt)
    });
}

function setPeriodButtons(periods) {
    var table = $("#glgdb_periodsFilterTable");
    $("#glgdb_periodsFilterTable tr").remove();
    var tr = $("<tr></tr>");
    var buttonClass="periodButtonsDB";
    if(periods.length>8)
        buttonClass="periodButtonsDBBaseBall";
    $.each(periods, function (key, val) {
        tr.append('<td><button type="button" class="btn btn-default '+buttonClass+'" name="glgdb_' + val["Abbreviation"].trim() + '" id="glgdb_' + val["Abbreviation"].trim() + '" value="' + val["Abbreviation"].trim() + '" onclick="changePeriodTable(\''+val["Abbreviation"].trim()+'\')">' + val["PeriodDescription"].trim() + '</button></td>')
    });
    table.append(tr);
}


function getGameScoreInfo() {
    $.ajax({
        url: "getDBscoreByGameNum/" + $("#glgdb_liveGames").val(),
        complete: function () {
            getLiveDBProps();
        },
        success: function (data) {
            var obj = JSON.parse(data);
            $("#awayTeam").text(obj["row1"]["Team1ID"]);
            $("#homeTeam").text(obj["row1"]["Team2ID"]);
            $("#glgdb_awayTeam").val(obj["row1"]["Team1ID"]);
            $("#glgdb_homeTeam").val(obj["row1"]["Team2ID"]);
            $("#glgdb_rot").val(obj["row1"]["Rot1Num"]);
            $("#glgdb_gameDateTime").val(obj["row1"]["GameDate"]);
            if(obj["row1"]["GradeDateTime"]!==""&&obj["row1"]["GradeDateTime"]!==null){
                $("#glgdb_gradeGameButton").attr("class","btn btn-danger");
                $("#glgdb_gradeGameButton").text("Re-Grade");
            }else{
                $("#glgdb_gradeGameButton").attr("class","btn btn-success");
                $("#glgdb_gradeGameButton").text("Grade");
            }
            $.each(obj,function(key,val){
                switch ($("#sportLiveGradeDBFilter").val().trim()) {
                    case 'L-Basketball':
                        basketballSetScore(val["PeriodID"], val["ScoreAway"], val["ScoreHome"],val["PeriodStatus"],val["ScheduleText"]);
                        break;
                    case 'L-Fooball':
                        footballSetScore(val["PeriodID"], val["ScoreAway"], val["ScoreHome"],val["PeriodStatus"]);
                        break;
                    case 'L-Baseball':
                        baseballSetScore(val["PeriodID"], val["ScoreAway"], val["ScoreHome"],val["PeriodStatus"]);
                        break;
                    case 'L-Ice Hockey':
                        hockeySetScore(val["PeriodID"], val["ScoreAway"], val["ScoreHome"],val["PeriodStatus"]);
                        break;
                }
            });
            obj=null;
        }
    });
}



function getLiveDBProps() {
    var clearbet = ($("#glgdb_clearBetStatus").is(":checked") ? 0 : 1);
    $.ajax({
        url: "getLiveDBProps",
        type: 'POST',
        data: {
            "gameNum": $("#glgdb_liveGames").val(),
            "clearBetStatus": clearbet
        }, success: function (data) {
            var obj = JSON.parse(data);
            $.each(obj,function (key,val){
                addProptoTable(val);
                addProptoAllTable(val);
            });
           obj=null; 
        }
    });
}


function addProptoTable(propData) {
    var arrayTmp;
    if ($("#sportLiveGradeDBFilter").val().trim() === "L-Ice Hockey")
        arrayTmp = hockeyPeriodsAssocArray;
    else if($("#sportLiveGradeDBFilter").val().trim() === "L-Baseball")
        arrayTmp=baseballPeriodsAssocArray;
    else
        arrayTmp = periodsAssocArray;
    var table = $("#propsTable_" + propData["group"].trim() +"_"+ arrayTmp[propData["PeriodID"]]);
    table.append(createPropTD(propData["ContestNum"].trim(),propData["ContestDesc"].trim(),propData["ContestType"].trim(),propData["ContestType2"].trim(),propData["ContestType3"].trim(),propData["ContestantName"].trim(),propData["group"].trim(),propData["ClearBetStatus"],propData["PeriodID"],propData["Outcome"],propData["Score"],propData["BetTypeID"]));
}

function addProptoAllTable(propData) {
    var arrayTmp;
    if ($("#sportLiveGradeDBFilter").val().trim() === "L-Ice Hockey")
        arrayTmp = hockeyPeriodsAssocArray;
    else if($("#sportLiveGradeDBFilter").val().trim() === "L-Baseball")
        arrayTmp=baseballPeriodsAssocArray;
    else
        arrayTmp = periodsAssocArray;
    var table = $("#propsTable_All_"+ arrayTmp[propData["PeriodID"]]);
    table.append(createPropTD(propData["ContestNum"].trim(),propData["ContestDesc"].trim(),propData["ContestType"].trim(),propData["ContestType2"].trim(),propData["ContestType3"].trim(),propData["ContestantName"].trim(),propData["group"].trim(),propData["ClearBetStatus"],propData["PeriodID"],propData["Outcome"],propData["Score"],propData["BetTypeID"],true));
}

function createPropTD(contestNum,contestDesc,ct1,ct2,ct3,contestants,wagerType,ClearBetStatus,PeriodID,Outcome,score,BetTypeID,allTable){
    var AllId="";
    if(allTable){
        AllId="_A";
    }
    var trClass;
    if(Outcome!==""&&Outcome!==null&&Outcome!==undefined)
        trClass="graded";
    else if(ClearBetStatus==="true")
        trClass="readyToGrade";
    else 
        trClass="inProgress";
    var awayScore;
    var homeScore;
    if(ct2===".Ice Hockey"){
        awayScore=parseInt($("#A"+hockeyPeriodsAssocArray[PeriodID]).text());
        homeScore=parseInt($("#H"+hockeyPeriodsAssocArray[PeriodID]).text());
    }else if(ct2===".Baseball"){
        switch (PeriodID){
            case "8":
                awayScore=parseInt($("#A"+baseballPeriodsAssocArray[40]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[41]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[42]).text());
                
                homeScore=parseInt($("#H"+baseballPeriodsAssocArray[40]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[41]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[42]).text());
                break;
            case "9":
                awayScore=parseInt($("#A"+baseballPeriodsAssocArray[40]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[41]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[42]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[43]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[44]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[45]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[46]).text());
                
                homeScore=parseInt($("#H"+baseballPeriodsAssocArray[40]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[41]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[42]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[43]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[44]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[45]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[46]).text());
                break;
            case "25":
                awayScore=parseInt($("#A"+baseballPeriodsAssocArray[40]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[41]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[42]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[43]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[44]).text());
                
                homeScore=parseInt($("#H"+baseballPeriodsAssocArray[40]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[41]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[42]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[43]).text());
                break;
            case "26":
                awayScore=parseInt($("#A"+baseballPeriodsAssocArray[40]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[41]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[42]).text())+
                        parseInt($("#A"+baseballPeriodsAssocArray[43]).text());
                
                homeScore=parseInt($("#H"+baseballPeriodsAssocArray[40]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[41]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[42]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[43]).text())+
                        parseInt($("#H"+baseballPeriodsAssocArray[44]).text());
                break;
            default :
                awayScore=parseInt($("#A"+baseballPeriodsAssocArray[PeriodID]).text());
                homeScore=parseInt($("#H"+baseballPeriodsAssocArray[PeriodID]).text());
                break;
        }
    }else{
        if(PeriodID==="2"){
            awayScore=parseInt($("#A"+periodsAssocArray[5]).text())+parseInt($("#A"+periodsAssocArray[6]).text());
           homeScore=parseInt($("#H"+periodsAssocArray[5]).text())+parseInt($("#H"+periodsAssocArray[6]).text());
        }else{
            awayScore=parseInt($("#A"+periodsAssocArray[PeriodID]).text());
            homeScore=parseInt($("#H"+periodsAssocArray[PeriodID]).text());
        }
    }
    
    //    alert("#A"+periodsAssocArray[PeriodID]);

    var awayTeam=$("#awayTeam").text().trim();
    var homeTeam=$("#homeTeam").text().trim();
    var sc;
    if(wagerType==="Spread"){
        var diff=Math.abs(awayScore-homeScore);
        sc=(score!==null&&score!==""?score:diff);
    }else if(wagerType==="Total"){
        var total=0;
        switch (BetTypeID){
            case "17":
               total=awayScore+homeScore;
               break;
            case "19":
                total=awayScore;
                break;
            case "20":
                total=homeScore;
                break;
        }
        trClass==="inProgress"?total="":true;
        sc=(score!==null&&score!==""?score:total);
    }
    
    var tr=$("<tr id='"+contestNum+AllId+"' class='"+trClass+"'></tr>");
    var td1=$("<td class='desc'></td>");
    td1.append("<input type='hidden' id='glgdb_"+contestNum+AllId+"_ct1' value='"+ct1+"'/>");
    td1.append("<input type='hidden' id='glgdb_"+contestNum+AllId+"_ct2' value='"+ct2+"'/>");
    td1.append("<input type='hidden' id='glgdb_"+contestNum+AllId+"_ct3' value='"+ct3+"'/>");
    td1.append("<input type='hidden' id='glgdb_"+contestNum+AllId+"_contestant' value='"+contestants+"'/>");
    td1.append("<span type='hidden' id='glgdb_"+contestNum+AllId+"_contestDesc' value='"+contestDesc+"'>"+contestDesc+"</span>");
    td1.append("<input type='hidden' id='glgdb_"+contestNum+AllId+"_wt' value='"+wagerType+"'/>");
    td1.append("<input type='hidden' id='glgdb_"+contestNum+AllId+"_date' value='"+$("#glgdb_gameDate").val()+"'/>");
    tr.append(td1);
    
    var td2=$("<td class='winner'></td>");
    if(wagerType==="Total"){
        var pointsField="<input type='text' class='form-control' name='glgdb_"+contestNum+AllId+"_points' id='glgdb_"+contestNum+AllId+"_points' value='"+sc+"' style='margin-left:30px;width:80px'/>"
        td2.append(pointsField);
    }else if(wagerType){
        var winner="";
        if(awayScore>homeScore){
            winner=awayTeam;
        }else if(awayScore<homeScore){
            winner=homeTeam;
        }
        var winningMargin=0;
        if(BetTypeID==="21"){
            winningMargin=1;
        }
        var contestantArray=contestants.split("@");
        var cts="";
        $.each(contestantArray,function (key,val){
            var optTemp=val.split("*");
            cts+=optTemp[1]+"-";
        });
        td2.append("<input type='hidden' id='glgdb_"+contestNum+AllId+"_ctString' value='"+cts+"'/>")
        td2.append(getContestantSelect(contestNum,AllId,contestants,winner,BetTypeID));
    }
    
    if(wagerType==="Spread"){
        var pointsField="<input type='text' class='form-control' id='glgdb_"+contestNum+AllId+"_points' name='glgdb_"+contestNum+AllId+"_points' value='"+sc+"'style='margin-left:30px;width:80px'/>"
        td2.append(pointsField);
    }
    tr.append(td2);
//    var td3="<td class='push'><input type='checkbox' name='glgdb_"+contestNum+AllId+"_push' id='glgdb_"+contestNum+AllId+"_push'/><label for='glgdb_"+contestNum+"_push'>Push</label></td>";
//    tr.append(td3);
    var td4="<td class='cancel'><input type='checkbox' name='glgdb_"+contestNum+AllId+"_cancel' id='glgdb_"+contestNum+AllId+"_cancel'/><label for='glgdb_"+contestNum+"_cancel'>Cancel</label></td>";
    tr.append(td4);
    var type;
    switch (wagerType){
        case "Spread":
            type=1;
            break;
        case "Money":
        case "Aditional":
            type=2;
            break;
        case "Total":
            type=3;
            break;
    }
    var cn="";
    if(AllId){
        cn="&#39;"+contestNum+AllId+"&#39;";
    }else{
        cn=contestNum;
    }
    var td5="<td class='grade'><button type='button' class='btn btn-success' onclick='gradeLiveProps("+cn+","+type+","+winningMargin+")'>Grade</button></td>";
    tr.append(td5);
    return tr;
    
}

function getContestantSelect(contestNum,AllId,contestants,winner,betTypeId){
    if(betTypeId==="21"){
        var button="<button type='button' class='btn btn-default selectButton' data-toggle='collapse' data-target='#demo"+AllId+"'>&nbsp;<i class='glyphicon glyphicon-chevron-down'></i></button>";
        var select="<center><div id='demo"+AllId+"' class='selectOptionDiv collapse'>";
        var contestantArray=contestants.split("@");
        var cts="";
        $.each(contestantArray,function (key,val){
            var optTemp=val.split("*");
            if(optTemp.length===3){
                var checked="";
                if(optTemp[2]==="W"){
                    checked="checked='checked'";
                }
                var opt="<div class='inlineElement optionSelect'><input id='glgdb_"+optTemp[1]+AllId+"_winner' name='glgdb_"+contestNum+AllId+"_winner' "+checked+" class='form-control' type='checkbox'value='"+optTemp[0]+"'>&nbsp;<label for='"+optTemp[1]+"'>"+optTemp[0]+"</label></div>";
                select+=opt;
            }else{
                var checked="";
                if(optTemp[0].trim()===winner)
                    checked="checked='checked'";
                var opt="<div class='inlineElement optionSelect'><input id='glgdb_"+optTemp[1]+AllId+"_winner' name='glgdb_"+contestNum+AllId+"_winner' "+checked+" class='form-control' type='checkbox'value='"+optTemp[0]+"'>&nbsp;<label for='"+optTemp[1]+"'>"+optTemp[0]+"</label></div>";
                select+=opt;
            }
            cts+=optTemp[1]+"-";
        });
        select+="</div></center>";
        return button+select;
    }else{
        var select=$("<select class='form-control' id='glgdb_"+contestNum+AllId+"_winner' name='glgdb_"+contestNum+AllId+"_winner' style='width:200px'></select>");
        var contestantArray=contestants.split("@");
        var opt=new Option("","");
        select.append(opt);
        var cts="";
        $.each(contestantArray,function (key,val){
            var optTemp=val.split("*");
            if(optTemp.length===3){
                var opt=new Option(optTemp[0],optTemp[1]);
                if(optTemp[2]==="W"){
                    $(opt).prop("selected",true);
                }
                select.append(opt);
            }else{
                var opt=new Option(optTemp[0],optTemp[1]);
                if(optTemp[0].trim()===winner)
                    $(opt).prop("selected",true);
                select.append(opt);
            }
            cts+=optTemp[1]+"-";
        });
        return select;
    }
}

function changePeriodTable(period){
    var buttonClass=$("#sportLiveGradeDBFilter").val().trim()==="L-Baseball"?"periodButtonsDBBaseBall":"periodButtonsDB";
    $("#glgdb_periodsFilterTable button").removeClass();
    $("#glgdb_periodsFilterTable button").attr("class","btn btn-default "+buttonClass);
    $("#glgdb_"+period).removeClass();
    $("#glgdb_"+period).attr("class","btn btn-info "+buttonClass);
    
    var activeTableId=$(".tab-content").find(".showTable");
    activeTableId.each(function (){
        var tableId=$(this).attr("id");
    
        $("#"+tableId).removeClass();
        $("#"+tableId).attr("class","propsTableDB hideTable");

        var tmp=tableId.split("_");
        $("#"+tmp[0]+"_"+tmp[1]+"_"+period).removeClass();
        $("#"+tmp[0]+"_"+tmp[1]+"_"+period).attr("class","propsTableDB showTable");
    });
}
function basketballSetScore(PeriodID, ScoreAway, ScoreHome,periodStatus,scheduleText) {
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
            break;
        case "6":
            scoreSpanAway=$("#A4Q");
            scoreSpanHome=$("#H4Q");
            break;
        case '0':
            scoreSpanAway=$("#A0");
            scoreSpanHome=$("#H0");
            break;
    }
    
    scoreSpanAway.text(ScoreAway);
    scoreSpanHome.text(ScoreHome);
    
    if(periodStatus==="N"){
        scoreSpanAway.attr("class","periodInProgress");
       scoreSpanHome.attr("class","periodInProgress");
       periodInPlay=PeriodID.trim();
   }else if(periodStatus==="Y"){
        scoreSpanAway.attr("class","periodEnded");
        scoreSpanHome.attr("class","periodEnded");
    }
    if(scheduleText==="NBA"){
        var A1H = parseInt($("#A1Q").text()) + parseInt($("#A2Q").text());
        var H1H = parseInt($("#H1Q").text()) + parseInt($("#H2Q").text());
        $("#A1H").text(A1H);
        $("#H1H").text(H1H);

        var A2H = parseInt($("#A3Q").text()) + parseInt($("#A4Q").text());
        var H2H = parseInt($("#H3Q").text()) + parseInt($("#H4Q").text());
        $("#A2H").text(A2H);
        $("#H2H").text(H2H);

        var AFG = parseInt($("#A1H").text()) + parseInt($("#A3Q").text()) + parseInt($("#A4Q").text()) + parseInt($("#AO").text());
        var HFG = parseInt($("#H1H").text()) + parseInt($("#H3Q").text()) + parseInt($("#H4Q").text()) + parseInt($("#HO").text());
        $("#AFG").text(AFG);
        $("#HFG").text(HFG);
    }else{
        var AFG = parseInt($("#A1H").text()) + parseInt($("#A2H").text());
        var HFG = parseInt($("#H1H").text()) + parseInt($("#H2H").text());
        $("#AFG").text(AFG);
        $("#HFG").text(HFG);
    }
    
    $("#glgdb_awayTeamScore").val(AFG);
    $("#glgdb_homeTeamScore").val(HFG);
}


function footballSetScore(PeriodID, ScoreAway, ScoreHome,periodStatus) {
    var A1Q = parseInt($("#A1Q").text());
    var H1Q = parseInt($("#H1Q").text());
    var A1H = parseInt($("#A1H").text());
    var H1H = parseInt($("#H1H").text());
    var A3Q = parseInt($("#A3Q").text());
    var H3Q = parseInt($("#H3Q").text());
    var A4Q = parseInt($("#A4Q").text());
    var H4Q = parseInt($("#H4Q").text());
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
            break;
        case "6":
            scoreSpanAway=$("#A4Q");
            scoreSpanHome=$("#H4Q");
            break;
        case '0':
            scoreSpanAway=$("#A0");
            scoreSpanHome=$("#H0");
            break;
    }
    
    scoreSpanAway.text(ScoreAway);
    scoreSpanHome.text(ScoreHome);
    
    if(periodStatus==="N"){
        scoreSpanAway.attr("class","periodInProgress");
       scoreSpanHome.attr("class","periodInProgress");
       periodInPlay=PeriodID.trim();
   }else if(periodStatus==="Y"){
        scoreSpanAway.attr("class","periodEnded");
        scoreSpanHome.attr("class","periodEnded");
    }
    var A1H = parseInt($("#A1Q").text()) + parseInt($("#A2Q").text());
    var H1H = parseInt($("#H1Q").text()) + parseInt($("#H2Q").text());
    $("#A1H").text(A1H);
    $("#H1H").text(H1H);
    var AFG = parseInt($("#A1H").text()) + parseInt($("#A3Q").text()) + parseInt($("#A4Q").text()) + parseInt($("#AO").text());
    var HFG = parseInt($("#H1H").text()) + parseInt($("#H3Q").text()) + parseInt($("#H4Q").text()) + parseInt($("#HO").text());
    $("#AFG").text(AFG);
    $("#HFG").text(HFG);
    
    $("#glgdb_awayTeamScore").val(AFG);
    $("#glgdb_homeTeamScore").val(HFG);
}


function sumBaseballPeriodsScore(score,pos){
    var newScore=[];
    newScore[0]=0;
    newScore[1]=0;
    for(var i=40;i<pos;i++){
        newScore[0]+=score[i]['A'];
        newScore[1]+=score[i]['H'];
    }
    return newScore;
}


function setBaseballScoreArray(){
    var score=[]
    score[40]=[]
    score[41]=[]
    score[42]=[]
    score[43]=[]
    score[44]=[]
    score[45]=[]
    score[46]=[]
    score[47]=[]
    score[48]=[]
    score[49]=[]
    
    score[40]['A']=0;
    score[40]['H']=0;
    score[41]['A']=0;
    score[41]['H']=0;
    score[42]['A']=0;
    score[42]['H']=0;
    score[43]['A']=0;
    score[43]['H']=0;
    score[44]['A']=0;
    score[44]['H']=0;
    score[45]['A']=0;
    score[45]['H']=0;
    score[46]['A']=0;
    score[46]['H']=0;
    score[47]['A']=0;
    score[47]['H']=0;
    score[48]['A']=0;
    score[48]['H']=0;
    score[49]['A']=0;
    score[49]['H']=0;
    return score;
}


function getBasballTotalgame(){
    var totalaway=0;
    var totalhome=0;
    var tda=$("#glgdb_scoreBoardTable tbody tr").eq(0).find("td");
    var tdh=$("#glgdb_scoreBoardTable tbody tr").eq(1).find("td");
    for(var i=1;i<tda.length-1;i++){
        totalaway+=parseInt(tda.eq(i).find("span").text());
        totalhome+=parseInt(tdh.eq(i).find("span").text());
    }
    var arr=[totalaway,totalhome];
    return arr;
}

function baseballSetScore(PeriodID, ScoreAway, ScoreHome,periodStatus) {
    var score=setBaseballScoreArray();
    score[40]['A'] = parseInt($("#AIN1").text());
    score[40]['H']=parseInt($("#HIN1").text());

    score[41]['A']=parseInt($("#AIN2").text());
    score[41]['H']=parseInt($("#HIN2").text());
    
    score[42]['A']=parseInt($("#AIN3").text());
    score[42]['H']=parseInt($("#HIN3").text());
    
    score[43]['A']=parseInt($("#AIN4").text());
    score[43]['H']=parseInt($("#HIN4").text());
    
    score[44]['A']=parseInt($("#AIN5").text());
    score[44]['H']=parseInt($("#HIN5").text());
    
    score[45]['A']=parseInt($("#AIN6").text());
    score[45]['H']=parseInt($("#HIN6").text());
    
    score[46]['A']=parseInt($("#AIN7").text());
    score[46]['H']=parseInt($("#HIN7").text());
    
    score[47]['A']=parseInt($("#AIN8").text());
    score[47]['H']=parseInt($("#HIN8").text());
    
    score[48]['A']=parseInt($("#AIN9").text());
    score[48]['H']=parseInt($("#HIN9").text());
    
    score[49]['A']=parseInt($("#AEXIN").text());
    score[49]['H']=parseInt($("#HEXIN").text());
    var period=parseInt(PeriodID.trim());
    var scoreSpanAway;
    var scoreSpanHome;
    switch (PeriodID.trim()) {
        case "40":
            scoreSpanAway=$("#AIN1");
            scoreSpanHome=$("#HIN1");
            break;
        case "41":
            scoreSpanAway=$("#AIN2");
            scoreSpanHome=$("#HIN2");
            break;
        case "42":
            scoreSpanAway=$("#AIN3");
            scoreSpanHome=$("#HIN3");
            break;
        case "43":
            scoreSpanAway=$("#AIN4");
            scoreSpanHome=$("#HIN4");
            break;
        case "44":
            scoreSpanAway=$("#AIN5");
            scoreSpanHome=$("#HIN5");
            break;
        case "45":
            scoreSpanAway=$("#AIN6");
            scoreSpanHome=$("#HIN6");
            break;
        case "46":
            scoreSpanAway=$("#AIN7");
            scoreSpanHome=$("#HIN7");
            break;
        case "47":
            scoreSpanAway=$("#AIN8");
            scoreSpanHome=$("#HIN8");
            break;
        case "48":
            scoreSpanAway=$("#AIN9");
            scoreSpanHome=$("#HIN9");
            break;
        case "49":
            scoreSpanAway=$("#AEXIN");
            scoreSpanHome=$("#HEXIN");
            break;
    }
    scoreSpanAway.text(ScoreAway);
    scoreSpanHome.text(ScoreHome);
    if(periodStatus==="N"){
        scoreSpanAway.attr("class","periodInProgress");
       scoreSpanHome.attr("class","periodInProgress");
       periodInPlay=PeriodID.trim();
   }else if(periodStatus==="Y"){
        scoreSpanAway.attr("class","periodEnded");
        scoreSpanHome.attr("class","periodEnded");
    }
    var total=getBasballTotalgame();
    $("#AFG").text(total[0]);
    $("#HFG").text(total[1]);
    $("#glgdb_awayTeamScore").val(total[0]);
    $("#glgdb_homeTeamScore").val(total[1]);
}

function hockeySetScore(PeriodID, ScoreAway, ScoreHome,periodStatus) {
    var A1P = parseInt($("#A1P").text());
    var H1P = parseInt($("#H1P").text());
    var A2P = parseInt($("#A2P").text());
    var H2P = parseInt($("#H2P").text());
    var A3P = parseInt($("#A3P").text());
    var H3P = parseInt($("#H3P").text());
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
            break;
        case "0":
            scoreSpanAway=$("#AO");
            scoreSpanHome=$("#HO");
            break;
    }
    
    scoreSpanAway.text(ScoreAway);
    scoreSpanHome.text(ScoreHome);
    if(periodStatus==="N"){
        scoreSpanAway.attr("class","periodInProgress");
       scoreSpanHome.attr("class","periodInProgress");
       periodInPlay=PeriodID.trim();
   }else if(periodStatus==="Y"){
        scoreSpanAway.attr("class","periodEnded");
        scoreSpanHome.attr("class","periodEnded");
    }
    var AFG = parseInt($("#A1P").text()) + parseInt($("#A2P").text())+ parseInt($("#A3P").text())+ parseInt($("#AO").text());
    var HFG = parseInt($("#H1P").text()) + parseInt($("#H2P").text())+ parseInt($("#H3P").text())+ parseInt($("#HO").text());

    $("#AFG").text(AFG);
    $("#HFG").text(HFG);
    $("#glgdb_awayTeamScore").val(AFG);
    $("#glgdb_homeTeamScore").val(HFG);
}

function openLiveGradeAditionalInfoModal(){
    var date=$("#glgdb_gameDate").val();
    $("#glg_input_dailyFigure").val(date);
    if($("#glgdb_actionSP").val()==="A"){
        $("#glg_spread_g").prop("checked",true);
        $("#glg_spread_na").prop("checked",false);
    }else if($("#glgdb_actionSP").val()==="C"){
        $("#glg_spread_na").prop("checked",true);
        $("#glg_spread_g").prop("checked",false);
    }
    if($("#glgdb_actionML").val()==="A"){
        $("#glg_money_g").prop("checked",true);
        $("#glg_money_na").prop("checked",false);
    }else if($("#glgdb_actionML").val()==="C"){
        $("#glg_money_na").prop("checked",true);
        $("#glg_money_g").prop("checked",false);
    }
    if($("#glgdb_actionTL").val()==="A"){
        $("#glg_total_g").prop("checked",true);
        $("#glg_total_na").prop("checked",false);
    }else if($("#glgdb_actionTL").val()==="C"){
        $("#glg_total_na").prop("checked",true);
        $("#glg_total_g").prop("checked",false);
    }
    if($("#glgdb_cancel").val()==="C"){
        $("#glgdb_cancelGrade").prop("checked",true);
    }else{
        $("#glgdb_cancelGrade").prop("checked",false);
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
function gradeLiveGame(){
    if($("#glg_awayTeam").val()===""||$("#glg_homeTeam").val()===""){
        alert("There is no score to grade this game");
    }else{
        var df=$("#glgdb_df").val()===""?$("#glgdb_gameDate").val():$("#glgdb_df").val();
        $.ajax({
            url: "gradeindividualgame",
            type: 'POST',
            data: {
                "sp": $("#glgdb_actionSP").val(),
                "ml": $("#glgdb_actionML").val(),
                "tl": $("#glgdb_actionTL").val(),
                "df": df,
                "team1": $("#glgdb_awayTeam").val(),
                "team2": $("#glgdb_homeTeam").val(),
                "period": 0,
                "periodname": "Game",
                "rot": $("#glgdb_rot").val(),
                "gameDate": $("#glgdb_gameDateTime").val(),
                "scoreAway": $("#glgdb_awayTeamScore").val(),
                "pointsAway": $("#glgdb_awayTeamScore").val(),
                "scoreHome": $("#glgdb_homeTeamScore").val(),
                "pointsHome": $("#glgdb_homeTeamScore").val(),
                "subSport": $("#sportLiveGradeDBFilter").val(),
                "adjustlinehome": "",
                "adjustlineaway": "",
                "comments": ""
            }, success: function (data) {
                alert(data);
            }
        });
    }
}

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
function setAditionalLiveGradeInfo(){
    if($("#glg_spread_g").is(":checked")){
        $("#glgdb_actionSP").val("A");
    }else if($("#glg_spread_na").is(":checked")){
        $("#glgdb_actionSP").val("C");
    }
    if($("#glg_money_g").is(":checked")){
        $("#glgdb_actionML").val("A");
    }else if($("#glg_money_na").is(":checked")){
        $("#glgdb_actionML").val("C");
    }
    if($("#glg_total_g").is(":checked")){
        $("#glgdb_actionTL").val("A");
    }else if($("#glg_total_na").is(":checked")){
        $("#glgdb_actionTL").val("C");
    }
    $("#glgdb_df").val($("#glg_input_dailyFigure").val());
    
    if($("#glg_cancelGrade").is(":checked")){
        $("#glgdb_cancel").val("C");
    }else if($("#glg_reopen").is(":checked")){
        $("#glgdb_actionTL").val("RO");
        $("#glgdb_actionML").val("RO");
        $("#glgdb_actionSP").val("RO");
    }else{
        $("#glgdb_cancel").val("A");
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


function gradeLiveProps(contestNum,type,doubleChance){
    var validate=true;
    switch (type){
        case 1:
            if($("#glgdb_"+contestNum+"_winner").val()===""){
                validate=false;
                alert("There is no winner for "+$("#glgdb_"+contestNum+"_contestDesc").val());
            }else if($("#glgdb_"+contestNum+"_points").val()===""){
                validate=false;
                alert("There is no Won By value for "+$("#glgdb_"+contestNum+"_contestDesc").val());
            }else{
                sendGradeSpread(contestNum);
            }
            break;
        case 2:
            if($("#glgdb_"+contestNum+"_winner").val()===""){
                validate=false;
                alert("There is no winner for "+$("#glgdb_"+contestNum+"_contestDesc").val());
            }else{
                sendGradeMoneyLine(contestNum,doubleChance);
            }
            break;
        case 3:
            if($("#glgdb_"+contestNum+"_points").val()===""){
                validate=false;
                alert("There is no Won By value for "+$("#glgdb_"+contestNum+"_contestDesc").val());
            }else{
                sendGradeTotal(contestNum);
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

function sendGradeProps(contestNum,contestantsArray,dailyFigure,cancel){
    $.ajax({
            url: "getProspGrading",
            type: 'POST',
            data: {
                "contestNum":(contestNum+"").replace("_A",""),
                "ct":$("#glgdb_"+contestNum+"_ct1").val(),
                "ct2":$("#glgdb_"+contestNum+"_ct2").val(),
                "ct3":$("#glgdb_"+contestNum+"_ct3").val(),
                "cd":$("#glgdb_"+contestNum+"_contestDesc").text(),
                "contestants":contestantsArray,
                "points":$("#glgdb_"+contestNum+"_points").val(),
                "df":dailyFigure,
                "status":cancel,
                "contestantNumbers":$("#glgdb_"+contestNum+"_ctString").val()
            },success: function (data) {
    //            alert(data);
            }
        });
}
function sendGradeSpread(contestNum){
    var contestants=$("#glgdb_"+contestNum+"_contestant").val().split("@");
    var winner=$("#glgdb_"+contestNum+"_winner").val();
    var contestantsArray=[];
    $.each(contestants,function (key,val){
        var contestantInfo=val.split("*");
        if(contestantInfo[1]===winner){
            contestantsArray.push(contestantInfo[0]+";W");
        }else{
            contestantsArray.push(contestantInfo[0]+";L");
        }
    });
    var cancel=$("#glgdb_"+contestNum+"_cancel").is(":checked")?"C":"A";
    
    var dateTime;
    var dailyFigure;
    if($("#glg_input_dailyFigure").val()===""){
        dateTime=$("#glgdb_"+contestNum+"_date").val().split(" ");
        var dateArray=dateTime[0].split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    }else{
        dateTime=$("#glg_input_dailyFigure").val();
        var dateArray=dateTime.split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    }
    sendGradeProps(contestNum,contestantsArray,dailyFigure,cancel);
}
/**
 * @author mcalderon
 * @description catch the grade information for a total props and send it to grade
 * @param {String} contestNum
 */
function sendGradeTotal(contestNum){
    var contestants=$("#glgdb_"+contestNum+"_contestant").val().split("@");
    var winner=$("#glgdb_"+contestNum+"_winner").val();
    var contestantsArray=[];
    $.each(contestants,function (key,val){
        var contestantInfo=val.split("*");
        contestantsArray.push(contestantInfo[0]+";W");
    });
    var cancel=$("#glgdb_"+contestNum+"_cancel").is(":checked")?"C":"A";
    
    var dateTime;
    var dailyFigure;
    if($("#glg_input_dailyFigure").val()===""){
        dateTime=$("#glgdb_"+contestNum+"_date").val().split(" ");
        var dateArray=dateTime[0].split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    }else{
        dateTime=$("#glg_input_dailyFigure").val();
        var dateArray=dateTime.split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    }
    sendGradeProps(contestNum,contestantsArray,dailyFigure,cancel);
}
/**
 * @author mcalderon
 * @description catch the grade information for a moneyLine props and send it to grade
 * @param {String} contestNum
 */
function sendGradeMoneyLine(contestNum,doubleChance){
    var contestantsArray=[];
    if(doubleChance===1){
        $("input[name='glgdb_"+contestNum+"_winner']").each(function (){
            if($(this).val()!==""){
                if($(this).is(":checked"))
                    contestantsArray.push($(this).val().trim()+";W");
                else
                    contestantsArray.push($(this).val().trim()+";L");
            }
        });
    }else{
        var contestants=$("#glgdb_"+contestNum+"_contestant").val().split("@");
        var winner=$("#glgdb_"+contestNum+"_winner").val();
        $.each(contestants,function (key,val){
            var contestantInfo=val.split("*");
            if(contestantInfo[1]===winner){
                contestantsArray.push(contestantInfo[0]+";W");
            }else{
                contestantsArray.push(contestantInfo[0]+";L");
            }
        });
    }
    var cancel=$("#glgdb_"+contestNum+"_cancel").is(":checked")?"C":"A";
    
    var dateTime;
    var dailyFigure;
    if($("#glg_input_dailyFigure").val()===""){
        dateTime=$("#glgdb_"+contestNum+"_date").val().split(" ");
        var dateArray=dateTime[0].split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    }else{
        dateTime=$("#glg_input_dailyFigure").val();
        var dateArray=dateTime.split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    }
    sendGradeProps(contestNum,contestantsArray,dailyFigure,cancel);
}

function glgdb_deleteMarkets(){
    $.ajax({
        url: "clearNoBetProps/"+$("#glgdb_liveGames").val(),
        success: function (data) {
            if ($("#sportLiveGradeDBFilter").val() === "" || $("#sportLiveGradeDBFilter").val() === null)
                alert("There's no sport selected");
            else if ($("#glgdb_gameDate").val() === "" || $("#glgdb_gameDate").val() === null)
                alert("There's no date selected");
            else if ($("#glgdb_liveGames").val() === "" || $("#glgdb_liveGames").val() === null)
                alert("There's no game selected");
            else {
                setScorePeriods();
            }
        }
    });
}


function sendPeriodScore(){
    var closeOpt=($("#cpmcloseOption").is(":checked")?1:2);
    $.ajax({
        url: "sendPeriodScore",
        type: 'POST',
        data: {
            "gameNum":$("#glgdb_liveGames").val(),
            "awayScore":$("#awawScore").val(),
            "homeScore":$("#homeScore").val(),
            "periodID":$("#cpm_PeriodId").val(),
            "option":closeOpt
        },success: function (data) {
            alert(data)
        }
    })
}
