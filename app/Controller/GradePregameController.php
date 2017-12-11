<?php


App::uses('AppController', 'Controller','Log');


/**
 * Static content controller
 *
 * Override this controller by placing a copy in controllers directory of an application
 *
 * @package       app.Controller
 * @link http://book.cakephp.org/2.0/en/controllers/pages-controller.html
 */
class GradePregameController extends AppController {
    /**
     * 
     * @author mcalderon
     * @return array Sports
     */
    public function gradepregame(){
        $this->set('dbs', explode(",", $this->getAllPregameDBs()));
        $this->set("sports",$this->getSports($this->getMainPregameDB()));
        
    }
    
    public function getAjaxSports(){
        $db=@$_POST["selectedDB"];
        return new CakeResponse(array('body' => json_encode($this->getSports($db))));
    }
    
    function getSports($db){
        $soapPreGame = $this->getService('preGameService');
    	$result = $soapPreGame->getScheduleSports(array("db"=>$this ->getPregameDB($db,"Read")));
        $sports = json_decode($result->return, true);
        return $sports["results"];
    }

    /**
     * @author mcalderon
     * @param int $gameNum game number
     */
    public function generalpropsgrading(){
        $GameNum=@$_POST['gameNumRedirect'];
        $optionText="";
        $optionValue="";
        if(!empty($GameNum)){
            $soapPreGame = $this->getService('preGameService');
            $result = $soapPreGame->getGame(array("db"=>$this -> getLiveDatabase(), "gameNum" => $GameNum));
            $array = json_decode($result->return,true);
            $optionValue=$array['results']['row1']['CorrelationID'];
            $optionText=$array['results']['row1']['Team1ID']." vs ".$array['results']['row1']['Team2ID'];
        }
        $soapPreGame = $this->getService('preGameService');
    	$result = $soapPreGame->getScheduleSports(array("db"=>$this -> getLiveDatabase()));
        $sports = json_decode($result->return, true);
        
        $this->set('sports', $sports['results']);
        
        $this->set('otionValue', $optionValue);
        $this->set('optionText', $optionText);
    }
    /**
      * @author mcalderon
      * @param String $sport
      * @return array $groupId 
      * group in for sort live Props
      */
    public function getLSPropGroupsBySport($sport){
        $soapPreGame = $this->getService('liveProps');
        $res = $soapPreGame->getLSPropGroups(array("db"=>$this -> getLiveDatabase(),"sport"=>$sport));
        $array = json_decode($res->return,true);
        
        return new CakeResponse(array('body' => json_encode($array['results'])));
    }
    
    
    public function getGameScores(){
        $games=@$_POST["games"];
        $db=@$_POST["db"];
        $gameInfo="";
        foreach (explode(",", $games) as $game){
            $gameInfo.=$game.",";
        }
        $soapPreGame = $this->getService('pregameProps');
        $res = $soapPreGame->lsPregameScoresManteinance(array("db"=>$this ->getPregameDB($db, 'Read'),"gameNums"=>$gameInfo,"option"=>1));
        $array = json_decode($res->return,true);
        
        return new CakeResponse(array('body' => json_encode($array['results'])));
    }

    public function setGameScores(){
        $gameInfo=@$_POST["gamesInfo"];
        $db=@$_POST["db"];
        
        $soapPreGame = $this->getService('pregameProps');
        $res = $soapPreGame->lsPregameScoresManteinance(array("db"=>$this ->getPregameDB($db, 'Write'),"gameNums"=>$gameInfo,"option"=>2));
        $array = json_decode($res->return,true);
        
        return new CakeResponse(array('body' => json_encode($array['results'])));
    }
    


