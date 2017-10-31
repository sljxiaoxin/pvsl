<?php
use Workerman\Worker;
use Workerman\Lib\Timer;
use \Workerman\Connection\AsyncTcpConnection;
//require_once __DIR__ . '/workerman/Autoloader.php';
require_once __DIR__ . '/workerman-for-win/Autoloader.php';
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

require_once __DIR__ . '/pvsl.class.php';

$objPvsl = new wsPvsl();
//$objPvsl->addConn('1_1', array('home'=>'17888'));
//var_dump($objPvsl);

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
      			global $objPvsl;
      			$objPvsl->checkConn();
        });
    }
};
// 从客户端来消息
$ws_worker->onMessage = function($connection, $data) use (&$objPvsl)
{
  //var_dump($data);
	$conn_id = $connection->id;
	$worker_id = $connection->worker->id;
	$myId = $conn_id."_".$worker_id;
	wsPvsl::log("cli->ws id is:[".$myId."]");
	wsPvsl::log("receive from client msg:".$data);

  $objPvsl->setConn($myId, array(
      'connection'    => $connection,
      'cli_last_time' => time()
    )
  );

  $objPvsl->dealClientMsg($myId, $data);

};

$fnCloseOrErr = function($connection) use (&$objPvsl)
{
    wsPvsl::log("cli->ws connection closed");
  	$conn_id = $connection->id;
  	$worker_id = $connection->worker->id;
  	$myId = $conn_id."_".$worker_id;
  	wsPvsl::log("cli->ws close id is:[".$myId."]");
    $objPvsl->unsetConn($myId);

};

$ws_worker->onClose = $fnCloseOrErr;
$ws_worker->onError = $fnCloseOrErr;

// 运行worker
Worker::runAll();

?>
