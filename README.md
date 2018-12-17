# ListView
<p>H5 ListView Component By Virtual DOM</p>
<p>H5 ListView组件，支持超大数据列表流畅运行。子项无需指定高度</p>
<p>GitHub Pages: https://github.com/fengshangbin/ListView</p>
# 设计理念
<p>不依赖第三方框架，也无不侵入，压缩后js只有10KB，类似安卓原生ListView的使用方式。
# 特点及优势
<p>1，大数据列表（采用虚拟DOM防止大数据列表下手机内存不够）</p>
<p>2，不定高子项（无需给子项设置指定高度）</p>
<p>3，集成顶部上滑或底部下滑 Loading更多数据</p>
<p>4，仿安卓原生ListView的使用方式，使用简单</p>
# 如何使用
<p>页面定义ListView容器</p>
<pre>
	<div id="container"></div>
</pre>
<p>引入js文件</p>
<pre>
	<script src="c3listview.js"></script>
</pre>
<p>定义一个数据源</p>
<pre>
	var adapter=new C3ListView.adapter([1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4]);//参数为数据数组，是可选的
</pre>
<p>定义子项html视图</p>
<pre>
	adapter.getHtml=function(position){
		var data=adapter.getData(position);
		return "<div data-position=\""+position+"\">"+data+"</div>";
	}
</pre>
<p>关联ListView容器</p>
<pre>
	/*
	container: ListView子项的容器
	adapter: 数据源
	scrollParent: 滚动条所属容器，可选，默认为window
	*/
	
	var listView=new C3ListView.builder(document.getElementById("container"), adapter);
</pre>
<p>到此这样就可以运行ListView了</p>
<a href="https://github.com/fengshangbin/ListView/blob/master/examples/list-scroll-div.html">示例</a>
# 更多功能
<p>设置数据loading视图</p>
<pre>
	<script type="text/x-template" id="template-loading">
		<svg viewBox="0 0 50 50" class="loading" id="loading">
		 <defs>
		   <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
			 <stop offset="0%"   stop-color="#000" stop-opacity="1.0" />
			 <stop offset="90%" stop-color="#000" stop-opacity="0" />
		   </linearGradient>
		 </defs>
		 <circle cx="25" cy="25" r="20" stroke-width="5" stroke="url(#linear)" fill="none" />
		</svg>
	</script>
	
	adapter.getLoadingHtml=function(){
		return document.getElementById("template-loading").innerHTML;
	}
</pre>
<p>设置到底下滑添加数据</p>
<pre>
	listView.addEventListener("touchbottom",function(e){ //顶部上滑对应touchtop
		console.log("touchbottom");
		window.setTimeout(function(){
			adapter.appendData([1,2,3,4]);
		},2000);
	});
</pre>
<p>设置当前为最后一页</p>
<pre>
	adapter.isLastPage=true; //第一页对应isFirstPage
</pre>
<p>设置/重置数据源</p>
<pre>
	adapter.setData([1,2,3,4,1,2,3,4])
</pre>
<p>向前追加数据</p>
<pre>
	adapter.preAppendData([1,2])
</pre>
<p>向后追加数据</p>
<pre>
	adapter.appendData([1,2])
</pre>
<p>更新数据</p>
<pre>
	/*
	data: 新数据
	position: 被更新子项的索引
	*/
	
	adapter.updateData(4,0)
</pre>
<p>更新子项视图</p>
<pre>
	adapter.updateView(view) //触发重新计算view的高度
</pre>
<p>删除数据</p>
<pre>
	adapter.removeData(0) //参数为被删除子项的索引
</pre>
<p>获取数据</p>
<pre>
	adapter.getData(0) //参数为子项的索引
</pre>
# 许可
<p>MIT许可</p>