var tmp;
var periods = [];
var selectedSport = "";
var selectedSubSport = "";
var negative2QFlag = false;
var negative3QFlag = false;
var negative4QFlag = false;
var negative1HFlag = false;
var negative2HFlag = false;
var negativeGFlag = false;
var notProcessableSubTypes=[100,1026,1028,1030,1040,1042,1052,108,1086,1088,109,1090,1096,1098,110,111,1110,1112,1114,1116,112,
1120,1136,1138,118,119,127,129,134,135,146,147,155,165,177,183,194,226,230,231,234,235,236,
237,238,24,25,259,30,918,926,96,97,98,99];
var spreadsSubTypeIds=[34,36,38,44,48,51,54,113,114,890,892,1142];
var scoreInfoBySport=[];

var propsPeriods=[];
propsPeriods["L-Soccer"]=["1st H","Game","Others"];
propsPeriods["L-Football"]=["Quarters","1st H","Game","Others"];
propsPeriods["L-Basketball"]=["Quarters","1st H","Game","Others"];
propsPeriods["L-Ice Hockey"]=["Periods","Game","Others"];
propsPeriods["L-Baseball"]=["Innings","Game","Others"];
propsPeriods["L-Tennis"]=["Sets", "Game","Others"];

var categoryNamePeriodsLink=[];
categoryNamePeriodsLink["1ST QUARTER"]=["Quarters"];
categoryNamePeriodsLink["2ND QUARTER"]=["Quarters"];
categoryNamePeriodsLink["3RD QUARTER"]=["Quarters"];
categoryNamePeriodsLink["4TH QUARTER"]=["Quarters"];
categoryNamePeriodsLink["QUARTER"]=["Quarters"];
categoryNamePeriodsLink["1ST PERIOD"]=["Periods"];
categoryNamePeriodsLink["2ND PERIOD"]=["Periods"];
categoryNamePeriodsLink["3RD PERIOD"]=["Periods"];
categoryNamePeriodsLink["PERIOD"]=["Periods"];
categoryNamePeriodsLink["SET"]=["Sets"];
categoryNamePeriodsLink["1ST HALF"]=["1st H"];
categoryNamePeriodsLink["INNING"]=["Innings"];
categoryNamePeriodsLink["OTHER"]=["Others"];
categoryNamePeriodsLink["GAME"]=["Game"];

var idTablesPeriodsLink=[];
idTablesPeriodsLink["1st H"]=["1st_H"];
idTablesPeriodsLink["Game"]=["game"];
idTablesPeriodsLink["Others"]=["others"];
idTablesPeriodsLink["Quarters"]=["quarters"];
idTablesPeriodsLink["Innings"]=["innings"];
idTablesPeriodsLink["Sets"]=["sets"];
idTablesPeriodsLink["Periods"]=["periods"];

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

    $('#glg_gameDateDiv').datetimepicker({
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });


    $(".score").keydown(function (e) {
        if (e.keyCode === 9) {
            $(this).next().next().next().focus();
            return false;
        }
    });

    $("#sportLiveGradeFilter").change(function () {
        setSubSportsPropGroups();
    });
    $("#glg_gameDate").change(function () {
        getGamesByDate(2);
    });
    $("#glg_getGamePropsInfo").click(function () {
        getGamesAndPropsInfo();
        return false;
    });
    
    $("#glg_setGradeInfoButon").click(function (){

        validateSetAdInfo();

    });

    $("#setGradeInfoButon").click(function () {
        setAditionalGradeInfo();
    });

    $("#glg_cancelGrade").click(function () {
        setCancel(this);
    });
    
    $("#gradeMassiveGames").click(function (){
        var rotNumsArray=$("input[name='gamesToGrade[]']:checked");
        rotNumsArray.each(function (){
            gradeGame($(this).val()); 
        });
    });
    
    $("#glg_gradeReadyProps").click(function (){
        massiveGrading();
    });
    
    
        $("#glg_gradePendingProps").click(function (){
       checkPending();
    });
    
    $("#glg_deleteMarkets").click(function (){
        if(confirm("Are You sure you want to delete all correlated props?"))
            glg_deleteMarkets();
    });
});
/**
 * @author mcalderon
 * @param {checkbox object} field
 * @description If field is checked set all noAction checkbox selected in grade Game modal
 */
function setCancel(field){
    if ($(field).is(":checked")) {
        $("#glg_spread_na").prop("checked", true);
        $("#glg_money_na").prop("checked", true);
        $("#glg_total_na").prop("checked", true);
        $("#glg_spread_na").prop("readonly", true);
        $("#glg_money_na").prop("readonly", true);
        $("#glg_total_na").prop("readonly", true);
        $("#glg_spread_g").prop("checked", false);
        $("#glg_money_g").prop("checked", false);
        $("#glg_total_g").prop("checked", false);
        $("#glg_spread_g").prop("disabled", true);
        $("#glg_money_g").prop("disabled", true);
        $("#glg_total_g").prop("disabled", true);
    } else {
        $("#glg_spread_na").prop("checked", false);
        $("#glg_money_na").prop("checked", false);
        $("#glg_total_na").prop("checked", false);
        $("#glg_spread_g").prop("disabled", false);
        $("#glg_money_g").prop("disabled", false);
        $("#glg_total_g").prop("disabled", false);
        $("#glg_spread_na").prop("readonly", false);
        $("#glg_money_na").prop("readonly", false);
        $("#glg_total_na").prop("readonly", false);
    }
}

/**
 * @author mcalderon
 * @description if no action checkbox selected = true action checkbox selected = false in grade Game modal
 * @param {checkbox} fieldId sp, ml, tl action, noAction checkbox
 * 
 */
function gradeNoactionSelection(fieldId) {
    var id = fieldId.split("_");
    if (id[1] === "g") {
        if ($("#" + fieldId).is(":checked")) {
            $("#" + id[0] + "_na").prop("checked", false);
        }
    } else if (id[1] === "na") {
        if ($("#" + fieldId).is(":checked")) {
            $("#" + id[0] + "_g").prop("checked", false);
        }
    }
}

/**
 * @param {String} sportType 
 * @description set the interface parameters according to the sport type selected
 */
function setSubSportsPropGroups(){
    var sportType = $("#sportLiveGradeFilter").val().trim();
    $("#glg_gameDate").val("");
    $("#glg_liveGames option").remove();
    loadSubSports(sportType);
    loadPeriods(sportType);
    loadPeriodButtons(sportType);
}

/**
 * @author mcalderon
 * @description Fill the subSports Select based on the selected sport
 * @param {String} sportType sport
 * 
 */
function loadSubSports(sportType) {
    $("#subsportLiveGradeFilter").find('option').remove();
    $.ajax({
        url: "../games/loadleagues/" + sportType,
        success: function (data) {
            var obj = JSON.parse(data);
            var select = $("#subsportLiveGradeFilter");
            $.each(obj, function (key, val) {
                var opt = new Option(val['SportSubType'].trim(), val['SportSubType'].trim());
                select.append(opt);
            });
            var opt = new Option("All Sub-Sports", "0");
            select.append(opt);
        }
    });
}
/**
 * @author mcalderon
 * @description set the period buttons for each selected sport
 * @param {String} sport
 */
