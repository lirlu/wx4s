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