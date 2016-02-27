//mui初始化
mui.init({
	swipeBack: false,
	statusBarBackground: '#FFFFFF',
	gestureConfig: {
		doubletap: true
	}
}); //设置默认加载页面
var subpages = ['home.index.html', 'online.store.html', 'activity.html', 'user.html'];
var subpagesName = ['首页', '服务网点', '热门活动', '我'];
var subpage_style = {
	top: '0px',
	bottom: '50px'
};
var aniShow = {};
//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {
	console.log("当前页面URL：" + plus.webview.currentWebview().getURL());
	localStorage.setItem("$winName", winName + "  " + plus.webview.currentWebview().id)
	localStorage.setItem("$AppID", plus.webview.currentWebview().id);
	//读取本地存储，检查是否为首次启动
	var showGuide = plus.storage.getItem("lauchFlag");
	if (showGuide) {
		//有值，说明已经显示过了，无需显示；
		mui.openWindow({
			url: 'html/start.html',
			id: 'start.html',
			show: {
				aniShow: 'none'
			},
			waiting: {
				autoShow: false, //自动显示等待框，默认为true
				title: '', //等待对话框上显示的提示内容
			}
		});
		//延迟的原因：优先打开启动导航页面，避免资源争夺
		setTimeout(function() {
			//初始化模板
			loadWin(0);
		}, 200);
	} else {
		//		mui.openWindow({
		//			url: 'html/guide.html',
		//			id: 'guide.html',
		//			show: {
		//				aniShow: 'none'
		//			}
		//		});
		mui.openWindow({
			url: 'html/start.html',
			id: 'start.html',
			show: {
				aniShow: 'none'
			},
			waiting: {
				autoShow: false, //自动显示等待框，默认为true
				title: '', //等待对话框上显示的提示内容
			}
		});
		//延迟的原因：优先打开启动导航页面，避免资源争夺
		setTimeout(function() {
			//初始化模板
			loadWin(0);
		}, 200);
	}
	//首页返回键处理
	//处理逻辑：1秒内，连续两次按返回键，则退出应用；
	var first = null;
	mui.back = function() {
		//首次按键，提示‘再按一次退出应用’
		if (!first) {
			first = new Date().getTime();
			mui.toast('再按一次退出应用');
			setTimeout(function() {
				first = null;
			}, 1000)
		} else {
			if (new Date().getTime() - first < 1000) {
				plus.runtime.quit();
			}
		}
	};
	tableSwitch();
});



//底部导航切换方法
function tableSwitch() {
	var btnArry = new Array();
	btnArry[0] = true;
	//当前激活选项
	var activeTab = subpages[0];
	//导航点击事件
	mui('.bar-tab').on('tap', '.tab-item', function() {
		var targetTab = this.getAttribute('Address');
		console.log(targetTab + "  " + activeTab)
		if (targetTab == activeTab) {
			return;
		}
		$('.bar-tab .tab-item').removeClass("active");
		$(this).addClass("active");
		//判断是否加载页面
		if (btnArry[$(this).index()]) {
			if (targetTab == "index.index.html" || targetTab == "new_announce.html") {
				plus.webview.getWebviewById("index" + targetTab).evalJS("refreshWeb()");
			}
			showTable();
		} else {
			console.log("未加载");
			plus.nativeUI.showWaiting("加载中...", {
				background: "rgba(0,0,0,0.5)"
			});
			loadWin($(this).index());
			showTable();
			btnArry[$(this).index()] = true;
		}

		//显示目标选项卡
		function showTable() {
			if (mui.os.ios || aniShow[targetTab]) {
				plus.webview.show(targetTab);
			} else {
				var temp = {};
				temp[targetTab] = "true";
				console.log(targetTab)
				mui.extend(aniShow, temp);
				plus.webview.show(targetTab);
			}
			var targetView = plus.webview.getWebviewById(targetTab);
			//隐藏当前;
			plus.webview.hide(activeTab);
			//更改当前活跃的选项卡
			activeTab = targetTab;

		}
	});
	//自定义事件，模拟点击“首页选项卡”
	document.addEventListener('gohome', function() {
		var defaultTab = document.getElementById("defaultTab");
		//模拟首页点击
		mui.trigger(defaultTab, 'tap');
		//切换选项卡高亮
		var current = document.querySelector(".tab_b>.nav-item.mui-active");
		if (defaultTab !== current) {
			current.classList.remove('mui-active');
			defaultTab.classList.add('mui-active');
		}
	});
}

function loadWin(index) {
	var self = plus.webview.currentWebview();
	//var sub = plus.webview.create(subpages[index], subpages[index], subpage_style);
	subpage_extras = {
		Address: subpages[index],
		wName: subpagesName[index]
	}
	console.log("ID:" + subpages[index]);
	var sub = plus.webview.create("html/PublicHead.html", subpages[index], subpage_style, subpage_extras);
	self.append(sub);
	setTimeout(function() {
		plus.nativeUI.closeWaiting();
	}, 200);
}

function Simulation(id) {
	var domObj = document.getElementById(id);
	//模拟点击
	mui.trigger(domObj, 'tap');
}