function loadPeriodButtons(sport){
    var table=$("#glg_periodsFilterTable");
    $("#glg_periodsFilterTable tr").remove();
    var tr=$("<tr></tr>");
    $.each(propsPeriods[sport],function (key,val){
        tr.append('<td><button type="button" class="btn btn-default periodButtons" name="glg_'+idTablesPeriodsLink[val]+'" id="glg_'+idTablesPeriodsLink[val]+'" value="'+val+'" onclick="changePeriodTable(this.value)">'+val+'</button></td>')
    });
    table.append(tr);
}
/**
 * @author mcalderon
 * @description set the periods header in the score board for each sport
 * @param {string} sport
 * 
 */
function loadPeriods(sport){
    var tableHead=$("#glg_scoreBoard thead");
    var tableBody=$("#glg_scoreBoard tbody");
    $("#glg_scoreBoard thead tr").remove();
    $("#glg_scoreBoard tbody tr").remove();
    switch (sport){
        case "L-Soccer":
            var thead=$("<tr></tr>");
            thead.append("<th>1H</th>");
            thead.append("<th>2H</th>");
            thead.append("<th>1E</th>");
            thead.append("<th>2E</th>");
            thead.append("<th>PEN</th>");
            thead.append("<th>SCO</th>");
            thead.append("<th>RED</th>");
            thead.append("<th>YEL</th>");
            thead.append("<th>COR</th>");
            var tbodyA=$("<tr></tr>");
            tbodyA.append("<td><span id='glg_scoreBoardA_1h'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_2h'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_1e'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_2e'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_pen'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_sco'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_red'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_yel'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_cor'>0</span></td>");
            var tbodyH=$("<tr></tr>");
            tbodyH.append("<td><span id='glg_scoreBoardH_1h'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_2h'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_1e'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_2e'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_pen'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_sco'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_red'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_yel'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_cor'>0</span></td>");
            tableHead.append(thead);
            tableBody.append(tbodyA);
            tableBody.append(tbodyH);
            break;
        case "L-Basketball":
        case "L-Football":
            var thead=$("<tr></tr>");
            thead.append("<th>1Q</th>");
            thead.append("<th>2Q</th>");
            thead.append("<th>1H</th>");
            thead.append("<th>3Q</th>");
            thead.append("<th>4Q</th>");
            thead.append("<th>OT</th>");
            thead.append("<th>Total</th>");
            var tbodyA=$("<tr></tr>");
            tbodyA.append("<td><span id='glg_scoreBoardA_1q'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_2q'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_1h'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_3q'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_4q'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_ot'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_total'>0</span></td>");
            var tbodyH=$("<tr></tr>");
            tbodyH.append("<td><span id='glg_scoreBoardH_1q'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_2q'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_1h'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_3q'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_4q'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_ot'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_total'>0</span></td>");
            tableHead.append(thead);
            tableBody.append(tbodyA);
            tableBody.append(tbodyH);
            break;
        case "L-Tennis":
            var thead=$("<tr></tr>");
            thead.append("<th>1S</th>");
            thead.append("<th>2S</th>");
            thead.append("<th>3S</th>");
            thead.append("<th>4S</th>");
            thead.append("<th>5S</th>");
            thead.append("<th>PTS</th>");
            thead.append("<th>SETS</th>");
            var tbodyA=$("<tr></tr>");
            tbodyA.append("<td><span id='glg_scoreBoardA_1s'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_2s'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_3s'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_4s'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_5s'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_pts'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_sets'>0</span></td>");
            var tbodyH=$("<tr></tr>");
            tbodyH.append("<td><span id='glg_scoreBoardH_1s'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_2s'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_3s'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_4s'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_5s'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_pts'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_sets'>0</span></td>");
            tableHead.append(thead);
            tableBody.append(tbodyA);
            tableBody.append(tbodyH);
            break;
        case "L-Baseball":
            var thead=$("<tr></tr>");
            thead.append("<th>1</th>");
            thead.append("<th>2</th>");
            thead.append("<th>3</th>");
            thead.append("<th>4</th>");
            thead.append("<th>5</th>");
            thead.append("<th>6</th>");
            thead.append("<th>7</th>");
            thead.append("<th>8</th>");
            thead.append("<th>9</th>");
            thead.append("<th>EI</th>");
            thead.append("<th>R</th>");
            var tbodyA=$("<tr></tr>");
            tbodyA.append("<td><span id='glg_scoreBoardA_1'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_2'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_3'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_4'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_5'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_6'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_7'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_8'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_9'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_ei'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_r'>0</span></td>");
            var tbodyH=$("<tr></tr>");
            tbodyH.append("<td><span id='glg_scoreBoardH_1'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_2'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_3'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_4'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_5'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_6'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_7'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_8'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_9'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_ei'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_r'>0</span></td>");
            tableHead.append(thead);
            tableBody.append(tbodyA);
            tableBody.append(tbodyH);
            break;
        case 'L-Ice Hockey':
            var thead=$("<tr></tr>");
            thead.append("<th>1P</th>");
            thead.append("<th>2P</th>");
            thead.append("<th>3P</th>");
            thead.append("<th>OT</th>");
            thead.append("<th>Total</th>");
            var tbodyA=$("<tr></tr>");
            tbodyA.append("<td><span id='glg_scoreBoardA_1p'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_2p'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_3p'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_ot'>0</span></td>");
            tbodyA.append("<td><span id='glg_scoreBoardA_total'>0</span></td>");
            var tbodyH=$("<tr></tr>");
            tbodyH.append("<td><span id='glg_scoreBoardH_1p'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_2p'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_3p'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_ot'>0</span></td>");
            tbodyH.append("<td><span id='glg_scoreBoardH_total'>0</span></td>");
            tableHead.append(thead);
            tableBody.append(tbodyA);
            tableBody.append(tbodyH);
            break;
    }
}

/**
 * @author mcalderon
 * @description load the prop Groups, create a tab for each group and a table for each period in each group id tab
 * @param {String} sport
 */
function loadPropBRGroups(sport){
    $.ajax({
        url: "../grade/getPropGroupsBySport/"+sport,
        complete: function () {
            var matchId=$("#glg_liveGames").val();
            if(matchId!=="")
                getLiveBRProps(matchId)
        },
        success: function (data) {
            var obj=JSON.parse(data);
            var pestanas=$("#glg_propsSheeds");
            var tabs=$("#glg_tabs");
            $("#glg_propsSheeds li").remove();
            $("#glg_tabs div").remove();
            var cont=0;
            $.each(obj, function (key,val){
                if(cont===0){
                    var sheed='<li class="active glg_tabStyle"><a href="#tab'+val['GroupID']+'" data-toggle="tab">'+val["GroupName"]+'</a></li>'
                    var tab=$("<div class='tab-pane active scroll' id='tab"+val["GroupID"]+"'></div>");
                    var cont2=0;
                    $.each(propsPeriods[sport],function (key2,val2){
                        var activeClass;
                        if(cont2===0)
                            activeClass="showTable";
                        else
                            activeClass="hideTable";
                        tab.append("<table id='propsTable"+val["GroupID"]+"_"+idTablesPeriodsLink[val2]+"' class='propsTable "+activeClass+"' style='min-width:100%'></table>");
                        cont2++;
                    });
                }else{
                    var sheed='<li class="glg_tabStyle"><a href="#tab'+val['GroupID']+'" data-toggle="tab">'+val["GroupName"]+'</a></li>';
                    var tab=$("<div class='tab-pane scroll' id='tab"+val["GroupID"]+"'></div>");
                    var cont2=0;
                    $.each(propsPeriods[sport],function (key2,val2){
                        var activeClass;
                        if(cont2===0)
                            activeClass="showTable";
                        else
                            activeClass="hideTable";
                        tab.append("<table id='propsTable"+val["GroupID"]+"_"+idTablesPeriodsLink[val2]+"' class='propsTable "+activeClass+"' style='min-width:100%'></table>");
                        cont2++;
                    });
                }
                pestanas.append(sheed);
                tabs.append(tab);
                cont++;
            });
            var sheed='<li class="glg_tabStyle"><a href="#tab_all" data-toggle="tab">All</a></li>';
            var tab=$("<div class='tab-pane scroll' id='tab_all'></div>");
            tab.append("<table id='propsTable_All' class='propsTable' style='min-width:100%'></table>");
            pestanas.append(sheed);
            tabs.append(tab);
        }
        
    });
}

