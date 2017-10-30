<?php
use Workerman\Worker;
use Workerman\Lib\Timer;
use \Workerman\Connection\AsyncTcpConnection;
require_once __DIR__ . '/workerman/Autoloader.php';
/*
	//使用方式：
	启动
	以debug（调试）方式启动 ：php xxx.php start
	以daemon（守护进程）方式启动 ：php xxx.php start -d
	停止 ：php xxx.php stop
	重启 ：php xxx.php restart
	平滑重启 ：php xxx.php reload
	查看状态 ：php xxx.php status
*/

define("WS_IP", "websocket://0.0.0.0:8000");
define("WORKER_COUNT", 1);
define("TIMEOUT_MINUTES", 12);
define("DEBUG", true);
define("LOG_FILENAME", "/tmp/workerman_ws.log");

/*
	结构：
	arrAllConn = array(
		'id_1' => array(
      'homeNo'           => '房间号1',
			'client'           => '客户端和ws服务端的链接句柄',
			'cli_last_time'    => 'ws最后一次和客户端通讯时间戳'
		),
		'id_2' => array(xxx)
		...
	)
*/
$arrAllConn = array();
/*
    结构：
    $arrHome = array(
        '房间号1' => array(
            'member' => array(id_1,id_2,id_3)
        ),
        '房间号2' => array(
            'member' => array(id_4,id_5,id_6)
        )
    );
*/
$arrHome = array();


// 创建一个Worker监听2346端口，使用websocket协议通讯
$ws_worker = new Worker(WS_IP);

// 启动4个进程对外提供服务
$ws_worker->count = WORKER_COUNT;
$ws_worker->onWorkerStart = function($ws_worker)
{
    // 只在id编号为0的进程上设置定时器，其它1、2、3号进程不设置定时器
    if($ws_worker->id === 0)
    {
        Timer::add(60, function(){
			global $arrAllConn;
			Logdog("---------------------[当前在线人数：".count($arrAllConn)."]-------------------->");
			foreach($arrAllConn as $key => $val){
				Logdog("当前id：".$key);
				$now = time();
				$server_last_time = $arrAllConn[$key]['server_last_time'];
				$cli_last_time = $arrAllConn[$key]['cli_last_time'];
				$server_now_diff = $now - $server_last_time;
				$cli_now_diff = $now - $cli_last_time;
				Logdog("ws->server时间间隔：".$server_now_diff);
				Logdog("ws->client时间间隔：".$cli_now_diff);
				if($server_now_diff>TIMEOUT_MINUTES*60 || $cli_now_diff>TIMEOUT_MINUTES*60){
					$connSer = $arrAllConn[$key]['server'];
					$connCli = $arrAllConn[$key]['client'];
					$connCli->close();
					$connSer->close();
				}

			}
            //print_r(array_keys($arrAllConn));
		   //print_r($arrAllConn);
        });
    }
};
// 从客户端来消息
$ws_worker->onMessage = function($connection, $data) use (&$arrAllConn)
{

	$conn_id = $connection->id;
	$worker_id = $connection->worker->id;
	$myId = $conn_id."_".$worker_id;
	Logdog("cli->ws id is:[".$myId."]");
	Logdog("收到来自client消息：".$data);

	$arrData = json_decode($data, true);

	if(isset($arrAllConn[$myId])){
		$arrAllConn[$myId]['cli_last_time'] = time();
	}
	if($arrData == null || !isset($arrData['act'])){
		$connection->send(json_encode(array('success'=>"0", "act"=>"errorcmd",'msg'=>'')));
		return;
	}
	switch($arrData['act']){
		case 'login':

			break;
		case 'heartcheck':
			//心跳检测
			$connection->send(json_encode(array('success'=>"1", "act"=>"heartcheck",'msg'=>'')));   //发送给客户端
			break;
		default:
			$connection->send(json_encode(array('success'=>"0", "act"=>"errorcmd",'msg'=>'')));     //其他指令包括控制指令不受理
			break;
	}

};

$fnCloseOrErr = function($connection) use (&$arrAllConn)
{
    Logdog("cli->ws connection closed");
	$conn_id = $connection->id;
	$worker_id = $connection->worker->id;
	$myId = $conn_id."_".$worker_id;
	Logdog("cli->ws close id is:[".$myId."]");
	if(isset($arrAllConn[$myId])){
		$connSer = $arrAllConn[$myId]['server'];
		$connSer->close();
		unset($arrAllConn[$myId]);
	}
};

$ws_worker->onClose = $fnCloseOrErr;
$ws_worker->onError = $fnCloseOrErr;

// 运行worker
Worker::runAll();

function Logdog($str = ''){
	$strLog = "[".date("Y-m-d H:i:s")."]".$str."\n";
	if(DEBUG){
		echo $strLog;
	}
	$logfile = fopen(LOG_FILENAME,"a+");
	if($logfile){
		fwrite($logfile, $strLog);
	}
	fclose($logfile);
}
?>
