var soccerScoreInfo=[];
var basketBallScoreInfo=[];
var tennisScoreInfo=[];
var hockeyScoreInfo=[];
var footballScoreInfo=[];
var baseballScoreInfo=[]

var soccerSubTypeIds=[];
var basketballSubTypeIds=[];
var tennisSubTypeIds=[];
var hockeySubTypeIds=[];
var footballSubTypeIds=[];
var baseballSubTypeIds=[];

/**
 * @author mcalderon
 * @description take the score information from scoreboard to get the results for spreads and total props for soccer
 * 
 */
function getSoccerPropInfo(){
    var scoreA1H=parseInt($("#glg_scoreBoardA_1h").text());
    var scoreH1H=parseInt($("#glg_scoreBoardH_1h").text());
    
    var scoreAGame=parseInt($("#glg_scoreBoardA_sco").text());
    var scoreHGame=parseInt($("#glg_scoreBoardH_sco").text());
    
    var scoreAOT1=parseInt($("#glg_scoreBoardA_1e").text());
    var scoreHOT1=parseInt($("#glg_scoreBoardH_1e").text());
    
    var scoreAOT2=parseInt($("#glg_scoreBoardA_2e").text());
    var scoreHOT2=parseInt($("#glg_scoreBoardH_2e").text());
    
    var cardsAGame=parseInt($("#glg_scoreBoardA_red").text())+parseInt($("#glg_scoreBoardA_yel").text());
    var cardsHGame=parseInt($("#glg_scoreBoardH_red").text())+parseInt($("#glg_scoreBoardH_yel").text());
    
    var cornersAGame=parseInt($("#glg_scoreBoardA_cor").text());
    var cornersHGame=parseInt($("#glg_scoreBoardH_cor").text());
    
    soccerScoreInfo["score1H"]=[scoreA1H,scoreH1H];
    soccerScoreInfo["scoreOT"]=[scoreAOT1+scoreAOT2,scoreHOT1+scoreHOT2];
    soccerScoreInfo["scoreOT1"]=[scoreAOT1,scoreHOT1];
    soccerScoreInfo["scoreGame"]=[scoreAGame,scoreHGame];
    soccerScoreInfo["cardsGame"]=[cardsAGame,cardsHGame];
    soccerScoreInfo["cornersGame"]=[cornersAGame,cornersHGame];

    //TOTALS
    soccerSubTypeIds[33]=soccerScoreInfo["scoreGame"][0]+soccerScoreInfo["scoreGame"][1];
    soccerSubTypeIds[142]=soccerScoreInfo["scoreGame"][1];
    soccerSubTypeIds[143]=soccerScoreInfo["scoreGame"][0];
    soccerSubTypeIds[28]=soccerScoreInfo["scoreGame"][1];
    soccerSubTypeIds[32]=soccerScoreInfo["scoreGame"][0];
    soccerSubTypeIds[35]=soccerScoreInfo["score1H"][0]+soccerScoreInfo["score1H"][1];
    soccerSubTypeIds[144]=soccerScoreInfo["score1H"][1];
    soccerSubTypeIds[145]=soccerScoreInfo["score1H"][0];
    soccerSubTypeIds[21]=soccerScoreInfo["score1H"][0]+soccerScoreInfo["score1H"][1];
    soccerSubTypeIds[2000]=soccerScoreInfo["scoreGame"][0]+soccerScoreInfo["scoreGame"][1];
    soccerSubTypeIds[7]=soccerScoreInfo["scoreOT"][0]+soccerScoreInfo["scoreOT"][1];
    //CARDS
    soccerSubTypeIds[153]=soccerScoreInfo["cardsGame"][0]+soccerScoreInfo["cardsGame"][1];
    soccerSubTypeIds[161]=soccerScoreInfo["cardsGame"][0];
    soccerSubTypeIds[159]=soccerScoreInfo["cardsGame"][1];

    //CORNERS
    soccerSubTypeIds[126]=soccerScoreInfo["cornersGame"][0]+soccerScoreInfo["cornersGame"][1];
    soccerSubTypeIds[132]=soccerScoreInfo["cornersGame"][1];
    soccerSubTypeIds[133]=soccerScoreInfo["cornersGame"][0];

    //SPREADS
    var winnerTeamGame=1;
    if(soccerScoreInfo["scoreGame"][0]>soccerScoreInfo["scoreGame"][1])
        winnerTeamGame=1;
    else if(soccerScoreInfo["scoreGame"][0]<soccerScoreInfo["scoreGame"][1])
        winnerTeamGame=2;
    
    var winnerTeamHalf=0;
    if(soccerScoreInfo["score1H"][0]>soccerScoreInfo["score1H"][1])
        winnerTeamHalf=1;
    else if(soccerScoreInfo["score1H"][0]<soccerScoreInfo["score1H"][1])
        winnerTeamHalf=2;
    
    var winnerOverTime=0;
    if(soccerScoreInfo["scoreOT"][0]>soccerScoreInfo["scoreOT"][1])
        winnerOverTime=1;
    else
        winnerOverTime=2;
    
    var winnerOverTime1=0;
    if(soccerScoreInfo["scoreOT1"][0]>soccerScoreInfo["scoreOT1"][1])
        winnerOverTime1=1;
    else
        winnerOverTime1=2;
    soccerSubTypeIds[34]=[Math.abs(soccerScoreInfo["scoreGame"][0]-soccerScoreInfo["scoreGame"][1]),winnerTeamGame];
    soccerSubTypeIds[36]=[Math.abs(soccerScoreInfo["score1H"][0]-soccerScoreInfo["score1H"][1]),winnerTeamHalf];
    soccerSubTypeIds[113]=[Math.abs(soccerScoreInfo["scoreOT"][0]-soccerScoreInfo["scoreOT"][1]),winnerOverTime]
    soccerSubTypeIds[114]=[Math.abs(soccerScoreInfo["scoreOT1"][0]-soccerScoreInfo["scoreOT1"][1]),winnerOverTime1]
}
/**
 * @author mcalderon
 * @description take the score information from scoreboard to get the results for spreads and total props for Basketball
 * 
 */