/**
 * @author mcalderon
 * @param {String} sport
 * @param {String} subsport 
 * @param {Date} dateFrom date Filter
 * @param {Date} dateTo date Filter
 * 
 * @description get Games for the game filter
 */
function getGamesByDate(company){
    if($("#glg_gameDate").val()!==""&&$("#sportLiveGradeFilter").val()!==""&&$("#subsportLiveGradeFilter").val()!==""){
        $.ajax({
        url: "../grade/getGameNumsByCompany",
        type: 'POST',
        data: {
            "sport": $("#sportLiveGradeFilter").val().trim(),
            "dateFrom": $("#glg_gameDate").val(),
            "company":company
        }, success: function (data) {
            var obj = JSON.parse(data);
            var select = $("#glg_liveGames");
            $("#glg_liveGames option").remove();
            var opt = new Option('','');
                select.append(opt);
            $.each(obj, function (key, val) {
                var opt = new Option(val['Team1ID'].trim()+" vs "+val['Team2ID'].trim(),val['GameNum'].trim());
                select.append(opt);
            });
        }
    });
    }else{
        alert("Sport, Sub Sport, and Date are required to select a game");
    }
}

/**
 * 
 * @param {type} field
 * @returns {undefined}
 */
function setFocusColor(field) {
    var inputs = $(field).parent().find(".score");
    if ($(field).is(":checked")) {
        inputs.each(function () {
            $(this).prop("class", "form-control score focusStyle");
            $(this).prop("readonly", false);
        });
    } else {
        inputs.each(function () {
            $(this).prop("class", "form-control score");
            $(this).prop("readonly", true);
        });
    }
}

/**
 * @description Submit form button action
 */
function getGamesAndPropsInfo(){
    var GameNum=$("#glg_liveGames").val();
    var sportType = $("#sportLiveGradeFilter").val().trim();
    var br=true;
    if(GameNum!==""){
        getLiveGameInfo(GameNum);
        if(br){
            $("#glg_awayTeamScore").css("visibility","visible");
            $("#glg_homeTeamScore").css("visibility","visible");
            $("#glg_gradeGameButton").css("visibility","visible");
            $("#glg_more").css("visibility","visible");
            loadPropBRGroups(sportType);
            
        }else{
            $("#glg_awayTeamScore").css("visibility","hidden");
            $("#glg_homeTeamScore").css("visibility","hidden");
            $("#glg_gradeGameButton").css("visibility","hidden");
            $("#glg_more").css("visibility","hidden");
            loadPropDBGroups(sportType);
        }
    }else{
        alert("No game selected");
    }
}
/**
 * 
 * @param {type} gameNum
 * @returns {undefined}
 */
function getLiveGameInfo(gameNum){
    $.ajax({
        url: "../grade/getlivegameinfo/"+gameNum,
        success: function (data) {
            var obj=JSON.parse(data);
            setScorboardBySport($("#sportLiveGradeFilter").val().trim(),obj);
            obj=null;
        }
    });
}

/**
 * @author mcalderon
 * @description Get all prop info for a specific matchId and set the prop in the table according to the groupId and Period
 * @param {string} matchId
 */
function getLiveBRProps(matchId){
    $("#glg_tabs table div").remove();
    $.ajax({
        url: "../grade/getLiveProps",
        type: 'POST',
        data:{
            "matchID":matchId,
            "clearBetStatus":($("#glg_clearBetStatus").is(":checked")?0:1)
        },
        success: function (data) {
            var obj=JSON.parse(data);
            $.each(obj,function (key,val){
                var grade="";
                if((val["Outcome"]!==""&&val["Score"]!=="")&&(val["Outcome"]!==null&&val["Score"]!==null)){
                    grade="class='graded'";
                }else if(val["ClearBetStatus"]==="true"){
                    grade="class='readyToGrade'";
                }else{
                    grade="class='inProgress'";
                }
                var tableId=(categoryNamePeriodsLink[val["CategoryName"]]===undefined?categoryNamePeriodsLink["OTHER"]:categoryNamePeriodsLink[val["CategoryName"]]);
                var table=$("#propsTable"+val["GroupID"]+"_"+idTablesPeriodsLink[tableId]);
                
                var trDiv=$("<div id='"+val["ContestNum"]+"' "+grade+"></div>");
                
                var div1=$("<div class='cDesc'></div>");
                div1.append("<span>"+val["ContestDesc"]+"</span>");
                div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"_cDesc' value='"+val["ContestDesc"].trim()+"'/>");
                div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"_ct1' value='"+val["ContestType"].trim()+"'/>");
                div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"_ct2' value='"+val["ContestType2"].trim()+"'/>");
                div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"_ct3' value='"+val["ContestType3"].trim()+"'/>");
                div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"_contestants' value='"+val["ContestantName"]+"'/>");
                div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"_df' value='"+val["ContestDateTime"]+"'/>");
                div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"_type' value='"+val["ThresholdType"]+"'/>");
                var div2=$("<div class='cont'></div>");
                
                /************************************************************************/
                var doubleChance=0;
                var contestants=val["ContestantName"].replace(/|/g , "").split("@");
                if(val["SubTypeID"]==="27"||val["SubTypeID"]==="1044"||val["SubTypeID"]==="918"){
                    doubleChance=1;
                }
                var winner;
                if(spreadsSubTypeIds.indexOf(parseInt(val["SubTypeID"]))!==-1){
                    setScoreInfoArray();
                    if(scoreInfoBySport[$("#sportLiveGradeFilter").val().trim()][val["SubTypeID"]][1]===1)
                        winner="|"+$("#glg_awayTeam").val().trim()+"|";
                    else
                        winner="|"+$("#glg_homeTeam").val().trim()+"|";
                }else{
                    winner=val["Winner"];
                }
                div2.append(setPropContestants(val["ContestNum"],val["ThresholdType"],contestants,val["SubTypeID"],val["Outcome"],val["Score"],winner,false));
                var referenceResult="";
                if(notProcessableSubTypes.indexOf(val["SubTypeID"])!==-1){
                    referenceResult="&nbsp;&nbsp;&nbsp;<span>"+val["Winner"]+"</span>";
                    div2.append(referenceResult);
                }
                /**********************************************************************************/
                var thresholdline="";
                if(val["Outcome"]!==null&&val["Outcome"]!==""&&val["Score"]!==""&&val["Score"]!==null){
                    thresholdline=val["Score"];
                }else{
                    thresholdline=scoreInfoBySport[$("#sportLiveGradeFilter").val().trim()][val["SubTypeID"]]!==undefined?scoreInfoBySport[$("#sportLiveGradeFilter").val().trim()][val["SubTypeID"]][0]:"";
                }
                var div3=$("<div class='odss'></div>");
                var tht="";
                if(val["ThresholdType"]!==null&&val["ThresholdType"].trim()==="S"){
                    tht=1;
                    div3.append("<label for='glg_odds_"+val["ContestNum"]+"'>Winner Wons by:</label>&nbsp;<input type='text' id='glg_odds_"+val["ContestNum"]+"' class='form-control' size='4' value='"+(thresholdline===undefined?"":thresholdline)+"'/>");
                }else if(val["ThresholdType"]!==null&&val["ThresholdType"].trim()==="P"){
                    tht=3;
                }else{
//                    div3.append("<input type='checkbox' id='glg_odds_"+val["ContestNum"]+"_push'/>&nbsp;<label class='control-label' for='glg_odds_"+val["ContestNum"]+"'>Push</label>");
                    tht=2;
                }
                
                var div4=$("<div class='cancel'></div>");
                var cancelled;
                (val["Outcome"]!==null&&val["Outcome"].trim()==="X")?cancelled="checked='checked'":cancelled="";
                div4.append("<input type='checkbox' "+cancelled+" id='glg_cancel_"+val["ContestNum"]+"'/>&nbsp;<label class='control-label' for='glg_cancel_"+val["ContestNum"]+"'>Cancel</label>");
                var div5=$("<div class='grade'></div>");
                div5.append("<button class='btn btn-success' type='button' onclick='gradeLiveProps("+val["ContestNum"]+","+tht+","+doubleChance+")'>Grade</grade>");
                
                trDiv.append(div1);
                trDiv.append(div2);
                trDiv.append(div3);
                trDiv.append(div4);
                trDiv.append(div5);
                
                table.append(trDiv);
                addPropToAllTable(val);
            });
          obj=null;  
        }
    });
    
}

