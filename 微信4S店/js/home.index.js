$(function() {
	$('.banner').unslider();
});

mui.plusReady(function() {
	$("#by").on("tap", function() {
		publicVar.openwinOne("write.message.html","write.message.html",{},{})
	});
	$("#bs").on("tap", function() {
		publicVar.openwinOne("upkeep.html","upkeep.html",{},{})
	});
	$("#hot").on("tap", function() {
		var appid=localStorage.getItem("$AppID");
		plus.webview.getWebviewById(appid).evalJS('Simulation("'+"activity.html"+'")');
	});
	$("#addus").on("tap", function() {
		publicVar.openwinOne("/html/join.html","html/join.html",{},{});
	});
	$("#city").on("tap", function() {
		publicVar.openwinOne("choose.city.html","choose.city.html",{},{})
	});
});