// 监听选中文本后的右键点击事件，并创建一个菜单项
chrome.contextMenus.create({
	title: "保存选中内容",
	contexts: ["selection"],
	onclick: function(info, tab) {
		// 将选中的文本发送给后台脚本处理
		chrome.runtime.sendMessage({action: "addContent", content: info.selectionText});
	}
});