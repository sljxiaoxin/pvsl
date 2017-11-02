<?php
		require_once __DIR__ . '/basemgr.class.php';
		class wsPvsl extends wsBaseMgr{

				/*
						结构：
						$arrHome = array(
								'房间号1' => array(
										'member' => array(id_1,id_2,id_3),
										'info' => array(
												'id_1' => array(
														'name' => 'xxx',           //名称
														'sex' => '0',							 //性别
														'level' => 12,             //级别
														'conn' => true,            //连接状态
														'isCollocation' => false,  //托管状态
														'turnUsedTime' => 10,      //轮到他，并且已用秒数，轮到别人后要清零
												)
												....
										),
										'turn' => 'id_2',                  //当前轮到谁操作
										'currStep' => 'FP'                 //当前是游戏什么阶段，比如等待[WAIT]，发牌[FP]，叫dz[JDZ]，出牌[CP]，over[OVER]
								),
								'房间号2' => array(
										'member' => array(id_4,id_5,id_6)
								)
						);
				*/
				private $arrHome = array();
				private $arrCards = array('s3','h3','c3','d3','s4','h4','c4','d4','s5','h5','c5','d5','s6','h6','c6','d6','s7','h7','c7','d7','s8','h8','c8','d8','s9','h9','c9','d9','s10','h10','c10','d10','sJ','hJ','cJ','dJ','sQ','hQ','cQ','dQ','sK','hK','cK','dK','sA','hA','cA','dA','s2','h2','c2','d2','sjb','sjr');


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
								case 'heartcheck':
									$this->arrConn[$id]['connection']->send(json_encode(array("act"=>"heartcheck")));
									break;
								case 'login':
									$this->login($id, $arrData);
								default:
									$this->msDeal($id, $arrData);
									//$this->sendErrorCmd($id);
									break;
						}
				}

				public function login($id, $arrData){
						self::log("tag:pvsl->login:into login");
						$this->setConn($id, array(
								  'home' => $arrData['home']
							)
						);
						$this->onWAIT($arrData['home']);    //新创建房间，WAIT阶段
				}

				private function msDeal($id, $oData){
						self::log("tag:pvsl->msDeal:into msDeal");
						//根据阶段判断，应该调用哪个阶段处理函数
						$home = $this->arrConn[$id]['home'];
						$oData['home'] = $home;
						$step = $this->arrHome[$home]['currStep'];
						switch ($step) {
							case 'WAIT':
								$this->msDealWAIT($id, $oData);
								break;
							case 'FP':
								$this->msDealFP($id, $oData);
								break;
							case 'JDZ':
								$this->msDealJDZ($id, $oData);
								break;
							case 'CP':
								$this->msDealCP($id, $oData);
								break;
							case 'OVER':
								$this->msDealOVER($id, $oData);
								break;
							default:
								break;
						}
				}
				//WAIT阶段消息处理
				private function msDealWAIT($id, $oData){
						self::log("tag:pvsl->msDealWAIT:into msDealWAIT");
						if($oData['act'] == 'login'){
								$this->msDealWAIT_login($id, $oData);
						}
				}

				private function msDealWAIT_login($id, $oData){
						self::log("tag:pvsl->msDealWAIT_login:into msDealWAIT_login");
						//处理login动作
						$homeNo = $oData['home'];
						if(!in_array($id, $this->arrHome[$homeNo]['member'])){
								$this->arrHome[$homeNo]['member'][] = $id;
								/*
									//TODO 先去获取用户信息
									name sex level等
								*/
								$name = "xxx".rand(0,50);
								$sex  = 0;
								$level = 12;
								$this->arrHome[$homeNo]['info'][$id] = array(
										'name' => $name,           //名称
										'sex' => $sex,						 //性别
										'level' => $level,         //级别
										'conn' => true,            //连接状态
										'isCollocation' => false,  //托管状态
										'turnUsedTime' => 0      //轮到他，并且已用秒数，轮到别人后要清零
								);
						}
						$arrHomeMember = $this->arrHome[$homeNo]['member'];
						$idx = array_search($id, $arrHomeMember);  //防异步竞争
						if($idx >2){
								$this->sendClientMsg($id, array('act'=>'loginerror','msg'=>'homeFilled'));
						}else{
								$this->sendClientMsg($id, array('act'=>'loginok','id'=>$id, 'info'=>$this->getMemberInfo($homeNo, $id)));  //登录成功，返回id给客户端
								if($idx == 1){
										//第二个登录，需要告诉他（他的上家），告诉第一个（他的下家）
										$this->sendClientMsg($id, array('act'=>'leftId','id'=>$arrHomeMember[0], 'info'=>$this->getMemberInfo($homeNo, $arrHomeMember[0])));
										$this->sendClientMsg($arrHomeMember[0], array('act'=>'rightId','id'=>$id, 'info'=>$this->getMemberInfo($homeNo, $id)));
								}
								if($idx == 2){
										//第三个登录
										$this->sendClientMsg($id, array('act'=>'leftId','id'=>$arrHomeMember[1], 'info'=>$this->getMemberInfo($homeNo, $arrHomeMember[1])));
										$this->sendClientMsg($id, array('act'=>'rightId','id'=>$arrHomeMember[0], 'info'=>$this->getMemberInfo($homeNo, $arrHomeMember[0])));
										$this->sendClientMsg($arrHomeMember[0], array('act'=>'leftId','id'=>$id, 'info'=>$this->getMemberInfo($homeNo, $id)));
										$this->sendClientMsg($arrHomeMember[1], array('act'=>'rightId','id'=>$id, 'info'=>$this->getMemberInfo($homeNo, $id)));
										//等待完成，开始下一阶段
										$this->onFP($homeNo);
								}
						}

				}

				//FP阶段消息处理
				private function msDealFP($id, $oData){

				}

				//JDZ阶段消息处理
				private function msDealJDZ($id, $oData){

				}

				//CP阶段消息处理
				private function msDealCP($id, $oData){

				}

				//Over阶段消息处理
				private function msDealOVER($id, $oData){

				}

				public function onWAIT($home){
						if(!isset($this->arrHome[$home])){
								$this->arrHome[$home] = array(
										'member' => array(),
										'info' => array(),
										'turn' => '',
										'currStep' => 'WAIT'
								);
						}
				}

				public function onFP($home){
						$this->arrHome[$home]['currStep'] = 'FP';
						$arrFpCards = $this->arrCards;
						$arrCardsMap = array(array(),array(),array());
						$arrCardsHide = array();
						for($i=0;$i<3;$i++){
								$randCards = array_rand($arrFpCards, 17);
								for($j=0;$j<17;$j++){
										$arrCardsMap[$i][]= $this->arrCards[$randCards[$j]];
								}
								$arrFpCards = array_diff($arrFpCards, $arrCardsMap[$i]);
								$arrCardsMap[$i] = array_reverse($arrCardsMap[$i]);
						}
						$arrCardsHide = array_merge($arrFpCards,array());
						print_r($arrCardsMap);
						print_r($arrCardsHide);
						//print_r($this->arrCards);
						$arrMember = $this->arrHome[$home]['member'];
						for($i=0;$i<3;$i++){
								$this->sendClientMsg($arrMember[$i], array('act'=>'fp','cards'=>$arrCardsMap[$i], 'hideCards'=>$arrCardsHide));
						}
				}

				public function onJDZ($home){

				}

				public function onCP($home){

				}

				public function onOVER($home){

				}

				public function getMemberInfo($home, $id){
						$info = $this->arrHome[$home]['info'][$id];
						return array(
								'name' => $info['name'],           //名称
								'sex' => $info['sex'],						 //性别
								'level' => $info['level']         //级别
						);
				}

				public function sendErrorCmd($id){
						$this->sendClientMsg($id, array("act"=>"error",'msg'=>'nocmdhandler or not json'));
				}
		}
?>
