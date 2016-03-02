var app = window.app = window.lirlu = {};
app.esced = new Date();
app.pages = [];
app.link = {
	server_url    : 'http://miaogou.lirlu.com/?/',
	server_url_on : 'http://miaogou.lirlu.com',
	image_url     : 'http://miaogou.lirlu.com/statics/uploads',
	share         : 'http://miaogou.lirlu.com/wx/index.html'
}
app.log = function () {
	console.log(arguments);
}
// 检测网络连接是否正常
app.isNetwordReady = function () {
	return plus.networkinfo.getCurrentType() == 1;
};
/**
 * 显示3.5秒的toast错误提示信息
 * @param {String} 提示字符串
 */
app.error = function (text) {
	plus.nativeUI.toast(text, {'duration':'long'});
};
/**
 * 获取当前地址
 * @param {Function} 回调方法，如果获取失败会返回一个默认的地址
 * @return {Object} 地址信息。JSON对象 
 */
app.locate = function (cb) {
	var view = plus.webview.currentWebview();
	plus.geolocation.getCurrentPosition(
		function (res) {
			localStorage.setItem("$LocationAddress", JSON.stringify(res));
			if (cb) cb(res);
		}, 
		function () {
			plus.nativeUI.toast('定位失败,请检查手机定位是否开启！');
			if (cb) cb({'address':{'city':'北京市'}});
		}, 
		{ provider : 'baidu' }
	);
}
/**
 * 取得ArtTemplate并填充数据再把数据放于直接dom下。已做try catch处理
 * @param {Object} 用于放置构造出来的tpl代码的容器，可是jquery对象也可以是jquery的选择表达式
 * @return {String} 模板ID
 * @return {Object} 数据
 */
app.tpl = function (dom, tpl, data) {
	if (undefined !== data) {
		try { $(dom).html(template(tpl, data)); } catch (e) { app.log(e); };	
	} else if (undefined !== tpl) {
		return template(dom, tpl);
	}
};
/**
 * 补全URL地址
 * @param {String} API的URL后半段
 */
app.u = function (link) {
	return app.link.server_url + link;
}
app.preload = function (link, data) {
	data = data || {};
	app.pages.push(link);
	// 作用域是公用的
	return mui.preload({
		url    : 'html/shared.html',
		id     : data.id || link,
		styles : {top:'0px', bottom:'45px'},
		extras : {extras:mui.extend({_FROM_:plus.webview.currentWebview().id, url:link}, data)},
	});
};
app.load = function (link, data) {
	var view = plus.webview.currentWebview();
	var sub = plus.webview.create(link, data.id || link, {bottom:'45px',top:'45px'}, data);
	view.append(sub);
	
	setTimeout(function() { plus.nativeUI.closeWaiting(); }, 200);
};
app.open = function (link, data) {
	data = data || {};
	app.pages.push(link);
	
	mui.openWindow({
	    url       : '../html/shared.html',
	    id        : data.id || link,
	    extras    : {extras:mui.extend({_FROM_:plus.webview.currentWebview().id, url:link}, data)},
	    createNew : false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
	    waiting   : {
	    	autoShow : true,//自动显示等待框，默认为true
	    	title    : '正在加载...',//等待对话框上显示的提示内容
	    }
	})
};



var appJs = {};
//首页方法
appJs.home = function() {
	var homeFun = {};
	homeFun.load = function() { //加载数据方法
		var data = {
			url: "mobile/ajax/index/" + "&time=" + new Date().getTime(),
			errorFun: function(res) {
				console.log("接口错误");
			},
			fun: function(res) {
				console.log(JSON.stringify(res));
				publicVar.template("slider-tpl", "slider", res);//加载最新揭晓
				publicVar.template("recommend-tpl", "recommend", res);//加载人气推荐
				var gallery = mui('.mui-slider');
				gallery.slider({
					interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
				});
				publicVar.shopDetailsId();//跳转到商品详情
			}
		}
		publicVar.ajaxGet(data);
		homeFun.loadAnnounced();
	}
	homeFun.loadAnnounced = function() { //加载最新揭晓方法
		var data = {
			url: "mobile/ajax/GetStartRaffleAllList/" + "&time=" + new Date().getTime(),
			errorFun: function(res) {
				console.log("接口错误");
			},
			fun: function(res) {
				publicVar.template("lotter-tpl", "NewAnnounced", res);
				var l = function(id) {
					$("#lotter-time-" + id).html("正在计算...");
					var data={
						url:"mobile/ajax/GetBarcodernoInfo/" + id,
						fun:function(res){
							$("#lotter-time-" + id).html("恭喜<span>" + res.q_user + "<span>获得");
						}
					}
					publicVar.ajaxGet(data);
				};
				publicVar.countdowntime("NewAnnounced", "timerItem", l);
			}
		}
		publicVar.ajaxGet(data);
	}
	homeFun.downFun = function() {
		homeFun.load(); //加载数据
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	}
	publicVar.down("pullrefresh", homeFun.downFun); //设置下拉刷新
	homeFun.load(); //初始加载数据
}