function getBaskeballPropInfo(){
    var scoreH1q=parseInt($("#glg_scoreBoardH_1q").text());
    var scoreA1q=parseInt($("#glg_scoreBoardA_1q").text());
    var scoreH2q=parseInt($("#glg_scoreBoardH_2q").text());
    var scoreA2q=parseInt($("#glg_scoreBoardA_2q").text());
    var scoreH3q=parseInt($("#glg_scoreBoardH_3q").text());
    var scoreA3q=parseInt($("#glg_scoreBoardA_3q").text());
    var scoreH4q=parseInt($("#glg_scoreBoardH_4q").text());
    var scoreA4q=parseInt($("#glg_scoreBoardA_4q").text());
    var scoreH1H=parseInt($("#glg_scoreBoardH_1h").text());
    var scoreA1H=parseInt($("#glg_scoreBoardA_1h").text());
    var scoreHot=parseInt($("#glg_scoreBoardH_ot").text());
    var scoreAot=parseInt($("#glg_scoreBoardA_ot").text());
    var scoreHtot=parseInt($("#glg_scoreBoardH_total").text());
    var scoreAtot=parseInt($("#glg_scoreBoardA_total").text());
    
    basketBallScoreInfo["score1q"]=[scoreA1q,scoreH1q];
    basketBallScoreInfo["score2q"]=[scoreA2q,scoreH2q];
    basketBallScoreInfo["score1H"]=[scoreA1H,scoreH1H];
    basketBallScoreInfo["score3q"]=[scoreA3q,scoreH3q];
    basketBallScoreInfo["score4q"]=[scoreA4q,scoreH4q];
    basketBallScoreInfo["scoreot"]=[scoreAot,scoreHot];
    basketBallScoreInfo["scoretot"]=[scoreAtot,scoreHtot];
    //TOTALS
    basketballSubTypeIds[43]=basketBallScoreInfo["score1q"][0]+basketBallScoreInfo["score1q"][1];
    basketballSubTypeIds[47]=basketBallScoreInfo["score2q"][0]+basketBallScoreInfo["score2q"][1];
    basketballSubTypeIds[50]=basketBallScoreInfo["score3q"][0]+basketBallScoreInfo["score3q"][1];
    basketballSubTypeIds[53]=basketBallScoreInfo["score4q"][0]+basketBallScoreInfo["score4q"][1];
    basketballSubTypeIds[21]=basketBallScoreInfo["score1H"][0]+basketBallScoreInfo["score1H"][1];
    basketballSubTypeIds[39]=basketBallScoreInfo["scoretot"][0]+basketBallScoreInfo["scoretot"][1];
    //SPREADS
    
    var winnerTeamGame=0;
    if(basketBallScoreInfo["score4q"][0]>basketBallScoreInfo["score4q"][1])
        winnerTeamGame=1;
    else if(basketBallScoreInfo["score4q"][0]<basketBallScoreInfo["score4q"][1])
        winnerTeamGame=2;
    
    var winnerTeamHalf=0;
    if(basketBallScoreInfo["score1H"][0]>basketBallScoreInfo["score1H"][1])
        winnerTeamHalf=1;
    else if(basketBallScoreInfo["score1H"][0]<basketBallScoreInfo["score1H"][1])
        winnerTeamHalf=2;
    
    var winnerTeamQ1=0;
    if(basketBallScoreInfo["score1q"][0]>basketBallScoreInfo["score1q"][1])
        winnerTeamQ1=1;
    else if(basketBallScoreInfo["score1q"][0]<basketBallScoreInfo["score1q"][1])
        winnerTeamQ1=2;
    
    var winnerTeamQ2=0;
    if(basketBallScoreInfo["score2q"][0]>basketBallScoreInfo["score2q"][1])
        winnerTeamQ2=1;
    else if(basketBallScoreInfo["score2q"][0]<basketBallScoreInfo["score2q"][1])
        winnerTeamQ2=2;
    
    var winnerTeamQ3=0;
    if(basketBallScoreInfo["score3q"][0]>basketBallScoreInfo["score3q"][1])
        winnerTeamQ3=1;
    else if(basketBallScoreInfo["score3q"][0]<basketBallScoreInfo["score3q"][1])
        winnerTeamQ3=2;
    
    var winnerTeamQ4=0;
    if(basketBallScoreInfo["score4q"][0]>basketBallScoreInfo["score4q"][1])
        winnerTeamQ4=1;
    else if(basketBallScoreInfo["score4q"][0]<basketBallScoreInfo["score4q"][1])
        winnerTeamQ4=2;
    
    basketballSubTypeIds[38]=[Math.abs(basketBallScoreInfo["scoretot"][0]-basketBallScoreInfo["scoretot"][1]),winnerTeamGame];
    basketballSubTypeIds[36]=[Math.abs(basketBallScoreInfo["score1H"][0]-basketBallScoreInfo["score1H"][1]),winnerTeamHalf];
    basketballSubTypeIds[44]=[Math.abs(basketBallScoreInfo["score1q"][0]-basketBallScoreInfo["score1q"][1]),winnerTeamQ1];
    basketballSubTypeIds[48]=[Math.abs(basketBallScoreInfo["score2q"][0]-basketBallScoreInfo["score2q"][1]),winnerTeamQ2];
    basketballSubTypeIds[51]=[Math.abs(basketBallScoreInfo["score3q"][0]-basketBallScoreInfo["score3q"][1]),winnerTeamQ3];
    basketballSubTypeIds[54]=[Math.abs(basketBallScoreInfo["score4q"][0]-basketBallScoreInfo["score4q"][1]),winnerTeamQ4];

}
/**
 * @author mcalderon
 * @description take the score information from scoreboard to get the results for spreads and total props for Hockey
 * 
 */
