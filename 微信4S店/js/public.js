/*全局函数/全局变量*/

//mui默认包含变量名
var variableName = "__view_array__ __IDENTITY__ __uuid__ __callbacks__ __callback_id__ id  getMetrics onCallback addEventListener removeEventListener show close setStyle nativeInstanceObject hide setVisible isVisible setJsFile appendJsFile setContentVisible opener opened remove removeFromParent parent children getURL getTitle getStyle loadURL loadData stop reload draw back forward canBack canForward clear evalJS test append setPullToRefresh endPullToRefresh setBounce resetBounce setBlockNetworkImage captureSnapshot clearSnapshot";

//获取需要用到的页面ID
var winName = 'H5E7665A0 indexstart.html  indexhome.index.html    indexmy-order.html  indexuser.html  indexhongbao.html';


//设置公共方法
var publicVar = {}
	//网络设置
publicVar.NetworkDetection = function() {
	if (plus.networkinfo.getCurrentType() == 1) {
		console.log("网络连接失败");
		return false;
	} else {
		console.log("网络已连接");
		return true;
	}
}



//打开窗口方法
publicVar.openwinOne = function(url, id, styles, extras) {
	if (typeof(styles) == "undefined" || styles == "") {
		styles = {};
	}
	if (typeof(extras) == "undefined" || extras == "") {
		extras = {};
	}
	mui.openWindow({
		url: url, //页面URL
		id: id, //页面ID
		styles: styles, //自定义新页面样式如：顶部位置，底部位置，宽度，高度等
		extras: extras, //自定义扩展参数，可以用来处理页面间传值
		createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		show: {
			autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: "slide-in-right" //页面显示动画，默认为”slide-in-right“；
				//duration: animationTime //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		},
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '加载中...', //等待对话框上显示的提示内容
			options: {
				background: "rgba(0,0,0,0.5)"
			}
		}
	})
}
publicVar.openwinTwo = function(url, id) {
	console.log(url);
	mui.openWindow({
		url: url,
		id: id,
		styles: {
			top: "0px",
			bottom: "0px"
		},
		show: {
			autoShow: true,
			aniShow: 'none',
			duration: 0
		},
		waiting: {
			autoShow: false, //自动显示等待框，默认为true
			title: ''
		}
	});
};


//检测是否登录
publicVar.userLogin = function() {
	var user = localStorage.getItem("$user");
	if (user) {
		plus.nativeUI.toast("用户已登录");
	} else {
		plus.nativeUI.toast("用户未登录");
	}
}

//获取当前地址
publicVar.ObtainCity = function(obj) {
	var self = plus.webview.currentWebview();
	plus.geolocation.getCurrentPosition(function(Position) {
		console.log(JSON.stringify(Position))
		localStorage.setItem("$LocationAddress", JSON.stringify(Position));
		console.log("成功获取地址" + Position.address.city);
		cityName = Position.address.city;
		self.evalJS(obj);
	}, function() {
		plus.nativeUI.toast("定位失败,请检查手机定位是否开启！");
		cityName = "成都市";
		self.evalJS(obj);
	}, {
		provider: "baidu"
	});
}


publicVar.ajaxPost = function(data) {
	$.ajax({
		type: "post",
		url: Gobal.server_url + data.url,
		data: data.data,
		dataType: "json",
		timeout: 10000,
		success: function(result) {
			if (data.fun) {
				data.fun(result);
			}
			plus.nativeUI.closeWaiting();
		},
		error: function(error) {
			console.log(JSON.stringify(error));
			if (data.errorFun) {
				data.errorFun();
			} else {
				plus.nativeUI.toast("网络加载失败,请检查网络!");
			}
			plus.nativeUI.closeWaiting();
		}
	});
}

publicVar.ajaxGet = function(data) {
	console.log(Gobal.server_url + data.url);
	$.ajax({
		type: "get",
		url: Gobal.server_url + data.url,
		dataType: "json",
		timeout: 10000,
		success: function(result) {
			if (data.fun) {
				data.fun(result);
			}
			plus.nativeUI.closeWaiting();
		},
		error: function(error) {
			console.log(JSON.stringify(error));
			if (data.errorFun) {
				data.errorFun();
			} else {
				plus.nativeUI.toast("网络加载失败,请检查网络!");
			}
			plus.nativeUI.closeWaiting();
		}
	});
}

publicVar.down = function(id, data) {
	mui.init({
		pullRefresh: {
			container: "#" + id,
			down: {
				contentdown: "下拉可以刷新",
				contentover: "释放立即刷新",
				contentrefresh: "正在刷新...",
				callback: data
			}
		}
	});
}
publicVar.UpDown = function(data) {
	mui.init({
		pullRefresh: {
			container: "#" + id,
			down: {
				contentdown: "下拉可以刷新",
				contentover: "释放立即刷新",
				contentrefresh: "正在刷新...",
				callback: data.downFun
			},
			up: {
				contentrefresh: "正在加载...",
				contentnomore: '没有更多数据了',
				callback: data.upFun
			}
		}
	});
}


publicVar.template = function(templateId, domID, data) { //模板设置
	var html = template(templateId, data);
	document.getElementById(domID).innerHTML = html;
	return html;
}


publicVar.countdowntime = function(ParentId, timerName, fun) {
	var c = $("#" + ParentId);
	var f = c.find("[name=" + timerName + "]");
	f.off();
	f.each(function() {
		var m = $(this);
		var n = parseInt(m.attr("seconds"));
		var s = m.attr("id");
		console.log(s)
		if (n > 0) {
			var l = function() {
				fun(s)
			};
			m.countdowntime(n, l);
		} else {
			fun(s);
		}
	});
}


publicVar.GeneralJump=function(id,Wname){
	$(id).off();
	$(id).on("tap", function() {
		var extras = {
			url: url,
			wType: 'back',
			wName: "商品详情",
			id: $(this).attr("data-id"),
			sid: $(this).attr("data-sid"),
			qishu: $(this).attr("data-qishu")
		}
		publicVar.openwinOne("PublicHead.html", "Head" + url, "", extras);
	});
}

publicVar.shopDetailsId = function(url) {
	$("[name=shopDetailsId]").off();
	$("[name=shopDetailsId]").on("tap", function() {
		var extras = {
			url: url,
			wType: 'back',
			wName: "商品详情",
			id: $(this).attr("data-id"),
			sid: $(this).attr("data-sid"),
			qishu: $(this).attr("data-qishu")
		}
		publicVar.openwinOne("PublicHead.html", "Head" + url, "", extras);
	});
};