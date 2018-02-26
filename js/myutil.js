var serverDatenow = 0;//服务器时间

var serviceUrl = "http://192.168.1.198:8081/ERMS/";//测试路径  数据服务URL

// 图片地址
var getImageUrl = 'http://192.168.1.198:8081'
//var serviceUrl = "";//生产路径  数据服务

//视频流rtmp地址
//枪机：rtmp://192.168.7.52/live/livestream
//阿凡达:rtmp://192.168.6.206/live/livestream
//生产:rtmp://172.25.1.179:1935/live/livestream55

//5个视频流地址
var videoArr=[
"rtmp://192.168.6.206/live/livestream",
"rtmp://172.25.1.179:1935/live/livestream52",
"rtmp://172.25.1.179:1935/live/livestream53",
"rtmp://172.25.1.179:1935/live/livestream54",
"rtmp://172.25.1.179:1935/live/livestream55"
];
//rtmp://172.25.1.179:1935/live/livestream55



//进近态势url
var osasUrl = "http://192.168.6.203:5014/OSASNNG/";//测试路径
//var osasUrl ="http://172.25.1.181:8080/OSASNNG/";//发布路径

//航站楼态势url --目前是公网
var flightAirUrl  = "http://180.140.191.239:58791/nngmap/index.html";//测试路径
//var flightAirUrl  = "http://180.140.191.239:58791/nngmap/index.htm";//发布路径

//站坪态势
var rtmonitoringUrl = "http://192.168.7.44:8020/RTMonitoring/index.html";//测试路径
//var rtmonitoringUrl = "http://172.25.1.161:8084/RTMonitoring/index.html";//发布路径



/*************show modal***********/
function showMsg(content)
{ 
	$("#myModalLabel").html(content);
	$('#myModal-msg').modal('show');
}

var ismodalshow=false;
$("#myModal-loading").on("hidden.bs.modal",function(){ 
	ismodalshow = false;
});
 
 

function showLoding()
{
	if(!ismodalshow)
	{
		ismodalshow = true; 
		$('#myModal-loading').modal('show');
	}	
}

function hideLoding()
{ 
	$('#myModal-loading').modal('hide');  
}

$('#myModal-loading').on('shown.bs.modal', function (e) {    
	var modalHeight=Number($(window).height() / 2) - $('#myModal-loading .modal-dialog').height() / 2; 
	$(this).find('.modal-dialog').css({ 
	    'margin-top': modalHeight - 100
	}); 
      	//console.log(Number($(window).height() / 2) );
});
    
$('#myModal-msg').on('shown.bs.modal', function (e) {    
	      var modalHeight=Number($(window).height() / 2) - $('#myModal-msg .modal-dialog').height() / 2; 
	      $(this).find('.modal-dialog').css({ 
	        'margin-top': modalHeight - 100
	      }); 
      	//console.log(Number($(window).height() / 2) );
    });
/*************show modal  end***********/    


function getJson(url,jsonCallBack,jsonStr)
{
	showLoding();
		$.ajax({
			url: serviceUrl+url, 
			data: jsonStr,
			type:"post",
			success: function(dataJson) {	 
				if(dataJson.c.errorCode=="001")
				{					
					//console.log("没有权限，请登录...");
					TempCache.removeItem("username");
					window.location.href="login.html";  
				}
				//return;
				//hideLoding();
				jsonCallBack(dataJson);
				hideLoding();
			},
			error:function()
	        {	        	
				hideLoding();
	        }
			
		});
}



//ajax请求方法
function getPage(url,jsonCallBack,jsonStr)
{
	showLoding();
		$.ajax({
			url: url, 
     		contentType: "application/json", 
			data: jsonStr,
			type:"post",
			success: function(dataJson) {		
				// hideLoding();
				jsonCallBack(dataJson);
			},
			error:function()
	        {	        	
				hideLoding();
	        }
			
		});
}

//$('#mytest').live('click', function() {
//	//$('.window_content').html(require("text!components/airvideo/index"));
//require(["text!components/airvideo/index.html!strip"],
//  function(html) {
//  	console.log(html);
//      //the html variable will be the text of the
//      //some/module.html file, but only the part
//      //inside the body tag.
//  }
//);
//});
/*************下面部分是全屏功能********************/
$('#showZm_btn').on('click', function() {
	if(isFullscreenEnabled()) //判断当前浏览器是否支持全屏
	{
		if(isFullscreen()) //判断当前是否是全屏状态
		{
			cancelFullscreen(); //全屏
		} else {
			launchFullScreen(document.documentElement);
		}
	}
});

function isFullscreen() {
	return document.fullscreenElement ||
		document.msFullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement || false;
}

function isFullscreenEnabled() {
	return document.fullscreenEnabled ||
		document.mozFullScreenEnabled ||
		document.webkitFullscreenEnabled ||
		document.msFullscreenEnabled || false;
}