function getHockeyPropInfo(){
    var scoreH1p=parseInt($("#glg_scoreBoardH_1p").text());
    var scoreA1p=parseInt($("#glg_scoreBoardA_1p").text());
    var scoreH2p=parseInt($("#glg_scoreBoardH_2p").text());
    var scoreA2p=parseInt($("#glg_scoreBoardA_2p").text());
    var scoreH3p=parseInt($("#glg_scoreBoardH_3p").text());
    var scoreA3p=parseInt($("#glg_scoreBoardA_3p").text());
    var scoreHot=parseInt($("#glg_scoreBoardH_ot").text());
    var scoreAot=parseInt($("#glg_scoreBoardA_ot").text());
    var scoreHtot=parseInt($("#glg_scoreBoardA_total").text());
    var scoreAtot=parseInt($("#glg_scoreBoardH_total").text());
    
    hockeyScoreInfo["score1p"]=[scoreA1p,scoreH1p];
    hockeyScoreInfo["score2p"]=[scoreA2p,scoreH2p];
    hockeyScoreInfo["score3p"]=[scoreA3p,scoreH3p];
    hockeyScoreInfo["scoreot"]=[scoreAot,scoreHot];
    hockeyScoreInfo["scoretot"]=[scoreAtot,scoreHtot];
    
    //TOTALS
    hockeySubTypeIds[43]=hockeyScoreInfo["score1p"][0]+hockeyScoreInfo["score1p"][1];
    hockeySubTypeIds[1094]=hockeyScoreInfo["scoreot"][0]+hockeyScoreInfo["scoreot"][1];
    hockeySubTypeIds[33]=hockeyScoreInfo["scoretot"][0]+hockeyScoreInfo["scoretot"][1];
    
//    SPREADS
    var winnerTeamGame=0;
    if(hockeyScoreInfo["scoretot"][0]>hockeyScoreInfo["scoretot"][1])
        winnerTeamGame=1;
    else if(hockeyScoreInfo["scoretot"][0]<hockeyScoreInfo["scoretot"][1])
        winnerTeamGame=2;
    
    var winnerTeam1P=0;
    if(hockeyScoreInfo["score1p"][0]>hockeyScoreInfo["score1p"][1])
        winnerTeam1P=1;
    else if(hockeyScoreInfo["score1p"][0]<hockeyScoreInfo["score1p"][1])
        winnerTeam1P=2;
    
    var winnerTeam2P=0;
    if(hockeyScoreInfo["score2p"][0]>hockeyScoreInfo["score2p"][1])
        winnerTeam2P=1;
    else if(hockeyScoreInfo["score2p"][0]<hockeyScoreInfo["score2p"][1])
        winnerTeam2P=2;
    
    var winnerTeam3P=0;
    if(hockeyScoreInfo["score3p"][0]>hockeyScoreInfo["score3p"][1])
        winnerTeam3P=1;
    else if(hockeyScoreInfo["score3p"][0]<hockeyScoreInfo["score3p"][1])
        winnerTeam3P=2;
    

    hockeySubTypeIds[34]=[Math.abs(hockeyScoreInfo["scoretot"][0]+hockeyScoreInfo["scoretot"][1]),winnerTeamGame];
    hockeySubTypeIds[1142]=[Math.abs(hockeyScoreInfo["scoreot"][0]+hockeyScoreInfo["scoreot"][1]),winnerTeamGame];
    hockeySubTypeIds[44]=[Math.abs(hockeyScoreInfo["score1p"][0]+hockeyScoreInfo["score1p"][1]),winnerTeam1P];
    hockeySubTypeIds[48]=[Math.abs(hockeyScoreInfo["score2p"][0]+hockeyScoreInfo["score2p"][1]),winnerTeam2P];
    hockeySubTypeIds[51]=[Math.abs(hockeyScoreInfo["score3p"][0]+hockeyScoreInfo["score3p"][1]),winnerTeam3P];
}
/**
 * @author mcalderon
 * @description take the score information from scoreboard to get the results for spreads and total props for Tennis
 * 
 */
