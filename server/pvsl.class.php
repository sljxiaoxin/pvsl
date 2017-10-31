<?php
		require_once __DIR__ . '/basemgr.class.php';
		class wsPvsl extends wsBaseMgr{
				private $map = array();

				public function __construct() {
						parent::__construct();
				}
				
				public function dealClientMsg($id, $data){
						$arrData = json_decode($data, true);
						if($arrData == null || !isset($arrData['act'])){
					      $this->sendErrorCmd($id);
							  return;
						}
						switch($arrData['act']){
								case 'login':
									$this->login($id, $arrData);
									break;
								case 'heartcheck':
									$this->arrConn[$id]['connection']->send(json_encode(array("act"=>"heartcheck")));
									break;
								default:
									$this->sendErrorCmd($id);
									break;
						}
				}

				public function login($id, $arrData){
						$this->setConn($id, array(
								  'home' => $arrData['home']
							)
						);
						$this->addHome($arrData['home'], $id);
				}

				public function sendErrorCmd($id){
						if(isset($this->arrConn[$id]['connection'])){
								$this->arrConn[$id]['connection']->send(json_encode(array("act"=>"error",'msg'=>'nocmdhandler or not json')));
						}
				}
		}
?>