/**
 * @author mcalderon
 * @description Insert each prop in the All tab and table
 * @param {array} val
 */
function addPropToAllTable(val){
    var tableAll=$("#propsTable_All");
    var grade="";
    if((val["Outcome"]!==""&&val["Score"]!=="")&&(val["Outcome"]!==null&&val["Score"]!==null)){
        grade="class='graded'";
    }else if(val["ClearBetStatus"]==="true"){
        grade="class='readyToGrade'";
    }else{
        grade="class='inProgress'";
    }
    var trDiv=$("<div id='"+val["ContestNum"]+"A' "+grade+"></div>");

    var div1=$("<div class='cDesc'></div>");
    div1.append("<span>"+val["ContestDesc"]+"</span>");
    div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"A_cDesc' value='"+val["ContestDesc"].trim()+"'/>");
    div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"A_ct1' value='"+val["ContestType"].trim()+"'/>");
    div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"A_ct2' value='"+val["ContestType2"].trim()+"'/>");
    div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"A_ct3' value='"+val["ContestType3"].trim()+"'/>");
    div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"A_contestants' value='"+val["ContestantName"]+"'/>");
    div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"A_df' value='"+val["ContestDateTime"]+"'/>");
    div1.append("<input type='hidden' id='glg_"+val["ContestNum"]+"A_type' value='"+val["ThresholdType"]+"'/>");
    var div2=$("<div class='cont'></div>");

    var thresholdline="";
    if(val["Outcome"]!==null&&val["Outcome"]!==""&&val["Score"]!==""&&val["Score"]!==null){
        thresholdline=val["Score"];
    }else{
        thresholdline=scoreInfoBySport[$("#sportLiveGradeFilter").val().trim()][val["SubTypeID"]]!==undefined?scoreInfoBySport[$("#sportLiveGradeFilter").val().trim()][val["SubTypeID"]][0]:"";
    }
    /************************************************************************/
    var doubleChance=0;
    var contestants=val["ContestantName"].replace(/|/g , "").split("@");
    if(val["SubTypeID"]==="27"||val["SubTypeID"]==="1044"||val["SubTypeID"]==="918"){
        doubleChance=1;
    }
    var winner;
    if(spreadsSubTypeIds.indexOf(parseInt(val["SubTypeID"]))!==-1){
        setScoreInfoArray();
        if(scoreInfoBySport[$("#sportLiveGradeFilter").val().trim()][val["SubTypeID"]][1]===1)
            winner="|"+$("#glg_awayTeam").val().trim()+"|";
        else
            winner="|"+$("#glg_homeTeam").val().trim()+"|";
    }else{
        winner=val["Winner"];
    }
    div2.append(setPropContestants(val["ContestNum"],val["ThresholdType"],contestants,val["SubTypeID"],val["Outcome"],val["Score"],winner,true));
    var referenceResult="";
    if(notProcessableSubTypes.indexOf(val["SubTypeID"])!==-1){
        referenceResult="&nbsp;&nbsp;&nbsp;<span>"+val["Winner"]+"</span>";
        div2.append(referenceResult);
    }
    /**********************************************************************************/
    var div3=$("<div class='odss'></div>");
    var tht="";
    if(val["ThresholdType"]!==null&&val["ThresholdType"].trim()==="S"){
        tht=1;
        div3.append("<label for='glg_odds_"+val["ContestNum"]+"A'>Winner Wons by:</label>&nbsp;<input type='text' id='glg_odds_"+val["ContestNum"]+"A' class='form-control' size='4' value='"+(thresholdline===undefined?"":thresholdline)+"'/>")
    }else if(val["ThresholdType"]!==null&&val["ThresholdType"].trim()==="P"){
        tht=3;
    }else{
//        div3.append("<input type='checkbox' id='glg_odds_"+val["ContestNum"]+"A_push'/>&nbsp;<label class='control-label' for='glg_odds_"+val["ContestNum"]+"A_push'>Push</label>");
        tht=2;
    }

    var div4=$("<div class='cancel'></div>");
    var cancelled;
    (val["Outcome"]!==null&&val["Outcome"].trim()==="X")?cancelled="checked='checked'":cancelled="";

    
    div4.append("<input type='checkbox' "+cancelled+" id='glg_cancel_"+val["ContestNum"]+"A'/>&nbsp;<label class='control-label' for='glg_cancel_"+val["ContestNum"]+"A'>Cancel</label>");

    var div5=$("<div class='grade'></div>");
    div5.append("<button class='btn btn-success' type='button' onclick='gradeLiveProps(&#39;"+val["ContestNum"]+"A&#39;,"+tht+","+doubleChance+")'>Grade</grade>");

    trDiv.append(div1);
    trDiv.append(div2);
    trDiv.append(div3);
    trDiv.append(div4);
    trDiv.append(div5);

    tableAll.append(trDiv);
    
}
/**
 * @description set the contestants and its results based on the clearbet
 * @param {String} ContestNum
 * @param {String} ThresholdType
 * @param {String} contestants
 * @param {String} SubTypeID
 * @param {String} Outcome
 * @param {String} Score
 * @returns {String}
 */
