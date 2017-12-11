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
class GradeController extends AppController {
    /**
     * @author mcalderon
     * @return array Sports
     */
    public function index() {
        $soapPreGame = $this->getService('preGameService');
    	$result = $soapPreGame->getScheduleSports(array("db"=>$this -> getLiveDatabase()));
        $sports = json_decode($result->return, true);

        $this->set('sports', $sports['results']);
    }
    /**
     * 
     * @author mcalderon
     * @return array Sports
     */
    public function livegrade(){
        $soapPreGame = $this->getService('preGameService');
    	$result = $soapPreGame->getScheduleSports(array("db"=>$this -> getLiveDatabase()));
        $sports = json_decode($result->return, true);
        
        $this->set('sports', $sports['results']);
    }
    /**
     * 
     * @author mcalderon
     * @return array Sports
     */
    public function livegradedb(){
        $soapPreGame = $this->getService('preGameService');
    	$result = $soapPreGame->getScheduleSports(array("db"=>$this -> getLiveDatabase()));
        $sports = json_decode($result->return, true);
        
        $this->set('sports', $sports['results']);
    }
    /**
     * 
     * @author mcalderon
     * @return array Sports
     */
    public function livegradels(){
        $user=$this->Session->read("LOGIN_METADATA_USER.user.UserName");
        if(!isset($user)||($user==null&&$user=="")){
            header("Location: http://lobby.bminc.eu/index.php/pages/login");
            exit();
        }else{
            $soapPreGame = $this->getService('preGameService');
            $result = $soapPreGame->getScheduleSports(array("db"=>$this -> getLiveDatabase()));
            $sports = json_decode($result->return, true);
            $this->set('sports', $sports['results']);
        }
    }
    
    public function manualplaylist(){
        
    }
    
