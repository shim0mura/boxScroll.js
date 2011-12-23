function Scroller(elm, direction, option){
  var _findClass=(function(){ 
    if(document.getElementsByClassName){ 
      return function(area, klass){ 
        return area.getElementsByClassName(klass); 
      }; 
    }else{ 
      return function(area, klass){ 
        var elms=area.getElementsByTagName("DIV"), 
            founds=[],tokens=null; 
        for(var i=0,l=elms.length;i<l;i++){ 
          if(elms[i].className===""){continue;} 
          tokens=elms[i].className.split(/[\t\s]+/); 
          for(var _i=0,_l=tokens.length;_i<_l;_i++){ 
            var reg=new RegExp('(^|\s)'+tokens[_i]+'(\s|$)'); 
            if(reg.test(klass)){ 
              founds.push(elms[i]); 
            } 
          } 
        } 
        return founds; 
      };
    } 
  })();

  var _addEvent=(function(){
    if(document.addEventListener){
      return function(elm, type, func){
        elm.addEventListener(type, func, false);
      };
    }else if(document.attachEvent){
      return function(elm, type, func){
        elm.attachEvent('on'+type, function(e){
          func.call(elm, e);
        });
      };
    }
  })();

  if(!elm){
    var e=new Error();
    e.name="Argument Error";
    e.message="Scroller need at least 1 argument.";
  }else if(typeof elm==="string"){
    elm=document.getElementById(elm);
  }

  direction=(direction==="vertical")?direction:"horizontal";
  option=option || {};
  
  var timer=null,
      total=speed=0,
      contWindow=_findClass(elm, "scrollWindow")[0],
      area=_findClass(elm, "scrollArea")[0],
      slide=area.style,
      ua=window.navigator.userAgent.toLowerCase();

  if(direction==="vertical"){
    var side1=_findClass(elm, "scrollTop")[0],
        side2=_findClass(elm, "scrollBottom")[0],
        denomSide1=parseInt(side1.clientHeight),
        denomSide2=parseInt(side2.clientHeight),
        areaScroll=parseInt(area.scrollHeight),
        max=area.scrollHeight-contWindow.clientHeight;
  }else{
    var side1=_findClass(elm, "scrollLeft")[0],
        side2=_findClass(elm, "scrollRight")[0],
        denomSide1=parseInt(side1.clientWidth),
        denomSide2=parseInt(side2.clientWidth),
        areaScroll=parseInt(area.scrollWidth),
        max=area.scrollWidth-contWindow.clientWidth;
  }

  var _fixHor=(function(){
    if(option["extend"]===true){
      return function(){
        var dir=total+speed;
        if(dir>=0 && dir<=max){
          contWindow.scrollLeft=(dir);
          total=dir;
        }else if(dir<0){
          total=0;
          contWindow.scrollLeft=total;
        }else{
          var width=areaScroll+speed;
          slide.width=width+"px";
          areaScroll=width;
          contWindow.scrollLeft=dir;
          total=dir;
          max=max+speed;
        }
      };
    }else{
      return function(){
        var dir=total+speed;
        if(dir>=0 && dir<=max){
          contWindow.scrollLeft=(dir);
          total=dir;
        }else if(dir<0){
          total=0;
          contWindow.scrollLeft=total;
        }else{
          total=max;
          contWindow.scrollLeft=total;
        }
      };
    }
  })();

  var _fixVer=(function(){
    if(option["extend"]===true){
      return function(){
        var dir=total+speed;
        if(dir>=0 && dir<=max){
          contWindow.scrollTop=dir;
          total=dir;
        }else if(dir<0){
          total=0;
          contWindow.scrollTop=total;
        }else{
          var height=areaScroll+speed;
          slide.height=height+"px";
          areaScroll=height;
          contWindow.scrollTop=dir;
          total=dir;
          max=max+speed;
        }
      };
    }else{
      return function(){
        var dir=total+speed;
        if(dir>=0 && dir<=max){
          contWindow.scrollTop=dir;
          total=dir;
        }else if(dir<0){
          total=0;
          contWindow.scrollTop=total;
        }else{
          total=max;
          contWindow.scrollTop=total;
        }
      };
    }
  })();

  if(ua.indexOf("gecko")!=-1){
    var _updateLeft=function(e){
      speed=-(1-e.layerX/denomSide1)*20;
    };
    var _updateRight=function(e){
      speed=(e.layerX/denomSide2)*20;
    };
    var _updateTop=function(e){
      speed=-(1-e.layerY/denomSide1)*20;
    };
    var _updateBottom=function(e){
      speed=(e.layerY/denomSide2)*20;
    };
  }else{
    var _updateLeft=function(e){
      speed=-(1-e.offsetX/denomSide1)*20;
    };
    var _updateRight=function(e){
      speed=(e.offsetX/denomSide2)*20;
    };
    var _updateTop=function(e){
      speed=-(1-e.offsetY/denomSide1)*20;
    };
    var _updateBottom=function(e){
      speed=(e.offsetY/denomSide2)*20;
    };
  }

  function _bindScroller(){
    if(direction==="vertical"){
      _addEvent(side1, "mousemove", _updateTop);
      _addEvent(side1, "mouseover", function(){
        total=contWindow.scrollTop;
        timer=setInterval(_fixVer, 30);
      });
      _addEvent(side2, "mousemove", _updateBottom);
      _addEvent(side2, "mouseover", function(){
        total=contWindow.scrollTop;
        timer=setInterval(_fixVer, 30);
      });
    }else{
      _addEvent(side1, "mousemove", _updateLeft);
      _addEvent(side1, "mouseover", function(){
        total=contWindow.scrollLeft;
        timer=setInterval(_fixHor, 30);
      });
      _addEvent(side2, "mousemove", _updateRight);
      _addEvent(side2, "mouseover", function(){
        total=contWindow.scrollLeft;
        timer=setInterval(_fixHor, 30);
      });
    }
    _addEvent(side1, "mouseout", function(){clearInterval(timer);});
    _addEvent(side2, "mouseout", function(){clearInterval(timer);});
  }

  _bindScroller();
}
