#  ListView
H5 ListView Component By Virtual DOM And No Need Set Item Height  
H5 ListView组件，支持超大数据列表流畅运行。子项无需指定高度  
GitHub Pages: https://github.com/fengshangbin/ListView
#  设计理念
不依赖第三方框架，也无不侵入，GZip后只有3KB，类似安卓原生ListView的使用方式。
#  特点及优势
1. 大数据列表（采用虚拟DOM防止大数据列表下手机内存不够）
2. 不定高子项（无需给子项设置指定高度）
3. 集成顶部上滑或底部下滑 Loading更多数据
4. 仿安卓原生ListView的使用方式，使用简单
#  如何使用
页面定义ListView容器
```
<div id="container"></div>
```
引入js文件
```
<script src="c3listview.js"></script>
```
定义一个数据源
```
var dataSource = [1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4];
var adapter = new C3ListView.adapter(dataSource);//参数为数组，可选 
```
定义子项html视图
```
adapter.getHtml = function(position){
    var data = adapter.getData(position);
    return "<div data-position=\""+position+"\">"+data+"</div>";
}
```
关联ListView容器
```
/*
    container: ListView子项的容器
    adapter: 数据源
    scrollParent: 滚动条所属容器，可选，默认为window
*/

var ct = document.getElementById("container");
var listView = new C3ListView.builder(ct, adapter);
```
这样就可以运行ListView了  
[示例](http://htmlpreview.github.io/?https://github.com/fengshangbin/ListView/blob/master/examples/list-scroll-window.html)  
示例二维码  
![示例二维码](https://raw.githubusercontent.com/fengshangbin/ListView/master/be1c35d704b66028c9660d97c4373d87.png)
# 更多功能
设置数据loading视图
```
<script type="text/x-template" id="template-loading">
	<svg viewBox="0 0 50 50" class="loading">
		<defs>
			<linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
				<stop offset="0%" stop-color="#000" stop-opacity="1.0" />
				<stop offset="90%" stop-color="#000" stop-opacity="0" />
			</linearGradient>
		</defs>
		<circle cx="25" cy="25" r="20" stroke-width="5" stroke="url(#linear)" fill="none" />
	</svg>
</script>

adapter.getLoadingHtml = function(){
	return document.getElementById("template-loading").innerHTML;
}
```
设置到底下滑添加数据
```
listView.addEventListener("touchbottom",function(e){ //顶部上滑对应touchtop
	console.log("touchbottom");
	window.setTimeout(function(){
		adapter.appendData([1,2,3,4]);
	},2000);
});
```
设置当前为最后一页
```
adapter.isLastPage = true; //第一页对应isFirstPage
```
设置/重置数据源
```
adapter.setData([1,2,3,4,1,2,3,4])
```
向前追加数据
```
adapter.preAppendData([1,2])
```
向后追加数据
```
adapter.appendData([1,2])
```
更新数据
```
/*
	data: 新数据
	position: 被更新子项的索引
*/

adapter.updateData(4,0)
```
更新子项视图
```
adapter.updateView(view) //触发重新计算view的高度
```
删除数据
```
adapter.removeData(0) //参数为被删除子项的索引
```
获取数据
```
adapter.getData(0) //参数为子项的索引
```
# 许可
MIT许可