function setPropContestants(ContestNum,ThresholdType,contestants,SubTypeID,Outcome,Score,clearBetWinner,allTable){
    var allId=(allTable?"A":"");
    var thresholdline="";
    if(Outcome!==null&&Outcome!==""&&Score!==""&&Score!==null){
        thresholdline=Score;
    }else{
        thresholdline=scoreInfoBySport[$("#sportLiveGradeFilter").val().trim()][SubTypeID]!==undefined?scoreInfoBySport[$("#sportLiveGradeFilter").val().trim()][SubTypeID]:"";
    }
    switch (ThresholdType){
        case "P":
            var totalField="<label for='glg_odds_"+ContestNum+"'>Total:</label>&nbsp;<input type='text'  value='"+thresholdline+"' id='glg_odds_"+ContestNum+allId+"' class='form-control' size='4'/>";
            return totalField;
        default :
            var select;
            if(SubTypeID==="27"||SubTypeID==="1044"||SubTypeID==="918"){
                var doubleChanceField="";
                $.each(contestants, function (key1,val1){
                    var optemp=val1.split("*");
                    var checked="";
                    var oc="L";
                    if(optemp[2]!==undefined&&optemp[2]==="W"){
                        checked="checked='checked'";
                        oc="W";
                    }
                    doubleChanceField+="<div class='glg_addon'><input type='checkbox' name='"+ContestNum+allId+"_winner"+"' id='"+optemp[1]+"' value='"+optemp[0]+";"+oc+"' "+checked+" onclick='changeDoubleChanceValue(this)'/>&nbsp;<label class='labelAddon' for='"+optemp[1]+"'>"+optemp[0]+"</label></div><br/>";
                });
                return doubleChanceField;
            }else{
                select=$("<select id='"+ContestNum+allId+"_winner' class='form-control' style='width:200px'></select>");
                var opt=new Option("","");
                select.append(opt);
                $.each(contestants, function (key1,val1){
                    var optemp=val1.split("*");
                    var opt=new Option(optemp[0],optemp[1]);
                    var teamName=optemp[0].trim();
                    if(optemp[2]!==undefined&&optemp[2]==="W"){
                        $(opt).attr("selected","selected");
                    }else if((optemp[2]===undefined||optemp[2]==="")&&(clearBetWinner!==undefined&&clearBetWinner!==""&&clearBetWinner!==null)){
                        if(teamName===clearBetWinner.trim()){
                            $(opt).attr("selected","selected");
                        }
                    }
                    select.append(opt);
                });
            }
            return select;
    }
}


/**
 * @author mcalderon
 * @description Change the winner value por the contestants winner
 * @param {object} input
 * @returns {undefined}
 */
function changeDoubleChanceValue(input){
    if($(input).is(":checked")){
        var value=$(input).val().split(";");
        $(input).val(value[0]+";W");
    }else{
        var value=$(input).val().split(";");
        $(input).val(value[0]+";L");
    }
}

/**
 * @author mcalderon
 * @description set the score information according to each sport
 * @param {String} sport
 * @param {String} data
 */