    /**
     * @author mcalderon
     * @param String $sp Action for Sp bet (A=action, C=No Action, RE=Reopen)
     * @param String $ml Action for ml bet (A=action, C=No Action, RE=Reopen)
     * @param String $tl Action for tl bet (A=action, C=No Action, RE=Reopen)
     * @param Date $df Daily Figure Date
     * @param String $team1 away Name
     * @param String $team2 Home Name
     * @param int $period period Number
     * @param String $periodname period Description
     * @param String $picher1 Home Pitcher Name for Basaball MLB only
     * @param String $picher2 Away Pitcher Name for Basaball MLB only
     * @param String $subSport SubSport Name
     * @param int $rot Rotation number Away
     * @param date $gameDate Game Date
     * @param int $scoreAway Total Score Away
     * @param int $pointsAway Points away for the current period
     * @param int $scoreHome Total Score Home
     * @param int $pointsHome Points Home for the current period
     * @param int $adjustlineaway away Ajusted Line for Baseball
     * @param int $adjustlinehome Home Ajusted Line for Baseball
     * @param String $comments 
     * 
     * @return null 
     */
    public function gradeindividualgame(){
        $sp=@$_POST['sp'];
        $ml=@$_POST['ml'];
        $tl=@$_POST['tl'];
        $df=@$_POST['df'];
        $team1=@$_POST['team1'];
        $team2=@$_POST['team2'];
        $period=@$_POST['period'];
        $periodname=@$_POST['periodname'];
        $picher1=@$_POST['pitcher1'];
        $picher2=@$_POST['pitcher2'];
        $subSport=@$_POST['subSport'];
        $rot=@$_POST['rot'];
        $gameDate=@$_POST['gameDate'];
        $scoreAway=@$_POST['scoreAway'];
        $pointsAway=@$_POST['pointsAway'];
        $scoreHome=@$_POST['scoreHome'];
        $pointsHome=@$_POST['pointsHome'];
        $adjustlineaway=@$_POST['adjustlineaway'];
        $adjustlinehome=@$_POST['adjustlinehome'];
        $comments=@$_POST['comments'];
        $winnerid;
        if($scoreAway>$scoreHome){
            $winnerid=$team1;
        }else if($scoreAway==$scoreHome){
            $winnerid="";
        }else{
            $winnerid=$team2;
        }
        
        $dateTime=  explode(" ", $gameDate); 
        $date=  explode("-", $dateTime[0]);
        $time=  explode(":", $dateTime[1]);
        
        if($df==""){
            $df=$date[1]."-".$date[2]."-".$date[0];
        }
        $dfArray=  explode("-", $df);
        
        $dfDate=date_parse_from_format("m-d-Y H:i", $dfArray[0]."-".$dfArray[1]."-".$dfArray[2] . " 00:00:00");
		$dfDate = mktime($dfDate['hour'], $dfDate['minute'], $dfDate['second'], 
			$dfDate['month'], $dfDate['day'], $dfDate['year']);
        $gameDateTime = date_parse_from_format("m-d-Y H:i", $date[1]."-".$date[2]."-".$date[0] . " " . $time[0].":".$time[1]);
		$gameDateTime = mktime($gameDateTime['hour'], $gameDateTime['minute'], $gameDateTime['second'], 
			$gameDateTime['month'], $gameDateTime['day'], $gameDateTime['year']);
                 
                CakeLog::write('debug','Grading data'. implode(",", array("db"=>$this->getEditDatabase(),
            "gamedate"=>$gameDateTime,
            "teamr1"=>$rot,
            "actiongrading"=>array($sp,$ml,$tl),
            "teamspts"=>array($team1,$pointsAway,$team2,$pointsHome),
            "period"=>$period,
            "daily"=>$dfDate,
            "periodname"=>$periodname,
            "picher1"=>null,
            "picher2"=>null,
            "deporte"=>$subSport,
            "winnerid"=>$winnerid,
            "adjustlineaway"=>$adjustlineaway,
            "adjustlinehome"=>$adjustlinehome,

            "comments"=>$comments)));
                
 $soapPreGame = $this->getService('gradingPreGamePropsService');
 $params=array("db"=>$this->getEditDatabase(),
            "gamedate"=>$gameDateTime,
            "teamr1"=>$rot,
            "actiongrading"=>array($sp,$ml,$tl),
            "teamspts"=>array($team1,$pointsAway,$team2,$pointsHome),
            "period"=>$period,
            "daily"=>$dfDate,
            "periodname"=>$periodname,
            "picher1"=>null,
            "picher2"=>null,
            "deporte"=>$subSport,
            "winnerid"=>$winnerid,
            "adjustlineaway"=>$adjustlineaway,
            "adjustlinehome"=>$adjustlinehome,
            "comments"=>$comments);
// print_r($params);die();
    	$result = $soapPreGame->getGradingmain($params);
        $res=json_decode($result->return, true);
        return new CakeResponse(array('body' => 'Success'));
    }
    
    
    public function getPregameBetInfo(){
        $contestNum=@$_POST["contestNum"];
        $db=@$_POST["db"];
        $soapPreGame = $this->getService('pregameProps');
        $result = $soapPreGame->getPregameBetInfo(array("db"=>$this->getPregameDB($db,"Read"),
            "contestNum"=>$contestNum));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    } 
    
