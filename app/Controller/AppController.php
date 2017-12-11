<?php

/**
 * Application level Controller
 *
 * This file is application-wide controller file. You can put all
 * application-wide controller-related methods here.
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Controller
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
App::uses('Controller', 'Controller', 'Log');

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @package		app.Controller
 * @link		http://book.cakephp.org/2.0/en/controllers.html#the-app-controller
 */
class AppController extends Controller {

    /**
     * Function to get a service
     * 
     * @param String The name of the service that is going to be called
     * 
     * @return A soap client of the service 
     * 
     */
    public function beforeFilter() {
        // Short classname
        //$this->Session->write("selectedDB".Configure::read("session.id"),"LIVE"); //Recuperacion de variable de session
        $this->Session->write("databases", Configure::read('db.edit'));

        if ($this->Session->read("selectedDB") == null || $this->Session->read("selectedDB" . Configure::read("session.id")) == "") {
            $this->Session->write("selectedDB", "CASABLANCA_EURO");
        }
    }

    public function getService($serviceName) {
        try {
            ini_set('soap.wsdl_cache_enabled', 0);
            ini_set('soap.wsdl_cache_ttl', 0);

            $client = new SoapClient($this->getServiceName($serviceName), array('trace' => TRUE, 'cache_wsdl' => WSDL_CACHE_NONE));
            return $client;
        } catch (Exception $e) {
            echo $e->getMessage();
        }

        return null;
    }

    /**
     * Function to set the names and the urls of the services - This needs to be passed to a .ini
     * 
     * @param String The name of the service that is going to be called
     * 
     * @return The url of the service
     */
    private function getServiceName($serviceName) {
        return Configure::read('service.' . $serviceName);
    }

    public function getReadDatabase() {

        return $this->Session->read("selectedDB");
    }

    public function getEditDatabase() {
        return $this->Session->read("selectedDB");
    }

    public function getAllPregameDBs(){
        return Configure::read('db.pregame.all');
    }

    public function getMainPregameDB(){
        return Configure::read('db.pregame.main');
    }
    
    public function getPregameDB($selected,$type){
        if($type=="Read"){
            if($selected=="MASTER"){
                return Configure::read('db.pregame.main');
            }else{
                return $selected;
            }
        }else if($type=="Write"){
            if($selected=="MASTER"){
                return $this->getAllPregameDBs();
            }else{
                return $selected;
            }
        }
    }
    
    public function getLiveDatabase() {
        return Configure::read('db.live');
    }
}