    public function gamecontest(){
        
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
    
    /**
      * @author mcalderon
      * @param String $sport
      * @return array $groupId 
      * group in for sort live Props
      */
    public function getPropGroupsBySport($sport){
        $soapPreGame = $this->getService('liveProps');
        $res = $soapPreGame->getPropGroups(array("db"=>$this -> getLiveDatabase(),"sport"=>$sport));
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
        $user=$this->Session->read("LOGIN_METADATA_USER.user.UserName");
        if(!isset($user)||($user==null&&$user=="")){
            return new CakeResponse(array('body' => 'Session Expired, please go to log in page'));
        }else{
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

            $dfDate=$dfArray[2]."-".$dfArray[0]."-".$dfArray[1] . " 00:00:00";

            $gameDateTime = $date[0]."-".$date[1]."-".$date[2] . " " . $time[0].":".$time[1];

            CakeLog::write('debug','Grading data'. implode(",", array("db"=>$this->getLiveDatabase(),
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
                "requestedBy"=>$user,
                "comments"=>$comments)));

     $soapPreGame = $this->getService('gradingService');
     $params=array("db"=>$this->getLiveDatabase(),
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
                "comments"=>$comments,
                "requestedBy"=>$user);
            $result = $soapPreGame->getGradingmain($params);
            $res=json_decode($result->return, true);
            return new CakeResponse(array('body' => 'Success'));
        }
    }
    
    
    /**
     * @author mcalderon
     * @param String $sport
     * @param String $league Sub Sport
     * @return array All period to grade for the current sport
     */
    public function getorderedperiods(){
        $sport=@$_POST['sport'];
        $league=@$_POST['subSport'];
        $soapPreGame = $this->getService('preGameService');
        $results=$soapPreGame->getPeriodsBySubSportType(array("db"=>$this ->getLiveDatabase(),"sportType" => $sport, "sportSubType" =>$league));
        
        $array=  json_decode($results->return,true);
        $array2=array();
        foreach ($array['results'] as $element){
            $array2[]=$element;
        }
        $orderArray;
        if(trim($league)=="NHL"){
            $orderArray=array(1,2,3,0);
        }else{
            $orderArray=array(3,4,1,5,6,2,0);
        }
        $orderedArray=array();
        foreach ($orderArray as $num){
            if(isset($array2[$num]))
                $orderedArray[]=$array2[$num];
            
        }
        
        return new CakeResponse(array('body' => json_encode($orderedArray)));
    }
    
    /**
     * @author mcalderon
     * @param String $sportType
     * @param String $subSportType
     * @param Date $dateFrom
     * @param String $active Get just not graded games or All games
     * 
     * @return Array (Team2Score,PeriodDescription,PeriodNumber,Team1RotNum,GameNum,ListedPitcher2,
     * ListedPitcher1,GameDateTime,Team2RotNum",Team2ID,WinnerID,Team1ID,Team1Score)
     */
    public function getgamesforgrade(){
        $sportType = @$_POST['sport'];
        $subSportType = @$_POST['subsport'];
        $dateFrom = @$_POST['gameDate'];
        $active = @$_POST['active'];
        $all;
        if($subSportType==1){
            $subSportType="";
            $all=1;
        }else{
            $all=0;
        }
        
        
        if($active==""){
            $active="";
        }
        
        $dateF= explode("-", $dateFrom);
        
        
        $gameDateTimeFrom = date_parse_from_format("m-d-Y H:i", $dateF[0]."-".$dateF[1]."-".$dateF[2] . "00:01:00");
		$gameDateTimeFrom = mktime($gameDateTimeFrom['hour'], $gameDateTimeFrom['minute'], $gameDateTimeFrom['second'], 
			$gameDateTimeFrom['month'], $gameDateTimeFrom['day'], $gameDateTimeFrom['year']);
        $gameDateTimeTo = date_parse_from_format("m-d-Y H:i", $dateF[0]."-".$dateF[1]."-".$dateF[2] . " 23:59:59");
		$gameDateTimeTo = mktime($gameDateTimeTo['hour'], $gameDateTimeTo['minute'], $gameDateTimeTo['second'], 
			$gameDateTimeTo['month'], $gameDateTimeTo['day'], $gameDateTimeTo['year']);
        $soapPreGame = $this->getService('settingsService');
    	$result = $soapPreGame->getScoresGames(array("db"=>$this->getLiveDatabase(),
            "inicio"=>$gameDateTimeFrom,
            "fin"=>$gameDateTimeTo,
            "sport"=>$sportType,
            "subsport"=>$subSportType,
            "active"=>$active,
            "all"=>$all));
        
        
        $res=json_decode($result->return, true);
        
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
    private function gradeProp($cd,$contestants,$ct,$ct2,$ct3,$df,$points,$status,$contestNum,$contestantNum,$contestDate){
        $user=$this->Session->read("LOGIN_METADATA_USER.user.UserName");
        if(!isset($user)||($user==null&&$user=="")){
            return 'Session Expired, please go to log in page';
        }else{
            $dateF= explode("-", $df);
            $dailyFigureDate = $dateF[2]."-".$dateF[0]."-".$dateF[1];
            $soapPreGame = $this->getService('gradingService');
            $ct3 = str_replace('"','\'',$ct3);
            for($i = 0; $i < count($contestants); $i++){
                $contestants[$i] = str_replace('"','\'',$contestants[$i]);
            }
            $result = $soapPreGame->getProspGrading(array("db"=>$this->getLiveDatabase(),
                "propsdata"=>array($ct,$ct2,$ct3,$cd),
                "contestanstatus"=>$contestants,
                "status"=>$status,
                "points"=>$points,
                "daily"=>$dailyFigureDate,
                "racial"=>1,
                "propcontestnums"=>$contestNum."-".substr($contestantNum,0,-1),
                "requestedBy"=>$user));
            CakeLog::write('debug','Grading data'. implode(",",array("db"=>$this->getLiveDatabase(),
                "propsdata"=>$cd,
                "contestanstatus"=>$contestNum,
                "status"=>$status,
                "points"=>$points,
                "daily"=>$dailyFigureDate,
                "racial"=>1,
                "requestedBy"=>$user)));

            $res=  json_decode($result->return,true);
            return 1;
        }
    }
    
    
    
    public function getProspGrading(){
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
        $return=$this->gradeProp($cd, $contestants, $ct, $ct2, $ct3, $df, $points,$status,$contestNum,$contestantNum,$contestDate);
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
    
    /**
     * @author mcalderon
     * @param int $matchID 
     * @param int $clearBetStatus 1=All Props 0= Just not Graded
     * @return JSON (ContestType3,ContestType2,ContestDesc,ContestantOrder,CorrelationID,ContestType,ContestantName,Specialoddsvalue,MoneyLine,ThresholdUnits,
StatusBy,Score,WagerCutoff,ThresholdLine,ToBase,CategoryName,Outcome,GroupID,ContestantNum,OddType,Numerator,DecimalOdds,Denominator,OddID,
SubTypeID,ContestDateTime,PropStatus,ThresholdType,PropPosition,ClearBetStatus,SpecialValueOrder,MatchID,ContestNum) for each prop
     */
    public function getLiveProps(){
    	$matchID=@$_POST["matchID"];
        $clearBetStatus=@$_POST["clearBetStatus"];
        
                     $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->clearNoBetProps(array("db"=>$this->getLiveDatabase(),
            "gameNum"=>$matchID,
            "option"=>1));
        
        
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->getPropsByGameNum(array("db"=>$this->getLiveDatabase(),
            "matchId"=>$matchID,
            "clearBetStatus"=>$clearBetStatus));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
		
        /*$matchID=@$_POST["matchID"];
        $clearBetStatus=@$_POST["clearBetStatus"];
        $result = $soapPreGame->getPropsByGameNum(array("db"=>$this->getReadDatabase(),
            "matchId"=>$matchID,
            "clearBetStatus"=>$clearBetStatus));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));*/
    }
    /**
     * @author mcalderon
     * @param int $gameNum 
     * @param int $clearBetStatus 1=All Props 0= Only not Graded
     * @return JSON (ContestType3,ContestType2,ContestDesc,ContestantOrder,CorrelationID,ContestType,ContestantName,Specialoddsvalue,MoneyLine,ThresholdUnits,
                StatusBy,Score,WagerCutoff,ThresholdLine,ToBase,CategoryName,Outcome,GroupID,ContestantNum,OddType,Numerator,DecimalOdds,Denominator,OddID,
                SubTypeID,ContestDateTime,PropStatus,ThresholdType,PropPosition,ClearBetStatus,SpecialValueOrder,MatchID,ContestNum) for each prop
     */
    public function getLiveDBProps(){
        $gameNum=@$_POST["gameNum"];
        $clearBetStatus=@$_POST["clearBetStatus"];
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->getDBPropsByGameNum(array("db"=>$this->getLiveDatabase(),
            "gameNum"=>$gameNum,
            "clearBetStatus"=>null));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
    /**
     * @author mcalderon
     * @param int $gameNum 
     * @param int $clearBetStatus 1=All Props 0= Only not Graded
     * @return JSON (ContestType3,ContestType2,ContestDesc,ContestantOrder,CorrelationID,ContestType,ContestantName,Specialoddsvalue,MoneyLine,ThresholdUnits,
                StatusBy,Score,WagerCutoff,ThresholdLine,ToBase,CategoryName,Outcome,GroupID,ContestantNum,OddType,Numerator,DecimalOdds,Denominator,OddID,
                SubTypeID,ContestDateTime,PropStatus,ThresholdType,PropPosition,ClearBetStatus,SpecialValueOrder,MatchID,ContestNum) for each prop
     */
    public function getLiveLSProps(){
        $gameNum=@$_POST["gameNum"];
        $clearBetStatus=@$_POST["clearBetStatus"];
        $period=@$_POST["period"];
        $group=@$_POST["group"];
        
        if($group=="all"){
            $period="";
            $group="";
        }
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->getLSPropsByGameNum(array("db"=>$this->getLiveDatabase(),
            "gameNum"=>$gameNum,
            "clearBetStatus"=>$clearBetStatus,
            "GroupID"=>$group,
            "PeriodNum"=>$period));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
    
    public function gradestatus(){
        $soapPreGame = $this->getService('preGameService');
    	$result = $soapPreGame->getScheduleSports(array("db"=>$this -> getLiveDatabase()));
        $sports = json_decode($result->return, true);

        $this->set('sports', $sports['results']);
    }
    
    
    public function getlGradingStatus(){
        $gameDate=@$_POST["gameDate"];
        $rot=@$_POST["rot"];
        $gameDateTimeArray=  explode(" ", $gameDate);
        $date=  explode("-", $gameDateTimeArray[0]);
        $gameDateTime = date_parse_from_format("m-d-Y H:i", $date[0]."-".$date[1]."-".$date[2] . " 00:00");
		$gameDateTime = mktime($gameDateTime['hour'], $gameDateTime['minute'], $gameDateTime['second'], 
			$gameDateTime['month'], $gameDateTime['day'], $gameDateTime['year']);
        
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->getlGradingStatus(array("db"=>$this -> getLiveDatabase(),
            "rot"=>$rot,
            "gamedate"=>$gameDateTime));
        
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
    
    public function clearNoBetProps($gamenNum){
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->clearNoBetProps(array("db"=>$this->getLiveDatabase(),
            "gameNum"=>$gamenNum));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }   
    
    public function checkPendingProps($gamenNum){
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->setArchivecontest(array("db"=>$this->getLiveDatabase(),
            "gameNum"=>$gamenNum));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    } 
    /**
     * @param String $sport sport Type
     * @param date $dateFrom
     * @param int $company 1=Bet Radar any=Don Best
     * @return \CakeResponse
     */
    public function getGameNumsByCompany(){
        $sport=@$_POST["sport"];
        $dateFrom=@$_POST["dateFrom"];
        $company=@$_POST["company"];
        
        $gameDateTimeArray=  explode(" ", $dateFrom);
        $date=  explode("-", $gameDateTimeArray[0]);
        $gameDateTime = date_parse_from_format("m-d-Y H:i", $date[0]."-".$date[1]."-".$date[2] . " 00:00");
		$gameDateTime = mktime($gameDateTime['hour'], $gameDateTime['minute'], $gameDateTime['second'], 
			$gameDateTime['month'], $gameDateTime['day'], $gameDateTime['year']);
        
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->getGameNumsByCompany(array("db"=>$this->getLiveDatabase(),
            "sportType"=>$sport,
            "date"=>$gameDateTime,
            "company"=>$company));
        
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
    
    /**
     * @author mcalderon
     * @param type $sport
     * @return \CakeResponse
     */
    public function getDBPeriodBySport($sport){
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->getDBPeriodBySport(array("db"=>$this->getLiveDatabase(),
            "sportType"=>$sport));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
    
    
    /**
     * @author mcalderon
     * @param type $gameNum
     * @return \CakeResponse
     */
    public function getDBscoreByGameNum($gameNum){
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->getDBscoreByGameNum(array("db"=>$this->getLiveDatabase(),
            "gameNum"=>$gameNum));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
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
    
    public function getBetInfo(){
        $contestNum=@$_POST["contestNum"];
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->getBetInfo(array("db"=>$this->getLiveDatabase(),
            "contestNum"=>$contestNum));
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
    
    
    public function massiveGrading(){
        $user=$this->Session->read("LOGIN_METADATA_USER.user.UserName");
        if(!isset($user)||($user==null&&$user=="")){
            return new CakeResponse(array('body' => 'Session Expired, please go to log in page'));
        }else{
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
    }
    
    
    public function getPropGroups($gameNum){
        $soapPreGame = $this->getService('liveProps');
        $result = $soapPreGame->getGroupsPerGame(array("db"=>$this->getLiveDatabase(),
            "gameNum"=>$gameNum));
        
        $res=  json_decode($result->return,true);
        return new CakeResponse(array('body' => json_encode($res['results'])));
    }
}