// 全屏事件Events
//  document.addEventListener("fullscreenchange", function(e) {
//    console.dir(e);
//  });
//  document.addEventListener("mozfullscreenchange", function(e) {
//    console.dir(e);
//  });
//  document.addEventListener("webkitfullscreenchange", function(e) {
//    console.dir(e);
//  }); 

// 处理全屏(需要全屏显示DOM元素)
function launchFullScreen(element) {
	// 先检测最标准的方法
	if(element.requestFullScreen) {
		element.requestFullScreen();
	} else if(element.mozRequestFullScreen) {
		// 其次，检测Mozilla的方法
		element.mozRequestFullScreen();
	} else if(element.webkitRequestFullScreen) {
		// if 检测 webkit的API
		element.webkitRequestFullScreen();
	}
};
// 退出全屏,不用管具体是哪个元素，因为屏幕是唯一的。
function cancelFullscreen() {
	if(document.cancelFullScreen) {
		document.cancelFullScreen();
	} else if(document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if(document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	}
};


//视频当前所有的播放器
function videoDispose()
{
    var videos = $('.sys-video');
    for(i=0; i<videos.length; i++) {
        var video = videos[i];
        if(video.className.indexOf('video-js') > -1) {
        	var myPlayer = videojs(video.id);
        	myPlayer.dispose();
        }
    }
}


//缓存封装
var TempCache = {
	cache:function(value){
	    window.localStorage.setItem("name",value);
	},
	getCache:function(){
	    return   window.localStorage.getItem("name");
	},
	setItem:function(key,value){
	     window.localStorage.setItem(key,value);
	}, 
	getItem:function(key){
	    return  window.localStorage.getItem(key);
	},
	removeItem:function(key){
	    return  window.localStorage.removeItem(key);
	}
};


// 自定义模态框

(function ($) {
    window.Ewin = function () {
        var html = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">' +
            '<div class="modal-dialog modal-sm">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="modalLabel">[Title]</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p>[Message]</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default cancel" data-dismiss="modal">[BtnCancel]</button>' +
            '<button type="button" class="btn btn-primary ok" data-dismiss="modal">[BtnOk]</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';


        var dialogdHtml = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="modalLabel">[Title]</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
        var generateId = function () {
            var date = new Date();
            return 'mdl' + date.valueOf();
        }
        var init = function (options) {
            options = $.extend({}, {
                title: "操作提示",
                message: "提示内容",
                btnok: "确定",
                btncl: "取消",
                width: 200,
                auto: false
            }, options || {});
            var modalId = generateId();
            var content = html.replace(reg, function (node, key) {
                return {
                    Id: modalId,
                    Title: options.title,
                    Message: options.message,
                    BtnOk: options.btnok,
                    BtnCancel: options.btncl
                }[key];
            });
            $('body').append(content);
            $('#' + modalId).modal({
                width: options.width,
                backdrop: 'static'
            });
            $('#' + modalId).on('hide.bs.modal', function (e) {
                $('body').find('#' + modalId).remove();
            });
            return modalId;
        }

        return {
            alert: function (options) {
                if (typeof options == 'string') {
                    options = {
                        message: options
                    };
                }
                var id = init(options);
                var modal = $('#' + id);
                modal.find('.ok').removeClass('btn-success').addClass('btn-primary');
                modal.find('.cancel').hide();

                return {
                    id: id,
                    on: function (callback) {
                        if (callback && callback instanceof Function) {
                            modal.find('.ok').click(function () { callback(true); });
                        }
                    },
                    hide: function (callback) {
                        if (callback && callback instanceof Function) {
                            modal.on('hide.bs.modal', function (e) {
                                callback(e);
                            });
                        }
                    }
                };
            },
            confirm: function (options) {
                var id = init(options);
                var modal = $('#' + id);
                modal.find('.ok').removeClass('btn-primary').addClass('btn-success');
                modal.find('.cancel').show();
                return {
                    id: id,
                    on: function (callback) {
                        if (callback && callback instanceof Function) {
                            modal.find('.ok').click(function () { callback(true); });
                            modal.find('.cancel').click(function () { callback(false); });
                        }
                    },
                    hide: function (callback) {
                        if (callback && callback instanceof Function) {
                            modal.on('hide.bs.modal', function (e) {
                                callback(e);
                            });
                        }
                    }
                };
            },
            dialog: function (options) {
                options = $.extend({}, {
                    title: 'title',
                    url: '',
                    width: 800,
                    height: 550,
                    onReady: function () { },
                    onShown: function (e) { }
                }, options || {});
                var modalId = generateId();

                var content = dialogdHtml.replace(reg, function (node, key) {
                    return {
                        Id: modalId,
                        Title: options.title
                    }[key];
                });
                $('body').append(content);
                var target = $('#' + modalId);
                target.find('.modal-body').load(options.url);
                if (options.onReady())
                    options.onReady.call(target);
                target.modal();
                target.on('shown.bs.modal', function (e) {
                    if (options.onReady(e))
                        options.onReady.call(target, e);
                });
                target.on('hide.bs.modal', function (e) {
                    $('body').find(target).remove();
                });
            }
        }
    }();
})(jQuery);