function setScorboardBySport(sport,data){
    var homeScore=[];
    var awayScore=[];
    var otherInfo=[];
    var team1=data["row1"]
    ["Team1ID"];
    var team2=data["row1"]["Team2ID"];
    $("#glg_awayTeam").val(team2);
    $("#glg_homeTeam").val(team1);
    $("#glg_gameDateTime").val(data["row1"]["GameDateTime"]);
    $("#glg_rot").val(data["row1"]["Team1RotNum"]);
    $("#glg_gameNum").val(data["row1"]["GameNum"]);
//    $("#glg_cancel").val(data["row1"]["MatchStatus"]);
    if(data["row1"]["CancelSpreadFlag"]==="Y"){
        $("#glg_actionSP").val("C");
    }else{
        $("#glg_actionSP").val("A");
    }
    if(data["row1"]["CancelMoneylineFlag"]==="Y"){
        $("#glg_actionML").val("C");
    }else{
        $("#glg_actionML").val("A");
    }
    if(data["row1"]["CancelTtlPtsFlag"]==="Y"){
        $("#glg_actionTL").val("C");
    }else{
        $("#glg_actionTL").val("A");
    }
    $("#glg_clearBetsButon").attr("onclick","clearBets('"+data["row1"]["CorrelationID"].trim()+"')");
    
    if(data["row1"]["GradeDateTime"]!==""&&data["row1"]["GradeDateTime"]!==null){
        $("#glg_gradeGameButton").attr("class","btn btn-danger");
        $("#glg_gradeGameButton").text("Re-Grade");
    }else{
        $("#glg_gradeGameButton").attr("class","btn btn-success");
        $("#glg_gradeGameButton").text("Grade");
    }
    switch (sport){
        case "L-Soccer":
            var homeScore=[];
            var awayScore=[];
            $.each(data,function (key,val){
                if (val['PeriodInPlay'] === "0"||(val["PeriodNumber"]==="3"||val["PeriodNumber"]==="4")||(val["PeriodNumber"]==="5"&&val['PeriodInPlay'] === "1")){
                    if  (val['ScoreHome'] > 0) {
                        homeScore[val['PeriodNumber']]=val["ScoreHome"];
                    }
                    if  (val['ScoreAway'] > 0) {
                        awayScore[val['PeriodNumber']]=val["ScoreAway"];
                    }

                    otherInfo[0]=val["AwayScore"];
                    otherInfo[1]=val["HomeScore"];
                    otherInfo[2]=val["RedCardsAway"];
                    otherInfo[3]=val["RedCardsHome"];
                    otherInfo[4]=val["YellowCardsAway"];
                    otherInfo[5]=val["YellowCardsHome"];
                    otherInfo[6]=val["AwayCorners"];
                    otherInfo[7]=val["HomeCorners"];
                }

            });
            $("#glg_scoreBoardA_1h").text((awayScore[1]!==undefined?awayScore[1]:"0"));
            $("#glg_scoreBoardA_2h").text((awayScore[2]!==undefined?awayScore[2]:"0"));
            $("#glg_scoreBoardA_1e").text((awayScore[3]!==undefined?awayScore[3]:"0"));
            $("#glg_scoreBoardA_2e").text((awayScore[4]!==undefined?awayScore[4]:"0"));
            $("#glg_scoreBoardA_pen").text((awayScore[5]!==undefined?awayScore[5]:"0"));
            $("#glg_scoreBoardA_sco").text(otherInfo[0]);
            $("#glg_scoreBoardA_red").text(otherInfo[2]);
            $("#glg_scoreBoardA_yel").text(otherInfo[4]);
            $("#glg_scoreBoardA_cor").text(otherInfo[6]);
            
            $("#glg_scoreBoardH_1h").text((homeScore[1]!==undefined?homeScore[1]:"0"));
            $("#glg_scoreBoardH_2h").text((homeScore[2]!==undefined?homeScore[2]:"0"));
            $("#glg_scoreBoardH_1e").text((homeScore[3]!==undefined?homeScore[3]:"0"));
            $("#glg_scoreBoardH_2e").text((homeScore[4]!==undefined?homeScore[4]:"0"));
            $("#glg_scoreBoardH_pen").text((homeScore[5]!==undefined?homeScore[5]:"0"));
            $("#glg_scoreBoardH_sco").text(otherInfo[1]);
            $("#glg_scoreBoardH_red").text(otherInfo[3]);
            $("#glg_scoreBoardH_yel").text(otherInfo[5]);
            $("#glg_scoreBoardH_cor").text(otherInfo[7]);
            
            $("#glg_awayTeamScore").val(otherInfo[0]);
            $("#glg_homeTeamScore").val(otherInfo[1]);
            getSoccerPropInfo();
            break;
        case "L-Basketball":
        case "L-Football":
            var homeScore=[];
            var awayScore=[];
            $.each(data,function (key,val){
                if (val['PeriodInPlay'] === "0"){
                    if  (val['ScoreHome'] > 0) {
                        homeScore[val['PeriodNumber']]=val["ScoreHome"];
                        if (val['PeriodNumber'] > 4)
                            homeScore[5]= val['ScoreHome'];
                    }if  (val['ScoreAway'] > 0) {
                        awayScore[val['PeriodNumber']]=val["ScoreAway"];
                        if (val['PeriodNumber'] > 4)
                            awayScore[5]= val['ScoreAway'];   
                    }
                    otherInfo[0]=val["AwayScore"];
                    otherInfo[1]=val["HomeScore"];
                }
                
            });
            var fhAwayScore1=awayScore[1]!==undefined?awayScore[1]:0;
            var fhAwayScore2=awayScore[2]!==undefined?awayScore[2]:0;
            var fhHomeScore1=homeScore[1]!==undefined?homeScore[1]:0;
            var fhHomeScore2=homeScore[2]!==undefined?homeScore[2]:0;
            var firstHA=(parseInt(fhAwayScore1)+parseInt(fhAwayScore2));
            var firstHH=(parseInt(fhHomeScore1)+parseInt(fhHomeScore2));
            
            var otA=(parseInt((awayScore[1]!==undefined?awayScore[1]:"0"))+parseInt((awayScore[2]!==undefined?awayScore[2]:"0"))
                    +parseInt((awayScore[3]!==undefined?awayScore[3]:"0"))+parseInt((awayScore[4]!==undefined?awayScore[4]:"0")))
                    -parseInt(otherInfo[0]);
            var otH=(parseInt((homeScore[1]!==undefined?homeScore[1]:"0"))+parseInt((homeScore[2]!==undefined?homeScore[2]:"0"))
                    +parseInt((homeScore[3]!==undefined?homeScore[3]:"0"))+parseInt((homeScore[4]!==undefined?homeScore[4]:"0")))
                    -parseInt(otherInfo[1]);
            $("#glg_scoreBoardA_1q").text((awayScore[1]!==undefined?awayScore[1]:"0"));
            $("#glg_scoreBoardA_2q").text((awayScore[2]!==undefined?awayScore[2]:"0"));
            $("#glg_scoreBoardA_1h").text((firstHA!==undefined?firstHA:"0"));
            $("#glg_scoreBoardA_3q").text((awayScore[3]!==undefined?awayScore[3]:"0"));
            $("#glg_scoreBoardA_4q").text((awayScore[4]!==undefined?awayScore[4]:"0"));
            $("#glg_scoreBoardA_ot").text(otA);
            $("#glg_scoreBoardA_total").text(otherInfo[0]);
            
            $("#glg_scoreBoardH_1q").text((homeScore[1]!==undefined?homeScore[1]:"0"));
            $("#glg_scoreBoardH_2q").text((homeScore[2]!==undefined?homeScore[2]:"0"));
            $("#glg_scoreBoardH_1h").text(firstHH!==undefined?firstHH:"0");
            $("#glg_scoreBoardH_3q").text((homeScore[3]!==undefined?homeScore[3]:"0"));
            $("#glg_scoreBoardH_4q").text((homeScore[4]!==undefined?homeScore[4]:"0"));
            $("#glg_scoreBoardH_ot").text(otH);
            $("#glg_scoreBoardH_total").text(otherInfo[1]);
            
            $("#glg_awayTeamScore").val(otherInfo[0]);
            $("#glg_homeTeamScore").val(otherInfo[1]);
            if(sport==="L-Basketball"){
                getBaskeballPropInfo();
            }else{
                getFootballPropInfo();
            }
            break;
        case "L-Tennis":
            var homeScore=[];
            var awayScore=[];
            var setCounts=0;
            $.each(data,function (key,val){
                if (val['PeriodInPlay'] === "0"){
                    if  (val['ScoreHome'] > 0) {
                        homeScore[val['PeriodNumber']]=val["ScoreHome"];
                    }if  (val['ScoreAway'] > 0) {
                        awayScore[val['PeriodNumber']]=val["ScoreAway"];
                    }
                }
                otherInfo[0]=val["GameAwayScore"];
                otherInfo[1]=val["AwayTennis"];
                
                otherInfo[2]=val["GameHomeScore"];
                otherInfo[3]=val["HomeTennis"];
                setCounts=val["TennisSetsCount"];
            });
            $("#glg_scoreBoardA_1s").text((awayScore[1]!==undefined?awayScore[1]:"0"));
            $("#glg_scoreBoardA_2s").text((awayScore[2]!==undefined?awayScore[2]:"0"));
            $("#glg_scoreBoardA_3s").text((awayScore[3]!==undefined?awayScore[3]:"0"));
            if(setCounts==="5"){
                $("#glg_scoreBoardA_4s").text((awayScore[4]!==undefined?awayScore[4]:"0"));
                $("#glg_scoreBoardA_5s").text((awayScore[5]!==undefined?awayScore[5]:"0"));
            }else{
                $("#glg_scoreBoardA_4s").text("-");
                $("#glg_scoreBoardA_5s").text("-");
            }
            $("#glg_scoreBoardA_pts").text(otherInfo[0]);
            $("#glg_scoreBoardA_sets").text(otherInfo[1]);
            
            $("#glg_scoreBoardH_1s").text((homeScore[1]!==undefined?homeScore[1]:"0"));
            $("#glg_scoreBoardH_2s").text((homeScore[2]!==undefined?homeScore[2]:"0"));
            $("#glg_scoreBoardH_3s").text((homeScore[3]!==undefined?homeScore[3]:"0"));
            if(setCounts==="5"){
                $("#glg_scoreBoardH_4s").text((homeScore[4]!==undefined?homeScore[4]:"0"));
                $("#glg_scoreBoardH_5s").text((homeScore[5]!==undefined?homeScore[5]:"0"));
             }else{   
                $("#glg_scoreBoardH_4s").text("-");
                $("#glg_scoreBoardH_5s").text("-");
             }
            $("#glg_scoreBoardH_pts").text(otherInfo[2]);
            $("#glg_scoreBoardH_sets").text(otherInfo[3]);
            $("#glg_awayTeamScore").val(otherInfo[1]);
            $("#glg_homeTeamScore").val(otherInfo[3]);
            getTennisPropInfo();
            break;
        case "L-Baseball":
            var homeScore=[];
            var awayScore=[];
            var addedScores=[];
            $.each(data,function (key,val){
                if(addedScores.indexOf(val['PeriodNumber'])===-1 && 0 < parseInt(val['PeriodNumber'])&&parseInt(val['PeriodNumber'])< 14){
                    homeScore[val['PeriodNumber']]=val["ScoreHome"];
                    awayScore[val['PeriodNumber']]=val["ScoreAway"];
                    addedScores.push(val['PeriodNumber']);
                }
            });
            otherInfo[0]=data["row1"]["AwayScore"];
            otherInfo[1]=data["row1"]["HomeScore"];
            
            for(var i=1;i<awayScore.length;i++){
                if(i===10){
                    $("#glg_scoreBoardA_ei").text((awayScore[10]!==undefined?awayScore[10]:"0"));
                    $("#glg_scoreBoardH_ei").text((homeScore[10]!==undefined?homeScore[10]:"0"));
                }else{
                    $("#glg_scoreBoardA_"+i).text((awayScore[i]!==undefined?awayScore[i]:"0"));
                    $("#glg_scoreBoardH_"+i).text((homeScore[i]!==undefined?homeScore[i]:"0"));
                }
                
            }
                
            $("#glg_scoreBoardA_r").text(otherInfo[0]);
            $("#glg_scoreBoardH_r").text(otherInfo[1]);
            
            $("#glg_awayTeamScore").val(otherInfo[0]);
            $("#glg_homeTeamScore").val(otherInfo[1]);
            getBaseballPropInfo();

            break;
        case "L-Ice Hockey":
            var homeScore=[];
            var awayScore=[];
            $.each(data,function (key,val){
                if (val['PeriodInPlay'] === "0"){
                    if  (val['ScoreHome'] > 0) {
                        homeScore[val['PeriodNumber']]=val["ScoreHome"];
                    }if  (val['ScoreAway'] > 0) {
                        awayScore[val['PeriodNumber']]=val["ScoreAway"];
                    }
                }
                otherInfo[0]=val["AwayScore"];
                otherInfo[1]=val["HomeScore"];
            });
            $("#glg_scoreBoardA_1p").text((awayScore[1]!==undefined?awayScore[1]:"0"));
            $("#glg_scoreBoardA_2p").text((awayScore[2]!==undefined?awayScore[2]:"0"));
            $("#glg_scoreBoardA_3p").text((awayScore[3]!==undefined?awayScore[3]:"0"));
            $("#glg_scoreBoardA_ot").text((awayScore[4]!==undefined?awayScore[4]:"0"));
            $("#glg_scoreBoardA_total").text(otherInfo[0]);

            $("#glg_scoreBoardH_1p").text((homeScore[1]!==undefined?homeScore[1]:"0"));
            $("#glg_scoreBoardH_2p").text((homeScore[2]!==undefined?homeScore[2]:"0"));
            $("#glg_scoreBoardH_3p").text((homeScore[3]!==undefined?homeScore[3]:"0"));
            $("#glg_scoreBoardH_ot").text((homeScore[4]!==undefined?homeScore[4]:"0"));
            $("#glg_scoreBoardH_total").text(otherInfo[1]);
            
            $("#glg_awayTeamScore").val(otherInfo[0]);
            $("#glg_homeTeamScore").val(otherInfo[1]);
            getHockeyPropInfo();
            break;
    }
    setScoreInfoArray();
}
/**
 * @author mcalderon
 * @description hide and show the prop tables according to the period pressed button
 * @param {String} period
 * @returns {undefined}
 * 
 */