function getTennisPropInfo(){
    var scoreH1s=parseInt($("#glg_scoreBoardH_1s").text());
    var scoreA1s=parseInt($("#glg_scoreBoardA_1s").text());
    var scoreH2s=parseInt($("#glg_scoreBoardH_2s").text());
    var scoreA2s=parseInt($("#glg_scoreBoardA_2s").text());
    var scoreH3s=parseInt($("#glg_scoreBoardH_3s").text());
    var scoreA3s=parseInt($("#glg_scoreBoardA_3s").text());
    var scoreH4s=$("#glg_scoreBoardH_4s").text()==="-"?0:parseInt($("#glg_scoreBoardH_4s").text());
    var scoreA4s=$("#glg_scoreBoardA_4s").text()==="-"?0:parseInt($("#glg_scoreBoardA_4s").text());
    var scoreH5s=$("#glg_scoreBoardH_5s").text()==="-"?0:parseInt($("#glg_scoreBoardH_5s").text());
    var scoreA5s=$("#glg_scoreBoardA_5s").text()==="-"?0:parseInt($("#glg_scoreBoardA_5s").text());
    var scoreHSets=parseInt($("#glg_scoreBoardH_sets").text());
    var scoreASets=parseInt($("#glg_scoreBoardA_sets").text());
    
    tennisScoreInfo["score1s"]=[scoreA1s,scoreH1s];
    tennisScoreInfo["score2s"]=[scoreA2s,scoreH2s];
    tennisScoreInfo["score3s"]=[scoreA3s,scoreH3s];
    tennisScoreInfo["score4s"]=[scoreA4s,scoreH4s];
    tennisScoreInfo["score5s"]=[scoreA5s,scoreH5s];
    tennisScoreInfo["scoresets"]=[scoreASets,scoreHSets];
    
    
    tennisSubTypeIds[83]=tennisScoreInfo["score1s"][0]+tennisScoreInfo["score1s"][1]+tennisScoreInfo["score2s"][0]+tennisScoreInfo["score2s"][1]+
        tennisScoreInfo["score3s"][0]+tennisScoreInfo["score3s"][1]+tennisScoreInfo["score4s"][0]+tennisScoreInfo["score4s"][1]+
        tennisScoreInfo["score5s"][0]+tennisScoreInfo["score5s"][1];
tennisSubTypeIds[84]=tennisScoreInfo["score1s"][0]+tennisScoreInfo["score1s"][1];
tennisSubTypeIds[85]=tennisScoreInfo["score2s"][0]+tennisScoreInfo["score2s"][1];
var awayGames=tennisScoreInfo["score1s"][0]+tennisScoreInfo["score2s"][0]+tennisScoreInfo["score3s"][0]+tennisScoreInfo["score4s"][0]+tennisScoreInfo["score5s"][0];
var HomeGames=tennisScoreInfo["score1s"][1]+tennisScoreInfo["score2s"][1]+tennisScoreInfo["score3s"][1]+tennisScoreInfo["score4s"][1]+tennisScoreInfo["score5s"][1];
var winnerTeamGame=0;
    if(awayGames>HomeGames)
        winnerTeamGame=1;
    else if(awayGames<HomeGames)
        winnerTeamGame=2;
tennisSubTypeIds[922]=[Math.abs(awayGames-HomeGames),winnerTeamGame];
}