    /**
     * @author mcalderon
     * @param int $gameID Game Number
     * @param int $periodID 
     */
    public function getgameinfo(){
        $gameID=@$_POST['gameId'];
        $periodID=@$_POST['period'];
        $store="Master";
        $soapPreGame = $this->getService('preLineService');
        $result = $soapPreGame->getGameLines(array("db"=>$this -> getLiveDatabase(), "gameNum" => $gameID, "periodNumber" => $periodID, "store" => $store, "sportType" => "",
		"sportSubType" => "", "scheduletext" => "", "date" => ""));
        $gameInfo=  json_decode($result->return,true);
        $gameDate=  explode("/",$gameInfo['results']['row1']['GameDate']);
        
        $gameTime=explode(":",$gameInfo['results']['row1']['GameTime']);
        $gameDateTime = date_parse_from_format("m-d-Y H:i", $gameDate[0]."-".$gameDate[1]."-".$gameDate[2] ." ".$gameTime[0] .":".$gameTime[1] );
		$gameDateTime = mktime($gameDateTime['hour'], $gameDateTime['minute'], $gameDateTime['second'], 
			$gameDateTime['month'], $gameDateTime['day'], $gameDateTime['year']);
                
        $soapPreGame2 = $this->getService('settingsService');
        $result2 = $soapPreGame2->getScoresGamesDetail(array("db"=>$this->getLiveDatabase(),
            "rotation"=>$gameInfo['results']['row1']['Team1RotNum'],
            "fecha"=>$gameDateTime));
        
        $res=json_decode($result2->return, true);
        
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
    
    /**
     * @author mcalderon
     * @param array $_POST (contestDescrip,contestants,contesttype,contesttype2,contesttype3,dailyFigure,points,ratio,status,contestNum,contestantNumbers,contestDate)
     * @return \CakeResponse
     */
    private function gradeProp($db,$cd,$contestants,$ct,$ct2,$ct3,$df,$points,$status,$contestNum,$contestantNum,$contestDate){
        $dateF= explode("-", $df);
        $dailyFigureDate = date_parse_from_format("m-d-Y H:i", $dateF[0]."-".$dateF[1]."-".$dateF[2] . "00:01:00");
		$dailyFigureDate = mktime($dailyFigureDate['hour'], $dailyFigureDate['minute'], $dailyFigureDate['second'], 
			$dailyFigureDate['month'], $dailyFigureDate['day'], $dailyFigureDate['year']);
        		               
                
                      CakeLog::write('debug','Grading data  '."db=>".$this ->getPregameDB($db,"Write").
            "propsdata=>".$ct."-".$ct2."-".$ct3."-".$cd.
            "contestanstatus=>".implode(",", $contestants).
            "status=>".$status.
            "points=>".$points.
            "daily=>".$dailyFigureDate.
            "racial=>1");
                $soapPreGame = $this->getService('gradingPreGamePropsService');
        
		$ct3 = str_replace('"','\'',$ct3);
		
		for($i = 0; $i < count($contestants); $i++){
			$contestants[$i] = str_replace('"','\'',$contestants[$i]);
		}
		
    	$result = $soapPreGame->getProspGrading(array("db"=>$this ->getPregameDB($db,"Write"),
            "propsdata"=>array($ct,$ct2,$ct3,$cd),
            "contestanstatus"=>$contestants,
            "status"=>$status,
            "points"=>$points,
            "daily"=>$dailyFigureDate,
            "racial"=>1,
            "propcontestnums"=>$contestNum."-".substr($contestantNum,0,-1)));
        
        CakeLog::write('debug','Grading data'. implode(",",array($this->getPregameDB($db,"Write"),
            "propsdata"=>$cd,
            "contestanstatus"=>$contestNum,
            "status"=>$status,
            "points"=>$points,
            "daily"=>"Daily: ".$dateF[0]."-".$dateF[1]."-".$dateF[2]."===Contest Date: ".$contestDate,
            "racial"=>1)));
        
        $res=  json_decode($result->return,true);
        return json_encode($res['results']);
    }
    
    
    
    public function getProspGrading(){
        $db=@$_POST["db"];
        $cd=@$_POST['cd'];
        $contestants=@$_POST['contestants'];
        $ct=@$_POST['ct'];
        $ct2=@$_POST['ct2'];
        $ct3=@$_POST['ct3'];
        $df=@$_POST['df'];
        $points=@$_POST['points'];
        $ratio=@$_POST['ratio'];
        $status=@$_POST['status'];
        $contestNum=@$_POST['contestNum'];
        $contestantNum=@$_POST['contestantNumbers'];
        $contestDate=@$_POST['contestDate'];
        $return=$this->gradeProp($db,$cd, $contestants, $ct, $ct2, $ct3, $df, $points,$status,$contestNum,$contestantNum,$contestDate);
        return new CakeResponse(array('body' => $return));
    }


    /**
     * @author mcalderon
     * 
     */
    public function getgradeinfo(){
        $rotNum=@$_POST['rotNum'];
        $gameDate=@$_POST['gameDate'];
        $periodNum=@$_POST['periodNum'];
        
        $gameDateTimeArray=explode(" ", $gameDate);
        $date=  explode("-", $gameDateTimeArray[0]);
        $time=  explode(":", $gameDateTimeArray[1]);
        $gameDateTime = date_parse_from_format("m-d-Y H:i", $date[1]."-".$date[2]."-".$date[0] . " ".$time[0].":".$time[1]);
		$gameDateTime = mktime($gameDateTime['hour'], $gameDateTime['minute'], $gameDateTime['second'], 
			$gameDateTime['month'], $gameDateTime['day'], $gameDateTime['year']);
        $soapPreGame = $this->getService('settingsService');
    	$result = $soapPreGame->getGradeData(array("db"=>$this->getLiveDatabase(),
            "rotation"=>$rotNum,
            "fecha"=>$gameDateTime,
            "period"=>$periodNum));
        
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
    
    /**
     * @author mcalderon
     * @param type $matchID
     * @return JSON {AwayTennis,GameAwayScore,Try,ScoreUpdateSystemTime,faceoffshome,PeriodNumber,ScoreAway,YardsHome,assthome,TimeoutsHome,GameDateTime,Possesion,
Seconds,Team2ID,ClockStopped,shootoutsaway,threepmahome,shootoutshome,ftmahome,SportType,RedCardsAway,Team1RotNum,UpdateSystemTime,Server,
HomeTennis,BroadcastInfo,Betstatus,penshome,MatchStatus,NumberOfDownsAway,pensaway,Yards,GlobalOff,AwayCorners,PeriodInPlay,DelayTime,faceoffsaway,
CorrelationID,AwayScore,ChallengesHome,RedCardsHome,GameNum,TimeMoveBy,asstaway,YardsAway,NumberOfDownsHome,ScoreMoveBy,HomeCorners,GlobalState,
TennisSetsCount,rebsaway,PeriodRemainingTime,ActivePeriod,threepmaaway,BetDelay,GameHomeScore,PeriodMoveBy,TimeoutsAway,IDGlobalM,HomeTeamImage,
HomeScore,State,rebshome,Position,ChallengesAway,AwayTeamImage,Team1ID,ChangeTimeStamp,ScoreHome,ftmaaway} for each period of the game
     */
    public function getlivegameinfo($gameNum){
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->getGameInfo(array("db"=>$this->getLiveDatabase(),
            "gameNum"=>$gameNum));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
    
    public function getLSPregamePropsByGameNum(){
        $gameNum=@$_POST["gameNum"];
        $db=$this->getPregameDB(@$_POST["db"], "Read");
        $soapPreGame = $this->getService('pregameProps');
        $result = $soapPreGame->getLSPregamePropsByGameNum(array("db"=>$db,
            "gameNum"=>$gameNum,
            "clearBetStatus"=>2));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
                /**
     * @param String $sport sport Type
     * @param date $dateFrom
     * @param int $company 1=Bet Radar any=Don Best
     * @return \CakeResponse
     */
    public function getGameNumsPregame(){
        $sport=@$_POST["sport"];
        $subSport=@$_POST["subSport"];
        $dateFrom=@$_POST["dateFrom"];
        $db=@$_POST["db"];
        
        $gameDateTimeArray=  explode(" ", $dateFrom);
        $date=  explode("-", $gameDateTimeArray[0]);
        $gameDateTime = date_parse_from_format("m-d-Y H:i", $date[0]."-".$date[1]."-".$date[2] . " 00:00");
		$gameDateTime = mktime($gameDateTime['hour'], $gameDateTime['minute'], $gameDateTime['second'], 
			$gameDateTime['month'], $gameDateTime['day'], $gameDateTime['year']);
        
        $soapPreGame = $this->getService('pregameProps');
        $result = $soapPreGame->getGameNumsPregame(array("db"=>$this->getPregameDB($db, "Read"),
            "sportType"=>$sport,
            "sportSubType"=>$subSport,
            "date"=>$gameDateTime));
        
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
    
    /**
     * @author mcalderon
     * @param type $sport
     * @return \CakeResponse
     */
    public function getPregamePeriodBySport(){
        $sport=@$_POST["sport"];
        $subSport=@$_POST["subsport"];
        $db=$this->getPregameDB(@$_POST["db"], "Read");
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->getPregamePeriodBySport(array("db"=>$db,
            "sportType"=>$sport,
            "sportSubType"=>$subSport));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
    
    public function getSubSports(){
        $sportid=@$_POST["sport"];
        $db=$this->getPregameDB(@$_POST["db"], "Read");
        $soapPreGame = $this->getService('preGameService');
        $result = $soapPreGame->getCategoriesBySport(array("db"=>$db,"sportType" =>array($sportid)));

        $return = json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($return["results"])));
    }

    /**
     * @author mcalderon
     * @return \CakeResponse
     */
    public function sendPeriodScore(){
        $gameNum=@$_POST["gameNum"];
        $awayScore=@$_POST["awayScore"];
        $homeScore=@$_POST["homeScore"];
        $periodID=@$_POST["periodID"];
        $option=@$_POST["option"];
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->setPeriodClose(array("db"=>$this->getLiveDatabase(),
            "gameNum"=>$gameNum,
            "awayScore"=>$awayScore,
            "homeScore"=>$homeScore,
            "periodID"=>$periodID,
            "option"=>$option));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
    
    
    public function massiveGrading(){
        $array=@$_POST["array"];
        foreach ($array as $prop) {
            $this->gradeProp($prop["cd"], 
                    explode("@", $prop["contestants"]), 
                    $prop["ct"], 
                    $prop["ct2"], 
                    $prop["ct3"], 
                    $prop["df"], 
                    "", 
                    $prop["status"], 
                    $prop["contestNum"], 
                    "", 
                    $prop["contestDate"]);
        }
        return new CakeResponse(array('body' => 1));
    }
    
    
    public function getPropGroups($gameNum){
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->getGroupsPerGame(array("db"=>$this->getLiveDatabase(),
            "gameNum"=>$gameNum));
        
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
}
