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
class HistorialController extends AppController {

    public function index() {
    	
    }

    public function create() {
    	
    }
	
    public function delete() {
    	
    }
	
    public function edit() {
    	
    }
    public function ajaxcall() {
        $this->set('return', 2);
        $this->layout = "ajax";
    }
}
