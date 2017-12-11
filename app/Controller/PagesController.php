<?php

App::uses('AppController', 'Controller');

/**
 * Static content controller
 *
 * Override this controller by placing a copy in controllers directory of an application
 *
 * @package       app.Controller
 * @link http://book.cakephp.org/2.0/en/controllers/pages-controller.html
 */
class PagesController extends AppController {

    public function home() {
        $this->tolobby();
    }
    
     /*
     * Authenticates the user
     * @returns json_response The json response with the login status. 
     */
    public function dointernallogin($user) {
        $this -> layout = "ajax";
        $soapPermission = $this -> getService('permissionService');
        $soapUser = $this -> getService('userService');
        $soapApplication = $this->getService('applicationService');
        $application = 'Lines Administrator';
        if (isset($user)) {
                $permissions = $soapPermission->getAccessPermissions(array("db" => "LOG", "appName" => $application, "user" => $user));
                $access = array();
                $accessArray = json_decode($permissions -> return, true);
                foreach ($accessArray['results'] as $row) {
                    $access[] = $row['PermissionAction'];
                }
                //Get the default lobby access
                $application = $soapApplication->getLobbyApp(array("db" => "LOG"));
                $applicationArray = json_decode($application->return, true);
                $lobby = @$applicationArray['results']['row1'];
                $userArray = $soapUser -> findUserByName(array("db" => "LOG", "userName" => $user));
                $userArray = json_decode($userArray -> return, true);
                $userArray = @$userArray['results']['row1'];
                $login = array("user" => $userArray,
                        "accessPermissions" => $accessArray['results'],
                        "lobby" => $lobby,
                        "access" => $access
                        );
                $this->Session->write("LOGIN_METADATA_USER", $login);
                
        }
        unset($_SESSION['username']);
        header("Location: /Grade/livegradels");
        die();
    }
    
    public function tolobby() {
        $soapApplication = $this->getService('applicationService');

        //Get the default lobby access
        $application = $soapApplication->getLobbyApp(array("db" => "LOG"));
        $applicationArray = json_decode($application->return, true);
        $lobby = @$applicationArray['results']['row1'];

        $url = $lobby['AppUrl'];

        header("Location: $url");
        die();
    }

}
