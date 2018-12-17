<h1>ListView</h1>
  H5 ListView Component By Virtual DOM<br>
  H5 ListView组件，支持超大数据列表流畅运行。子项无需指定高度</p>
# ListView
<p>H5 ListView Component By Virtual DOM</p>
<p>H5 ListView组件，支持超大数据列表流畅运行。子项无需指定高度</p>
<p>GitHub Pages: https://github.com/fengshangbin/ListView</p>
<h1>设计理念</h1>
  不依赖第三方框架，也无不侵入，压缩后js只有10KB，类似安卓原生ListView的使用方式。</p>
<h1>特点及优势</h1>
  1，大数据列表（采用虚拟DOM防止大数据列表下手机内存不够）<br>
  2，不定高子项（无需给子项设置指定高度）<br>
  3，集成顶部上滑或底部下滑 Loading更多数据<br>
  4，仿安卓原生ListView的使用方式，使用简单</p>
<h1>如何使用</h1>
  页面定义ListView容器<br>
  &lt;div id=&quot;container&quot;&gt;&lt;/div&gt;</p>
<p>引入js文件<br>
  &lt;script src=&quot;c3listview.js&quot;&gt;&lt;/script&gt;</p>
<p>定义一个数据源<br>
  var adapter=new C3ListView.adapter([1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4]);//参数为数据数组，是可选的</p>
<p>定义子项html视图<br>
  adapter.getHtml=function(position){<br>
  var data=adapter.getData(position);<br>
  return &quot;&lt;div data-position=\&quot;&quot;+position+&quot;\&quot;&gt;&quot;+data+&quot;&lt;/div&gt;&quot;;<br>
  }</p>
<p>关联ListView容器<br>
  /*<br>
  container: ListView子项的容器<br>
  adapter: 数据源<br>
  scrollParent: 滚动条所属容器，可选，默认为window<br>
  */<br>
  var listView=new C3ListView.builder(document.getElementById(&quot;container&quot;), adapter);</p>
<p>到此这样就可以运行ListView了<br>
  <a href=&quot;https://github.com/fengshangbin/ListView/blob/master/examples/list-scroll-div.html>示例</a></p>
<h1>更多功能</h1>
  设置数据loading视图<br>
  &lt;script type=&quot;text/x-template&quot; id=&quot;template-loading&quot;&gt;<br>
  &lt;svg viewBox=&quot;0 0 50 50&quot; class=&quot;loading&quot; id=&quot;loading&quot;&gt;<br>
  &lt;defs&gt;<br>
  &lt;linearGradient id=&quot;linear&quot; x1=&quot;0%&quot; y1=&quot;0%&quot; x2=&quot;100%&quot; y2=&quot;0%&quot;&gt;<br>
  &lt;stop offset=&quot;0%&quot;   stop-color=&quot;#000&quot; stop-opacity=&quot;1.0&quot; /&gt;<br>
  &lt;stop offset=&quot;90%&quot; stop-color=&quot;#000&quot; stop-opacity=&quot;0&quot; /&gt;<br>
  &lt;/linearGradient&gt;<br>
  &lt;/defs&gt;<br>
  &lt;circle cx=&quot;25&quot; cy=&quot;25&quot; r=&quot;20&quot; stroke-width=&quot;5&quot; stroke=&quot;url(#linear)&quot; fill=&quot;none&quot; /&gt;<br>
  &lt;/svg&gt;<br>
  &lt;/script&gt;<br>
  adapter.getLoadingHtml=function(){<br>
  return document.getElementById(&quot;template-loading&quot;).innerHTML;<br>
  }</p>
<p>设置到底下滑添加数据<br>
  listView.addEventListener(&quot;touchbottom&quot;,function(e){ //顶部上滑对应touchtop<br>
  console.log(&quot;touchbottom&quot;);<br>
  window.setTimeout(function(){<br>
  adapter.appendData([1,2,3,4]);<br>
  },2000);<br>
  });</p>
<p>设置当前为最后一页<br>
  adapter.isLastPage=true; //第一页对应isFirstPage</p>
<p>设置/重置数据源<br>
  adapter.setData([1,2,3,4,1,2,3,4])</p>
<p>向前追加数据<br>
  adapter.preAppendData([1,2])</p>
<p>向后追加数据<br>
  adapter.appendData([1,2])</p>
<p>更新数据<br>
  /*<br>
  data: 新数据<br>
  position: 被更新子项的索引<br>
  */<br>
  adapter.updateData(4,0)</p>
<p>更新子项视图<br>
  adapter.updateView(view) //触发重新计算view的高度</p>
<p>删除数据<br>
  adapter.removeData(0) //参数为被删除子项的索引</p>
<p>获取数据<br>
  adapter.getData(0) //参数为子项的索引</p>
<h1>许可</h1>
  MIT许可</p>