/*
 * c3listview.js
 * by fengshangbin 2018-12-17
 * https://github.com/fengshangbin/ListView
 * H5 ListView Component By Virtual DOM
 **/
(function() {
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  function C3Event(type, data) {
    this.type = type;
    this.data = data;
    this.target = null;
  }
  function C3EventDispatcher() {
    var event = {};
    this.addEventListener = function(eventType, callback) {
      if (event[eventType] == null) event[eventType] = [];
      if (event[eventType].indexOf(callback) == -1) event[eventType].push(callback);
    };
    this.removeEventListener = function(eventType, callback) {
      if (event[eventType] == null) event[eventType] = [];
      if (callback == null) {
        if (event[eventType].length > 0) event[eventType] = [];
      } else {
        var index = event[eventType].indexOf(callback);
        if (index > -1) {
          event[eventType].splice(index, 1);
        }
      }
    };
    this.dispatchEvent = function(e) {
      e.target = this;
      if (event[e.type] != null) {
        for (var i = 0; i < event[e.type].length; i++) {
          event[e.type][i](e);
        }
      }
    };
    this.hasEventListener = function(eventType) {
      if (event[eventType] == null) event[eventType] = [];
      return event[eventType].length > 0;
    };
  }
  var C3ListView = {
    builder: function(_container, _adapter, scrollParent) {
      var adapter = _adapter.getProxy();
      var scrollParent = scrollParent ? scrollParent : window;
      var scrollParentHeight = 0;
      var topSpace;
      var that = this;

      var topHeight = 0,
        viewHeight = 0,
        totalHeight = 0;
      var firstIndex = -1,
        lastIndex = -1;

      this.scrollUp = function(y) {
        scrollParent.scrollTo(0, (scrollParent == window ? document.documentElement.scrollTop || document.body.scrollTop : scrollParent.scrollTop) - y);
      };
      this.scrollDown = function(y) {
        scrollParent.scrollTo(0, (scrollParent == window ? document.documentElement.scrollTop || document.body.scrollTop : scrollParent.scrollTop) + y);
      };

      function init() {
        topSpace = document.createElement('div');
        topSpace.style.margin = '0px';
        topSpace.style.padding = '0px';
        topSpace.style.border = 'none';
        _container.appendChild(topSpace);
        scrollParentHeight = scrollParent.innerHeight || scrollParent.clientHeight; //document.documentElement.clientHeight || document.body.clientHeight;

        scrollParent.addEventListener('resize', function() {
          scrollParentHeight = scrollParent.innerHeight; //document.documentElement.clientHeight || document.body.clientHeight;
        });

        var delayCheckTouch = debounce(function() {
          //var scrollY = scrollParent.scrollY;
          var scrollY = scrollParent == window ? document.documentElement.scrollTop || document.body.scrollTop : scrollParent.scrollTop;
          if (that.hasEventListener('touchtop') && firstIndex == 0 && scrollY == 0) {
            if (!adapter.hasTopLoad() && !_adapter.isFirstPage) {
              adapter.addTopLoad();
              window.setTimeout(function() {
                that.dispatchEvent(new C3Event('touchtop'));
              }, 100);
            }
          } else if (that.hasEventListener('touchbottom') && lastIndex >= 0 && lastIndex == adapter.getCount() - 1) {
            var scrollContentHeight = scrollParent == window ? document.documentElement.scrollHeight || document.body.scrollHeight : scrollParent.scrollHeight;
            //console.log(scrollY,scrollParentHeight,scrollContentHeight)
            if (scrollY + scrollParentHeight + 1 >= scrollContentHeight) {
              if (!adapter.hasBottomLoad() && !_adapter.isLastPage) {
                adapter.addBottomLoad();
                that.dispatchEvent(new C3Event('touchbottom'));
              }
            }
          }
        }, 50);
        scrollParent.addEventListener('scroll', function() {
          doRender();
          delayCheckTouch();
        });
        _adapter.addEventListener('change', function(event) {
          doRender();
        });
        _adapter.addEventListener('move', function(event) {
          var index = event.data;
          firstIndex += index;
          lastIndex += index;
        });
        _adapter.addEventListener('changePosition', function(event) {
          var index = event.data;
          var item = adapter.getItem(index);
          var view = item.view;
          if (index >= firstIndex && index <= lastIndex) {
            var pre = view.previousSibling || view.previousElementSibling;
            view.outerHTML = item.html;
            item.view = pre.nextSibling || pre.nextElementSibling;
            updatedView(item);
            onImageLoad(item);
          } else {
            item.view = null;
          }
        });
        _adapter.addEventListener('remove', function(event) {
          var item = event.data.item;
          var index = event.data.index;
          if (index >= firstIndex && index <= lastIndex) {
            item.view.remove();
            setViewHeight(viewHeight - item.height);
          } else if (index < firstIndex) {
            firstIndex--;
            setTopHeight(topHeight - item.height);
          }
          lastIndex--;
          setTotalHeight(totalHeight - item.height);
          /*if(lastIndex>=0)
						totalHeight-=item.height;
					else
						totalHeight=0;*/
        });
        _adapter.addEventListener('changeSource', function(event) {
          firstIndex = lastIndex = -1;
          _container.innerHTML = '';
          _container.appendChild(topSpace);
          setTotalHeight(0);
          setTopHeight(0);
          setViewHeight(0);
        });
        _adapter.addEventListener('updateView', function(event) {
          var item = event.data.item;
          var index = event.data.index;
          updatedView(item);
        });
        if (adapter.getCount() > 0) doRender();
      }

      var ticking = false;
      var delayRender = debounce(function() {
        render();
      }, 100);
      function doRender() {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(render);
        }
        delayRender();
      }

      function render() {
        //var scrollY = scrollParent.scrollY;
        var scrollY = scrollParent == window ? document.documentElement.scrollTop || document.body.scrollTop : scrollParent.scrollTop;
        //console.log(scrollY, scrollParentHeight, topHeight, viewHeight);
        if (scrollY - 5 * scrollParentHeight > topHeight) {
          removeView(firstIndex);
        }
        if (scrollY - 1 * scrollParentHeight < topHeight) {
          addView(firstIndex - 1);
        }
        if (scrollY + 6 * scrollParentHeight < topHeight + viewHeight) {
          removeView(lastIndex);
        }
        if (scrollY + 2 * scrollParentHeight > topHeight + viewHeight) {
          addView(lastIndex + 1);
        }
        ticking = false;
      }
      function onImageLoad(item) {
        //console.log(item.view);
        var images = item.view.querySelectorAll('img');
        for (var i = 0; i < images.length; i++) {
          var img = images[i];
          if (img.complete) {
            updatedView(item);
          } else {
            img.onload = function() {
              updatedView(item);
            };
          }
        }
      }
      function addView(index) {
        if (index < 0 || index >= adapter.getCount()) return;
        var isAfter = index == lastIndex + 1;
        var item = adapter.getItem(index);
        if (isAfter) {
          lastIndex = index;
          if (firstIndex == -1) firstIndex = index;
        } else {
          firstIndex = index;
          if (lastIndex == -1) lastIndex = index;
        }
        if (item.view == null) {
          if (isAfter) {
            _container.insertAdjacentHTML('beforeend', item.html);
            item.view = _container.lastChild || _container.lastElementChild;
          } else {
            topSpace.insertAdjacentHTML('afterend', item.html);
            item.view = topSpace.nextSibling || topSpace.nextElementSibling;
          }
          updatedView(item);
          onImageLoad(item);
        } else {
          if (isAfter) {
            _container.appendChild(item.view);
          } else {
            var targetElment = topSpace.nextSibling || topSpace.nextElementSibling;
            if (targetElment == null) _container.appendChild(item.view);
            else _container.insertBefore(item.view, targetElment);
          }
          if (item.needUpdate) updatedView(item);
          setViewHeight(viewHeight + item.height);
        }
        if (isAfter == false) {
          setTopHeight(topHeight - item.height);
        }
      }
      function removeView(index) {
        if (index < 0 || index >= adapter.getCount()) return;
        var isAfter = index == lastIndex;
        var item = adapter.getItem(index);
        if (isAfter) {
          lastIndex = index - 1;
        } else {
          firstIndex = index + 1;
        }
        item.view.remove();
        setViewHeight(viewHeight - item.height);
        if (isAfter == false) {
          setTopHeight(topHeight + item.height);
        }
      }
      function updatedView(item) {
        var index = item.index;
        if (adapter.getItem(index) != item) {
          console.warn('index error on updated view at:', index);
          return;
        }
        var view = item.view;
        var height = view.offsetHeight;
        var targetHeight, marginTop;
        var style = window.getComputedStyle(view);
        if (!height) {
          //height=view.height.baseVal.value;//getClientRects
          var heightStr = style.height.replace('px', '');
          if (heightStr == '') heightStr = '0';
          height = parseFloat(heightStr);
        }
        //console.log(height);
        if (height == 0) {
          item.needUpdate = true;
          return;
        }
        marginTop = parseFloat(style.marginTop.replace('px', ''));
        targetHeight = height + marginTop;
        //console.log(item.view, height, targetHeight);
        var oldHeight = item.height;
        item.height = targetHeight;
        /*if(totalHeight==0){
					totalHeight+=parseFloat(style["margin-bottom"].replace("px",""));
				}*/
        //totalHeight+=targetHeight-oldHeight;
        setTotalHeight(totalHeight + targetHeight - oldHeight);
        if (index >= firstIndex && index <= lastIndex) {
          setViewHeight(viewHeight + targetHeight - oldHeight);
        } else if (index < firstIndex) {
          setTopHeight(topHeight - targetHeight - oldHeight);
        }
        if (item.autoScroll == 1 || item.autoScroll == 2 || item.autoScroll == 3) {
          var marginBottom = parseFloat(style.marginBottom.replace('px', '')) * (item.autoScroll == 2 ? 2 : -1);
          that.scrollDown(targetHeight - oldHeight + marginBottom);
          //console.log(item.autoScroll, targetHeight,oldHeight,marginBottom);
          item.autoScroll = 3;
        }
      }
      function setTopHeight(value) {
        if (value < 0) value = 0;
        if (topHeight == value) return;
        topHeight = value;
        topSpace.style.height = topHeight + 'px';
        doRender();
      }
      function setTotalHeight(value) {
        if (totalHeight == value) return;
        totalHeight = value;
        _container.style.height = totalHeight + 'px';
      }
      function setViewHeight(value) {
        if (viewHeight == value) return;
        viewHeight = value;
        doRender();
      }
      init();
    },
    adapter: function(_data) {
      var data = _data != null ? _data : [];
      var items = [];
      var hasTopLoad = (hasBottomLoad = false);
      this.isFirstPage = this.isLastPage = false;
      var that = this;
      this.appendData = function(_data) {
        if (hasBottomLoad) {
          hasBottomLoad = false;
          var last = proxy.getCount() - 1;
          last = hasTopLoad ? last - 1 : last;
          if (_data == null || _data.length == 0) {
            this.removeData(last);
          } else {
            var item = proxy.getItem(last);
            item.autoScroll = 0;
            this.updateData(_data.shift(), last);
          }
        }
        if (_data == null || _data.length == 0) return;
        data = data.concat(_data);
        this.dispatchEvent(new C3Event('change'));
      };
      this.preAppendData = function(_data) {
        if (hasTopLoad) {
          hasTopLoad = false;
          if (_data == null || _data.length == 0) {
            this.removeData(0);
          } else {
            var item = proxy.getItem(0);
            item.autoScroll = 1;
            this.updateData(_data.pop(), 0);
          }
          //this.removeData(0);
        }
        if (_data == null || _data.length == 0) return;
        var len = _data.length;
        data = _data.concat(data);
        var tempItems = [];
        for (var index in items) {
          index = parseInt(index);
          tempItems[index + len] = items[index];
          tempItems[index + len].index = index + len;
        }
        items = tempItems;
        this.dispatchEvent(new C3Event('move', len));
        this.dispatchEvent(new C3Event('change'));
      };
      this.updateData = function(_data, position) {
        position = hasTopLoad ? position + 1 : position;
        data[position] = _data;
        var item = proxy.getItem(position);
        if (item.view != null) {
          item.html = this.getHtml(hasTopLoad ? position - 1 : position).replace(/(^\s*)|(\s*$)/g, '');
          if (item.autoScroll == 3) item.autoScroll = 0;
          this.dispatchEvent(new C3Event('changePosition', position));
        }
      };
      this.updateView = function(view) {
        for (var index in items) {
          index = parseInt(index);
          var item = items[index];
          if (item.view == view) {
            if (item.autoScroll == 3) item.autoScroll = 0;
            this.dispatchEvent(new C3Event('updateView', { item: item, index: index }));
            break;
          }
        }
      };
      this.removeData = function(position) {
        position = hasTopLoad ? position + 1 : position;
        var item = proxy.getItem(position);
        items.splice(position, 1);
        data.splice(position, 1);
        if (item.view != null) {
          this.dispatchEvent(new C3Event('remove', { item: item, index: position }));
        }
      };
      this.getData = function(position) {
        position = hasTopLoad ? position + 1 : position;
        return data[position];
      };
      this.setData = function(_data) {
        data = _data != null ? _data : [];
        items = [];
        hasTopLoad = hasBottomLoad = false;
        this.dispatchEvent(new C3Event('changeSource'));
      };
      this.getHtml = function(position) {
        return '<div>' + data[position] + '</div>';
      };
      this.getLoadingHtml = function() {
        return null;
      };

      var proxy = {
        getCount: function() {
          return data.length;
        },
        getItem: function(position) {
          var item = items[position];
          if (item == null) {
            items[position] = { view: null, height: 0, index: position, autoScroll: 0 };
            if ((position == 0 && hasTopLoad) || (position == proxy.getCount() - 1 && hasBottomLoad)) {
              items[position].html = that.getLoadingHtml().replace(/(^\s*)|(\s*$)/g, '');
              if (hasBottomLoad) items[position].autoScroll = 2;
            } else {
              items[position].html = that.getHtml(hasTopLoad ? position - 1 : position).replace(/(^\s*)|(\s*$)/g, '');
            }
          }
          return items[position];
        },
        addTopLoad: function() {
          if (that.getLoadingHtml() != null) {
            that.preAppendData(['loading']);
            hasTopLoad = true;
          }
        },
        addBottomLoad: function() {
          if (that.getLoadingHtml() != null) {
            that.appendData(['loading']);
            hasBottomLoad = true;
          }
        },
        hasTopLoad: function() {
          return hasTopLoad;
        },
        hasBottomLoad: function() {
          return hasBottomLoad;
        }
      };
      this.getProxy = function() {
        return proxy;
      };
    }
  };
  C3ListView.adapter.prototype = new C3EventDispatcher();
  C3ListView.builder.prototype = new C3EventDispatcher();

  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = C3ListView;
  } else {
    window.C3ListView = C3ListView;
  }
})();
