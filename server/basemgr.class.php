<?php
class wsBaseMgr {
		/*
			结构：
			$arrConn = array(
				'id_1' => array(
					'home'             => '房间号1',
					'connection'       => '客户端和ws服务端的链接句柄',
					'cli_last_time'    => 'ws最后一次和客户端通讯时间戳'
				),
				'id_2' => array(xxx)
				...
			)
		*/
		protected $arrConn = array();

		public function __construct() {
				 //TODO SOMETHING
		}
		/*
			检测连接健壮性
		*/
		public function checkConn(){
				self::log('-------------total conn:'.count($this->arrConn).'--------------------');
				foreach($this->arrConn as $key => $val){
					$now = time();
					$cli_last_time = $this->arrConn[$key]['cli_last_time'];
					$cli_now_diff = $now - $cli_last_time;
					if($cli_now_diff>TIMEOUT_MINUTES*60){
							$connCli = $this->arrConn[$key]['client'];
							$connCli->close();
					}
				}
				//print_r($this->arrHome);
		}

		/*
			增加或设置连接信息
		*/
		public function setConn($id, $arr = array()){
				if(!isset($this->arrConn[$id])){
						$this->arrConn[$id] = array();
				}
				foreach($arr as $key=>$val){
						$this->arrConn[$id][$key] = $val;
				}
		}

		/*
			连接断开，需要释放conn
		*/
		public function unsetConn($id){
				unset($this->arrConn[$id]);
		}

		/*
		通过id给指定客户端发送消息
		*/
		public function sendClientMsg($id, $oData){
				if(isset($this->arrConn[$id]['connection'])){
						$this->arrConn[$id]['connection']->send(json_encode($oData));
				}
		}

		/*
		log
		*/
		public static function log($str){
				$strLog = "[".date("Y-m-d H:i:s")."]".$str."\n";
				if(DEBUG){
					echo $strLog;
				}
				/*
				$logfile = fopen(LOG_FILENAME,"a+");
				if($logfile){
					fwrite($logfile, $strLog);
				}
				fclose($logfile);
				*/
		}




}
?>