function changePeriodTable(period){
    $("#glg_periodsFilterTable button").removeClass();
    $("#glg_periodsFilterTable button").attr("class","btn btn-default periodButtons");
    $("#glg_"+idTablesPeriodsLink[period]).removeClass();
    $("#glg_"+idTablesPeriodsLink[period]).attr("class","btn btn-info periodButtons");
    
    var activeTableId=$(".tab-content").find(".showTable");
    activeTableId.each(function (){
        var tableId=$(this).attr("id");
    
        $("#"+tableId).removeClass();
        $("#"+tableId).attr("class","propsTable hideTable");

        var tmp=tableId.split("_");
        $("#"+tmp[0]+"_"+idTablesPeriodsLink[period]).removeClass();
        $("#"+tmp[0]+"_"+idTablesPeriodsLink[period]).attr("class","propsTable showTable");
    });
}

function sendPropsGrade(contestNum,contestantNums,contestantsArray,dailyFigure,cancel){
    $.ajax({
        url: "getProspGrading",
        type: 'POST',
        data: {
            "contestNum":(contestNum+"").replace("A",""),
            "contestantNumbers":contestantNums,
            "ct":$("#glg_"+contestNum+"_ct1").val(),
            "ct2":$("#glg_"+contestNum+"_ct2").val(),
            "ct3":$("#glg_"+contestNum+"_ct3").val(),
            "cd":$("#glg_"+contestNum+"_cDesc").val(),
            "contestants":contestantsArray,
            "points":$("#glg_odds_"+contestNum).val(),
            "df":dailyFigure,
            "status":cancel,
            "contestDate":$("#glg_"+contestNum+"_df").val()
        },success: function (data) {
//            alert(data);
        }
    });
}

/**
 * @author mcalderon
 * @description catch the grade information for a spread props and send it to grade
 * @param {String} contestNum
 */
function sendGradeSpread(contestNum){
    var contestants=$("#glg_"+contestNum+"_contestants").val().split("@");
    var winner=$("#"+contestNum+"_winner").val();
    var contestantsArray=[];
    $.each(contestants,function (key,val){
        var contestantInfo=val.split("*");
        if(contestantInfo[1]===winner){
            contestantsArray.push(contestantInfo[0]+";W");
        }else{
            contestantsArray.push(contestantInfo[0]+";L");
        }
    });
    var cancel=$("#glg_cancel_"+contestNum).is(":checked")?"C":"A";
    
    var dateTime;
    var dailyFigure;
    if($("#glg_input_dailyFigure").val()===""){
        dateTime=$("#glg_"+contestNum+"_df").val().split(" ");
        var dateArray=dateTime[0].split("-");
        dailyFigure=dateArray[1]+"-"+dateArray[2]+"-"+dateArray[0];
    }else{
        dateTime=$("#glg_input_dailyFigure").val();
        var dateArray=dateTime.split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    }
    
    var contestantNums="";
    $.each($("#"+contestNum+"_winner option"),function (){
        contestantNums+=$(this).val()+"-";
    });
    sendPropsGrade(contestNum,contestantNums,contestantsArray,dailyFigure,cancel);
}

/**
 * @author mcalderon
 * @description catch the grade information for a total props and send it to grade
 * @param {String} contestNum
 */
function sendGradeTotal(contestNum){
    var contestants=$("#glg_"+contestNum+"_contestants").val().split("@");
    var winner=$("#"+contestNum+"_winner").val();
    var contestantsArray=[];
    $.each(contestants,function (key,val){
        var contestantInfo=val.split("*");
        contestantsArray.push(contestantInfo[0]+";W");
    });
    var cancel=$("#glg_cancel_"+contestNum).is(":checked")?"C":"A";
    
    var dateTime;
    var dailyFigure;
    if($("#glg_input_dailyFigure").val()===""){
        dateTime=$("#glg_"+contestNum+"_df").val().split(" ");
        var dateArray=dateTime[0].split("-");
        dailyFigure=dateArray[1]+"-"+dateArray[2]+"-"+dateArray[0];
    }else{
        dateTime=$("#glg_input_dailyFigure").val();
        var dateArray=dateTime.split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2]
    }
    var contestantNums="";
    $.each($("#"+contestNum+"_winner option"),function (){
        contestantNums+=$(this).val()+"-";
    });
    sendPropsGrade(contestNum,contestantNums,contestantsArray,dailyFigure,cancel);
}
/**
 * @author mcalderon
 * @description catch the grade information for a moneyLine props and send it to grade
 * @param {String} contestNum
 */
function sendGradeMoneyLine(contestNum,doubleChance){
    var contestantsArray=[];
    if(doubleChance===1){
        $("input[name='"+contestNum+"_winner']").each(function (){
            contestantsArray.push($(this).val());
        });
    }else{
        var contestants=$("#glg_"+contestNum+"_contestants").val().split("@");
        var winner=$("#"+contestNum+"_winner").val();
        $.each(contestants,function (key,val){
            var contestantInfo=val.split("*");
            if(contestantInfo[1]===winner){
                contestantsArray.push(contestantInfo[0]+";W");
            }else{
                contestantsArray.push(contestantInfo[0]+";L");
            }
        });
    }
    var cancel=$("#glg_cancel_"+contestNum).is(":checked")?"C":"A";
    
    var dateTime;
    var dailyFigure;
    if($("#glg_input_dailyFigure").val()===""){
        dateTime=$("#glg_"+contestNum+"_df").val().split(" ");
        var dateArray=dateTime[0].split("-");
        dailyFigure=dateArray[1]+"-"+dateArray[2]+"-"+dateArray[0];
    }else{
        dateTime=$("#glg_input_dailyFigure").val();
        var dateArray=dateTime.split("-");
        dailyFigure=dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
        var datetime2=$("#glg_"+contestNum+"_df").val().split(" ");
        d1=new Date(dateArray[2]+"-"+dateArray[0]+"-"+dateArray[1]);
        d2=new Date(datetime2[0]);
    }
    var contestantNums="";
    $.each($("#"+contestNum+"_winner option"),function (){
        contestantNums+=$(this).val()+",";
    });
    sendPropsGrade(contestNum,contestantNums,contestantsArray,dailyFigure,cancel);
}

