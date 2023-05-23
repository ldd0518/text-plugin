// 监听插件图标被点击的事件
chrome.browserAction.onClicked.addListener(function(tab) {
	// 打开 popup.html 页面
	chrome.tabs.create({ url: chrome.extension.getURL('popup.html') });
});

// 监听来自 content.js 的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.action == "addContent") {
		// 将接收到的选中文本保存到本地存储
		var content = request.content.trim();
		if(content) {
			var savedContents = JSON.parse(localStorage.getItem("savedContents") || "[]");
			savedContents.push(content);
			localStorage.setItem("savedContents", JSON.stringify(savedContents));
		}
	}

	if(request.action == "getContents") {
		// 将保存的文本返回给 popup.html 页面
		var savedContents = JSON.parse(localStorage.getItem("savedContents") || "[]");
		sendResponse({contents: savedContents});
	}
});

// 监听 popup.html 页面加载完成事件
chrome.runtime.onConnect.addListener(function(port) {
	if(port.name == "popupLoaded") {
		port.onMessage.addListener(function(msg) {
			if(msg == "getContents") {
				// 发送消息请求获取保存的文本
				chrome.runtime.sendMessage({action: "getContents"}, function(response) {
					// 将保存的文本发送给 popup.html 页面
					port.postMessage({contents: response.contents});
				});
			}
		});
	}
});