/**
 * @author mcalderon
 * @description take the score information from scoreboard to get the results for spreads and total props for Football
 * 
 */
function getFootballPropInfo(){
    var scoreH1q=parseInt($("#glg_scoreBoardH_1q").text());
    var scoreA1q=parseInt($("#glg_scoreBoardA_1q").text());
    var scoreH2q=parseInt($("#glg_scoreBoardH_2q").text());
    var scoreA2q=parseInt($("#glg_scoreBoardA_2q").text());
    var scoreH3q=parseInt($("#glg_scoreBoardH_3q").text());
    var scoreA3q=parseInt($("#glg_scoreBoardA_3q").text());
    var scoreH4q=parseInt($("#glg_scoreBoardH_4q").text());
    var scoreA4q=parseInt($("#glg_scoreBoardA_4q").text());
    var scoreA1H=parseInt($("#glg_scoreBoardH_1h").text());
    var scoreH1H=parseInt($("#glg_scoreBoardA_1h").text());
    var scoreHtot=parseInt($("#glg_scoreBoardH_total").text());
    var scoreAtot=parseInt($("#glg_scoreBoardA_total").text());
    
    footballScoreInfo["score1q"]=[scoreA1q,scoreH1q];
    footballScoreInfo["score2q"]=[scoreA2q,scoreH2q];
    footballScoreInfo["score1H"]=[scoreA1H,scoreH1H];
    footballScoreInfo["score3q"]=[scoreA3q,scoreH3q];
    footballScoreInfo["score4q"]=[scoreA4q,scoreH4q];
    footballScoreInfo["scoretot"]=[scoreAtot,scoreHtot];
    
    footballSubTypeIds[39]=footballScoreInfo["scoretot"][0]+footballScoreInfo["scoretot"][1];
    footballSubTypeIds[21]=footballScoreInfo["score1H"][0]+footballScoreInfo["score1H"][1];
    footballSubTypeIds[43]=footballScoreInfo["score1q"][0]+footballScoreInfo["score1q"][1];
    footballSubTypeIds[47]=footballScoreInfo["score2q"][0]+footballScoreInfo["score2q"][1];
    footballSubTypeIds[50]=footballScoreInfo["score3q"][0]+footballScoreInfo["score3q"][1];
    footballSubTypeIds[53]=footballScoreInfo["score4q"][0]+footballScoreInfo["score4q"][1];
    footballSubTypeIds[142]=footballScoreInfo["scoretot"][0];
    footballSubTypeIds[143]=footballScoreInfo["scoretot"][1];
    footballSubTypeIds[232]=footballScoreInfo["score1H"][0];
    footballSubTypeIds[233]=footballScoreInfo["score1H"][1];
    
    var winnerTeamGame=0;
    if(footballScoreInfo["scoretot"][0]>footballScoreInfo["scoretot"][1])
        winnerTeamGame=1;
    else if(footballScoreInfo["scoretot"][0]<footballScoreInfo["scoretot"][1])
        winnerTeamGame=2;
    
    var winnerTeamHalf=0;
    if(footballScoreInfo["score1H"][0]>footballScoreInfo["score1H"][1])
        winnerTeamHalf=1;
    else if(footballScoreInfo["score1H"][0]<footballScoreInfo["score1H"][1])
        winnerTeamHalf=2;
    
    footballSubTypeIds[36]=[Math.abs(footballScoreInfo["score1H"][0]-footballScoreInfo["score1H"][1]),winnerTeamGame];
    footballSubTypeIds[38]=[Math.abs(footballScoreInfo["scoretot"][0]-footballScoreInfo["scoretot"][1]),winnerTeamHalf];
    
}

