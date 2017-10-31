<?php
		require_once __DIR__ . '/basemgr.class.php';
		class wsPvsl extends wsBaseMgr{
				private $map = array();

				public function __construct() {
						parent::__construct();
				}

				public function sendErrorCmd($id){
						if(isset($this->arrConn[$id]['connection'])){
								$this->arrConn[$id]['connection']->send(json_encode(array('success'=>"0", "act"=>"errorcmd",'msg'=>'')));
						}
				}

				public function dealClientMsg($myId, $data){
						$arrData = json_decode($data, true);
						if($arrData == null || !isset($arrData['act'])){
					      $this->sendErrorCmd($myId);
							  return;
						}
						switch($arrData['act']){
								case 'login':
									$this->login($myId, $arrData);
									break;
								case 'heartcheck':
									break;
								default:
									break;
						}
				}

				public function login($myId, $arrData){
						$objPvsl->setConn($myId, array(
								  'home'    => $arrData['home']
							)
						);
				}
		}
?>