/**
 * @author mcalderon
 * @description Individual grade button function, type 1=Spreads 2=MoneyLine 3=Total, it send a 
 * double chance prop alert to grade moneyline, block the grade button after click and change 
 * the color of the sended prop
 * @param {String} contestNum
 * @param {int} type
 * @param {int} doubleChance
 */
function gradeLiveProps(contestNum,type,doubleChance){
    var validate=true;
    switch (type){
        case 1:
            if($("#"+contestNum+"_winner").val()===""){
                validate=false;
                alert("There is no winner for "+$("#glg_"+contestNum+"_cDesc").val());
            }else if($("#glg_odds_"+contestNum).val()===""){
                validate=false;
                alert("There is no Won By value for "+$("#glg_"+contestNum+"_cDesc").val());
            }else{
                sendGradeSpread(contestNum);
            }
            break;
        case 2:
            if($("#"+contestNum+"_winner").val()===""){
                validate=false;
                alert("There is no winner for "+$("#glg_"+contestNum+"_cDesc").val());
            }else{
                sendGradeMoneyLine(contestNum,doubleChance);
            }
            break;
        case 3:
            if($("#glg_odds_"+contestNum).val()===""){
                validate=false;
                alert("There is no Won By value for "+$("#glg_"+contestNum+"_cDesc").val());
            }else{
                sendGradeTotal(contestNum);
            }
            break;
    }
    if(validate){
        $("div[id^='"+contestNum+"']").find("button").removeAttr("class");
        $("div[id^='"+contestNum+"']").find("button").attr("class","btn btn-default");
        $("div[id^='"+contestNum+"']").find("button").prop("disabled",true);
        $("div[id^='"+contestNum+"']").removeAttr("class");
        $("div[id^='"+contestNum+"']").attr("class","gradeInProgress");
    }
}

function clearAditionalInfoModal(){
    var ckboxes=$("#liveGradeInfoModal input[type='checkbox']");
    $.each(ckboxes,function (){
        $(this).prop("checked",false);
        $(this).prop("disabled",false);
    });
}
/**
 * @author mcalderon
 * @description open the aditional inf modal for game Grading (+ button) set the game parameters
 * daily figure date action/noaction cancel reopen etc...
 * 
 */
function openLiveGradeAditionalInfoModal(){
    clearAditionalInfoModal();
    var dateTime=$("#glg_gameDateTime").val().split(" ");
    var dateArray=dateTime[0].split("-");
    var date=dateArray[1]+"-"+dateArray[2]+"-"+dateArray[0];
    $("#glg_input_dailyFigure").val(date);
    if($("#glg_actionSP").val()==="A"){
        $("#glg_spread_g").prop("checked",true);
        $("#glg_spread_na").prop("checked",false);
    }else if($("#glg_actionSP").val()==="C"){
        $("#glg_spread_na").prop("checked",true);
        $("#glg_spread_g").prop("checked",false);
    }
    if($("#glg_actionML").val()==="A"){
        $("#glg_money_g").prop("checked",true);
        $("#glg_money_na").prop("checked",false);
    }else if($("#glg_actionML").val()==="C"){
        $("#glg_money_na").prop("checked",true);
        $("#glg_money_g").prop("checked",false);
    }
    if($("#glg_actionTL").val()==="A"){
        $("#glg_total_g").prop("checked",true);
        $("#glg_total_na").prop("checked",false);
    }else if($("#glg_actionTL").val()==="C"){
        $("#glg_total_na").prop("checked",true);
        $("#glg_total_g").prop("checked",false);
    }
    if($("#glg_cancel").val()==="C"){
        $("#glg_cancelGrade").prop("checked",true);
    }else{
        $("#glg_cancelGrade").prop("checked",false);
        
    }
    $("#liveGradeInfoModal").modal("toggle");
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

/**
 * @author mcalderon
 * @description "Set" button in aditional info modal. change the values of daily figure date and action 
 * according to the new options selected.
 * 
 */
function setAditionalLiveGradeInfo(){
    if($("#glg_spread_g").is(":checked")){
        $("#glg_actionSP").val("A");
    }else if($("#glg_spread_na").is(":checked")){
        $("#glg_actionSP").val("C");
    }
    if($("#glg_money_g").is(":checked")){
        $("#glg_actionML").val("A");
    }else if($("#glg_money_na").is(":checked")){
        $("#glg_actionML").val("C");
    }
    if($("#glg_total_g").is(":checked")){
        $("#glg_actionTL").val("A");
    }else if($("#glg_total_na").is(":checked")){
        $("#glg_actionTL").val("C");
    }
    $("#glg_fd").val($("#glg_input_dailyFigure").val());
    
    if($("#glg_cancelGrade").is(":checked")){
        $("#glg_cancel").val("C");
    }else if($("#glg_reopen").is(":checked")){
        $("#glg_actionTL").val("RO");
        $("#glg_actionML").val("RO");
        $("#glg_actionSP").val("RO");
    }else{
        $("#glg_cancel").val("A");
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
        $.ajax({
            url: "gradeindividualgame",
            type: 'POST',
            data: {
                "sp": $("#glg_actionSP").val(),
                "ml": $("#glg_actionML").val(),
                "tl": $("#glg_actionTL").val(),
                "df": $("#glg_fd").val(),
                "team1": $("#glg_awayTeam").val(),
                "team2": $("#glg_homeTeam").val(),
                "period": 0,
                "periodname": "Game",
                "rot": $("#glg_rot").val(),
                "gameDate": $("#glg_gameDateTime").val(),
                "scoreAway": $("#glg_awayTeamScore").val(),
                "pointsAway": $("#glg_awayTeamScore").val(),
                "scoreHome": $("#glg_homeTeamScore").val(),
                "pointsHome": $("#glg_homeTeamScore").val(),
                "subSport": $("#subsportLiveGradeFilter").val(),
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
 * @description Set the score information for each sport and period in to an array
 * 
 */
function setScoreInfoArray(){
    scoreInfoBySport["L-Soccer"]=soccerSubTypeIds;
    scoreInfoBySport["L-Football"]=footballSubTypeIds;
    scoreInfoBySport["L-Basketball"]=basketballSubTypeIds;
    scoreInfoBySport["L-Ice Hockey"]=hockeySubTypeIds;
    scoreInfoBySport["L-Baseball"]=baseballSubTypeIds;
    scoreInfoBySport["L-Tennis"]=tennisSubTypeIds;
}

/**
 * @author mcalderon
 * @description send all the showed props to grade 
 * 
 */
function massiveGrading(){
    var table=$("#glg_tabs .active").find(".showTable");
    var props=table.find(".readyToGrade");
    $(props).each(function (){
        $(this).find("button").trigger("click");
    });
}

/**
 * 
 * @description delete all no beted props
 */
function glg_deleteMarkets(){
    $.ajax({
        url: "clearNoBetProps/"+$("#glg_liveGames").val(),
        success: function (data) {
            getGamesAndPropsInfo();
        }
    });
}
    function checkPending(){
    $.ajax({
        url: "checkPendingProps/"+$("#glg_gameNum").val(),
        success: function (data) {
            alert(data);
        }
    });
    
    
}

