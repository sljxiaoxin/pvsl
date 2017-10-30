<?
	$actions = array(
		"login" => array("act"=>"login","hNo"=>"XQ-1-1-101")
	);	
?>
<!DOCTYPE HTML>
<HTML>
 <HEAD>
  <TITLE> New Document </TITLE>
  <META NAME="Generator" CONTENT="EditPlus">
  <META NAME="Author" CONTENT="">
  <META NAME="Keywords" CONTENT="">
  <META NAME="Description" CONTENT="">
 </HEAD>

 <BODY>
  <SCRIPT LANGUAGE="JavaScript">
  <!--
	ws = new WebSocket("ws://10.190.100.3:33500");
	ws.onopen = function() {
		console.log("连接成功");
		ws.send('<?echo json_encode($actions["login"])?>');
	};
	ws.onmessage = function(e) {
		console.log("[收到服务端的消息]：" + e.data);
	};
	ws.onclose = function(e) {
		console.log("[连接关闭]：" + e.data);
	};
	setInterval(function(){
		ws.send('保持连接');
	}, 1000*20);
  //-->
  </SCRIPT>
 </BODY>
</HTML>
