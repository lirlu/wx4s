$(function() {
	$(window).resize(function() {
		windowChange();
	})
	function windowChange() {
		var myDataL = $(".input-div").length;
		var winWidth = $(window).width();
		var lDiv = "";
		for (i = 0; i < myDataL; i++) {
			lDiv = $(".input-div").eq(i).children(".l_f").width() + 15;
			$(".input-div").eq(i).children(".r_f").width(winWidth - lDiv);
		}
	}
	windowChange();
	
	$(".btn").on("tap",function(){
		plus.nativeUI.toast("申请已提交,请等待审核。");
		plus.webview.currentWebview().close();
	});
	
});