function getBaseballPropInfo(){
    var scoreAIN1=parseInt($("#glg_scoreBoardA_1").text());
    var scoreAIN2=parseInt($("#glg_scoreBoardA_2").text());
    var scoreAIN3=parseInt($("#glg_scoreBoardA_3").text());
    var scoreAIN4=parseInt($("#glg_scoreBoardA_4").text());
    var scoreAIN5=parseInt($("#glg_scoreBoardA_5").text());
    var scoreAIN6=parseInt($("#glg_scoreBoardA_6").text());
    var scoreAIN7=parseInt($("#glg_scoreBoardA_7").text());
    var scoreAIN8=parseInt($("#glg_scoreBoardA_8").text());
    var scoreAIN9=parseInt($("#glg_scoreBoardA_9").text());
    var scoreATot=parseInt($("#glg_scoreBoardA_r").text());
    
    var scoreHIN1=parseInt($("#glg_scoreBoardH_1").text());
    var scoreHIN2=parseInt($("#glg_scoreBoardH_2").text());
    var scoreHIN3=parseInt($("#glg_scoreBoardH_3").text());
    var scoreHIN4=parseInt($("#glg_scoreBoardH_4").text());
    var scoreHIN5=parseInt($("#glg_scoreBoardH_5").text());
    var scoreHIN6=parseInt($("#glg_scoreBoardH_6").text());
    var scoreHIN7=parseInt($("#glg_scoreBoardH_7").text());
    var scoreHIN8=parseInt($("#glg_scoreBoardH_8").text());
    var scoreHIN9=parseInt($("#glg_scoreBoardH_9").text());
    var scoreHTot=parseInt($("#glg_scoreBoardH_r").text());
    
    var scoreA1H=scoreAIN1+scoreAIN2+scoreAIN3+scoreAIN4+scoreAIN5;
    var scoreH1H=scoreHIN1+scoreHIN2+scoreHIN3+scoreHIN4;
    
    var scoreA2H=scoreAIN9+scoreAIN8+scoreAIN7+scoreAIN6;
    var scoreH2H=scoreHIN5+scoreHIN6+scoreHIN7+scoreHIN8+scoreHIN9;
    
    baseballScoreInfo["scoreIN1"]=[scoreAIN1,scoreHIN1];
    baseballScoreInfo["scoreIN2"]=[scoreAIN2,scoreHIN2];
    baseballScoreInfo["scoreIN3"]=[scoreAIN3,scoreHIN3];
    baseballScoreInfo["scoreIN4"]=[scoreAIN4,scoreHIN4];
    baseballScoreInfo["scoreIN5"]=[scoreAIN5,scoreHIN5];
    baseballScoreInfo["score1H"]=[scoreA1H,scoreH1H];
    baseballScoreInfo["scoreIN6"]=[scoreAIN6,scoreHIN6];
    baseballScoreInfo["scoreIN7"]=[scoreAIN7,scoreHIN7];
    baseballScoreInfo["scoreIN8"]=[scoreAIN8,scoreHIN8];
    baseballScoreInfo["scoreIN9"]=[scoreAIN9,scoreHIN9];
    baseballScoreInfo["score2H"]=[scoreA2H,scoreH2H];
    baseballScoreInfo["scoreTot"]=[scoreATot,scoreHTot];

    
//    TOTALS
    baseballSubTypeIds[39]=baseballScoreInfo["scoreTot"][0]+baseballScoreInfo["scoreTot"][1];
    baseballSubTypeIds[878]=baseballScoreInfo["scoreTot"][1];
    baseballSubTypeIds[880]=baseballScoreInfo["scoreTot"][0];
    baseballSubTypeIds[21]=baseballScoreInfo["score1H"][0]+baseballScoreInfo["score1H"][1];
    baseballSubTypeIds[337]=baseballScoreInfo["score1H"][0]+baseballScoreInfo["score1H"][1]+baseballScoreInfo["scoreIN5"][1];
    baseballSubTypeIds[886]=baseballScoreInfo["score1H"][1]+baseballScoreInfo["scoreIN5"][1];
    baseballSubTypeIds[888]=baseballScoreInfo["score1H"][0];
    baseballSubTypeIds[43]=baseballScoreInfo["scoreIN1"][0]+baseballScoreInfo["scoreIN1"][1];
    baseballSubTypeIds[47]=baseballScoreInfo["scoreIN2"][0]+baseballScoreInfo["scoreIN2"][1];
    baseballSubTypeIds[50]=baseballScoreInfo["scoreIN3"][0]+baseballScoreInfo["scoreIN3"][1];
    baseballSubTypeIds[53]=baseballScoreInfo["scoreIN4"][0]+baseballScoreInfo["scoreIN4"][1];
    baseballSubTypeIds[70]=baseballScoreInfo["scoreIN5"][0]+baseballScoreInfo["scoreIN5"][1];
    baseballSubTypeIds[202]=baseballScoreInfo["scoreIN6"][0]+baseballScoreInfo["scoreIN6"][1];
    baseballSubTypeIds[204]=baseballScoreInfo["scoreIN7"][0]+baseballScoreInfo["scoreIN7"][1];
    baseballSubTypeIds[206]=baseballScoreInfo["scoreIN8"][0]+baseballScoreInfo["scoreIN8"][1];
    baseballSubTypeIds[232]=baseballScoreInfo["score1H"][1];
    baseballSubTypeIds[233]=baseballScoreInfo["score1H"][0];
    
//    SPREADS
    var gameWinner;
    if(baseballScoreInfo["scoreTot"][0]>baseballScoreInfo["scoreTot"][1])
        gameWinner=1;
    else
        gameWinner=2;
    
    var firstHWinner;
    if(baseballScoreInfo["score1H"][0]>baseballScoreInfo["score1H"][1])
        firstHWinner=1;
    else
        firstHWinner=2;
    
    var first5IWinner;
    if(baseballScoreInfo["score1H"][0]>(baseballScoreInfo["score1H"][1]+baseballScoreInfo["scoreIN5"][1]))
        first5IWinner=1;
    else
        first5IWinner=2;
    baseballSubTypeIds[38]=[Math.abs(baseballScoreInfo["scoreTot"][0]-baseballScoreInfo["scoreTot"][1]),gameWinner];
    baseballSubTypeIds[890]=[Math.abs(baseballScoreInfo["score1H"][0]-baseballScoreInfo["score1H"][1]),firstHWinner];
    baseballSubTypeIds[892]=[Math.abs(baseballScoreInfo["score1H"][0]-baseballScoreInfo["score1H"][1]-baseballScoreInfo["scoreIN5"][1]),first5IWinner];
}

