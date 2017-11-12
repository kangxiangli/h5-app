function Ship(ctx){
	gameMonitor.im.loadImage(['static/img/player.png']);
	this.width = 80;
	this.height = 50;
	this.left = gameMonitor.w/2 - this.width/2;
	this.top = gameMonitor.h - 2*this.height;
	this.player = gameMonitor.im.createImage('static/img/player.png');

	this.paint = function(){
		ctx.drawImage(this.player, this.left, this.top, this.width, this.height);
	}

	this.setPosition = function(event){
		if(gameMonitor.isMobile()){
			console.log(event);
			var tarL = event.originalEvent.changedTouches[0].clientX;
			var tarT = event.originalEvent.changedTouches[0].clientY;
		}
		else{
			var tarL = event.offsetX;
			var tarT = event.offsetY;
		}
		this.left = tarL - this.width/2 ;
		this.top = tarT - this.height/2;
		if(this.left<0){
			this.left = 0;
		}
		if(this.left>320-this.width){
			this.left = 320-this.width;
		}
		if(this.top<300){
			this.top = 300;
		}
		if(this.top>gameMonitor.h - this.height){
			this.top = gameMonitor.h - this.height;
		}
		this.paint();
	}

	this.controll = function(){
		var _this = this;
		var stage = $('#gamepanel');
		var currentX = this.left,
			currentY = this.top,
			move = false;
		stage.on(gameMonitor.eventType.start, function(event){
			_this.setPosition(event);
			move = true;
		}).on(gameMonitor.eventType.end, function(){
			move = false;
		}).on(gameMonitor.eventType.move, function(event){
			event.preventDefault();
			if(move){
				_this.setPosition(event);	
			}
			
		});
	}

	this.eat = function(foodlist){
		for(var i=foodlist.length-1; i>=0; i--){
			var f = foodlist[i];
			if(f){
				var l1 = this.top+this.height/2 - (f.top+f.height/2);
				var l2 = this.left+this.width/2 - (f.left+f.width/2);
				var l3 = Math.sqrt(l1*l1 + l2*l2);
				if(l3<=this.height/2-20 + f.height/2){
					foodlist[f.id] = null;
					if(f.type==0){
						gameMonitor.stop();
						$('#gameoverPanel').show();

						setTimeout(function(){
							$('#gameoverPanel').hide();
							$('#resultPanel').show();
							gameMonitor.getScore();
						}, 2000);
					}
					else{
						$('#score').text(++gameMonitor.score);
						$('.heart').removeClass('hearthot').addClass('hearthot');
						setTimeout(function() {
							$('.heart').removeClass('hearthot')
						}, 200);
					}
				}
			}
			
		}
	}
}

function Food(type, left, id){
	this.speedUpTime = 300;
	this.id = id;
	this.type = 0;
	this.width = 70;
	this.height =40;
	this.left = left;
	this.top = -50;
	this.speed = 0.04 * Math.pow(1.2, Math.floor(gameMonitor.time/this.speedUpTime));
	this.loop = 0;

//	var p = this.type == 0 ? 'static/img/food1.png' : 'static/img/food2.png';
		
	var p ="static/img/food"+Math.ceil(Math.random()*4)+".png";
	
	this.pic = gameMonitor.im.createImage(p);
}
Food.prototype.paint = function(ctx){
	ctx.drawImage(this.pic, this.left, this.top);
}
Food.prototype.move = function(ctx){
	if(gameMonitor.time % this.speedUpTime == 0){
		this.speed *= 1.2;
	}
	this.top += ++this.loop * this.speed;
	if(this.top>gameMonitor.h){
	 	gameMonitor.foodList[this.id] = null;
	}
	else{
		this.paint(ctx);
	}
}

function toDub(n){
        return n<10?"0"+n:""+n;
 }
function ImageMonitor(){
	var imgArray = [];
	return {
		createImage : function(src){
			return typeof imgArray[src] != 'undefined' ? imgArray[src] : (imgArray[src] = new Image(), imgArray[src].src = src, imgArray[src])
		},
		loadImage : function(arr, callback){
			for(var i=0,l=arr.length; i<l; i++){
				var img = arr[i];
				imgArray[img] = new Image();
				imgArray[img].onload = function(){
					if(i==l-1 && typeof callback=='function'){
						callback();
					}
				}
				imgArray[img].src = img
			}
		}
	}
}

   var oTxt=document.getElementsByTagName("input")[0];
   var n= 0, timer=null;
var gameMonitor = {
    uptime:50,
	remained:0,//剩余次数
	w : 320,
	h : 568,
	bgWidth : 320,
	bgHeight : 1126,
	time : 0,
	timmer : null,
	bgSpeed : 8,
	bgloop : 0,
	score : 0,
	im : new ImageMonitor(),
	foodList : [],
	bgDistance : 0,//背景位置
	eventType : {
		start : 'touchstart',
		move : 'touchmove',
		end : 'touchend'
	},
	timeStart:function(){
		  clearInterval(timer);
        timer=setInterval(function () {
            n++;
            var m=parseInt(n/60);
            var s=parseInt(n%60);
            oTxt.value=toDub(m)+":"+toDub(s);
        },1000/60);
	},
	endTime:function(){
		 clearInterval(timer);
	},
	reStartTime:function(){
		clearInterval(timer);
		oTxt.value="00:00";
        n=0;
	},
	init : function(){
		var _this = this;
		var canvas = document.getElementById('stage');
		var ctx = canvas.getContext('2d');
		$(".replay").append('<img src='+localStorage.UserPhoto+'>')

//调取可以玩多少次

$.post("https://api.0-fashion.com/Api/Games/Game/GetGameInfo",
{
	        Tag:'FiveYear',
			MemberId:localStorage.MemberId,
			U_Num:localStorage.u_num
//MemberId:6382,
//U_Num:"a8dc9d8744038399"
},function(da){
	console.log(da);
	if(da.ResultType == 3){
	var LimitCount=da.Data.LimitCount;
	var PlayedCount=da.Data.PlayedCount;
	$("#lastCount").html(LimitCount-PlayedCount);
	gameMonitor.remained=LimitCount-PlayedCount;
 }
})
		//绘制背景
		var bg = new Image();
		_this.bg = bg;
		bg.onload = function(){
          	ctx.drawImage(bg, 0, 0, _this.bgWidth, _this.bgHeight);          	
		}
		bg.src = 'static/img/bg.jpg';
		_this.initListener(ctx);
	},
	initListener : function(ctx){
		var _this = this;
		var body = $(document.body);
		$(document).on(gameMonitor.eventType.move, function(event){
			event.preventDefault();
		});
		body.on(gameMonitor.eventType.start, '.replay,.playagain,.share', function(){
			if(gameMonitor.remained<=0){
				 	layer.msg("次数用完！");
				 	$('.btn1').remove();
			 }else{
					$('#resultPanel').hide();
					var canvas = document.getElementById('stage');
					var ctx = canvas.getContext('2d');
					_this.ship = new Ship(ctx);
		      		_this.ship.controll();
		      		_this.reset();
					_this.run(ctx);
			}
		});

		body.on(gameMonitor.eventType.start, '#frontpage', function(){
			$('#frontpage').css('left', '-100%');
		});

		body.on(gameMonitor.eventType.start, '#guidePanel', function(){
			$(this).hide();
			_this.ship = new Ship(ctx);
			_this.ship.paint();
      		_this.ship.controll();
			gameMonitor.run(ctx);
			_this.timeStart();

		});

	//	body.on(gameMonitor.eventType.start, '.share,.replay', function(){
			//layer.msg("走接口");
//			$('.weixin-share').show().on(gameMonitor.eventType.start, function(){
//				$(this).hide();
//			});
/*分享需要后台配置appid，秘钥，token，时间戳，暂时先领取积分不分享了*/


	//	});

//		WeixinApi.ready(function(Api) {   
//			layer.msg("ok");
//          // 微信分享的数据
//          //分享给好友的数据
//          var wxData = {
//              "appId": "wx844834db9123c470", 
//              "imgUrl" : "static/img/icon.png",
//              "link" : "",
//              "desc" : "进击的玉兔",
//              "title" : "“玩玉兔 抢月饼!”"+gameMonitor.score
//          };
//
//          //朋友圈数据
//          var wxDataPyq ={
//          	"appId": "wx844834db9123c470",
//              "imgUrl" : "static/img/icon.png",
//              "link" : "http://dev.360.cn/html/zhuanti/yutu.html",
//              "desc" : "“玩玉兔 抢月饼”",
//              "title" : "进击的玉兔"
//          }
//
//          // 分享的回调
//          var wxCallbacks = {
//              // 分享操作开始之前
//              ready : function() {},
//              cancel : function(resp) {},
//              fail : function(resp) {},
//              confirm : function(resp) {},
//              all : function(resp) {
//                  //location.href=location.href
//              }
//          };
//
//          // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
//          Api.shareToFriend(wxData, wxCallbacks);
//          // 点击分享到朋友圈，会执行下面这个代码
//          Api.shareToTimeline(wxDataPyq, wxCallbacks);
//          // 点击分享到腾讯微博，会执行下面这个代码
//          Api.shareToWeibo(wxData, wxCallbacks);
//      });

	},
	rollBg : function(ctx){
		if(this.bgDistance>=this.bgHeight){
			this.bgloop = 0;
		}
		this.bgDistance = ++this.bgloop * this.bgSpeed;
		ctx.drawImage(this.bg, 0, this.bgDistance-this.bgHeight, this.bgWidth, this.bgHeight);
		ctx.drawImage(this.bg, 0, this.bgDistance, this.bgWidth, this.bgHeight);
	},
	run : function(ctx){
		gameMonitor.uptime<=5?5:gameMonitor.uptime-=0.02;
		var _this = gameMonitor;
		ctx.clearRect(0, 0, _this.bgWidth, _this.bgHeight);
		_this.rollBg(ctx);

		//绘制飞船
		_this.ship.paint();
		_this.ship.eat(_this.foodList);


		//产生粽子
		_this.genorateFood();

		//绘制 粽子
		for(i=_this.foodList.length-1; i>=0; i--){
			var f = _this.foodList[i];
			if(f){
				f.paint(ctx);
				f.move(ctx);
			}
			
		}
		_this.timmer = setTimeout(function(){
			gameMonitor.run(ctx);
			
		}, Math.round(1000/60));

		_this.time++;
	},
	stop : function(){
		var _this = this
		$('#stage').off(gameMonitor.eventType.start + ' ' +gameMonitor.eventType.move);
		setTimeout(function(){
			clearTimeout(_this.timmer);
		}, 0);
		 clearInterval(timer);
		 _this.score=parseFloat($("#score").val());
		 console.log("score:"+_this.score);
		_this.reStartTime();
	},
	genorateFood : function(){
		var genRate = gameMonitor.uptime; //产生月饼的频率
		var random = Math.random();
		if(random*genRate>genRate-1){
			var left = Math.random()*(this.w - 50);
			var type =0;
			var id = this.foodList.length;
			var f = new Food(type, left, id);
			this.foodList.push(f);
		}
	},
	reset : function(){
		this.foodList = [];
		this.bgloop = 0;
		this.score = 0;
		this.timmer = null;
		this.time = 0;
		$('#score').text(this.score);
	    this.timeStart();
	    this.uptime=50;
		
	},
	getScore : function(){
//		debugger
	//	var time = Math.floor(this.time/60);
		var score = this.score;
		var user = 1;
		if(score==0){
			$('#scorecontent').html('真遗憾，您竟然<span class="lighttext">一个</span>一秒都没坚持！');
			$('.btn1').text('大侠请重新来过').removeClass('share').addClass('playagain');
			$('#fenghao').removeClass('geili yinhen').addClass('yinhen');
			return;
		}
		else if(score<10){
			user = 2;
		}
		else if(score>10 && score<=20){
			user = 10;
		}
		else if(score>20 && score<=40){
			user = 40;
		}
		else if(score>40 && score<=60){
			user = 80;
		}
		else if(score>60 && score<=80){
			user = 92;
		}
		else if(score>80){
			user = 99;
		}
		if(gameMonitor.remained<=0){
			 	layer.msg("次数用完！");
			 	$('.btn1').remove();
			 }
		$('#fenghao').removeClass('geili yinhen').addClass('geili');
		$('#scorecontent').html('您坚持了<span id="sscore" class="lighttext"></span>秒<br>已获得'+score/10+'个积分<br>超过了<span id="suser" class="lighttext">31%</span>的用户！')
						.css("color","#fff");
		$('#stime').text(score);
		$('#sscore').text(score);
		$('#suser').text(user+'%');
		$('.btn1').text('再玩一次').removeClass('playagain').addClass('share');
		
//		debugger;
		
	/*直接走接口获得积分*/	
		$.post("https://api.0-fashion.com/Api/Games/Game/AddScore",
		{
			Tag:'FiveYear',
			MemberId:localStorage.MemberId,
			U_Num:localStorage.u_num,
			Score:gameMonitor.score/10,
		},function(da){
//			debugger;
			if(da.ResultType == 3){
//				debugger;
				/*领取成功吧返回的信息回填到当前账号的积分中*/
				console.log(da);
				gameMonitor.remained--;
				$("#lastCount").html(gameMonitor.remained);
//				debugger;
			 if(gameMonitor.remained<=0){
			 	layer.msg("次数用完！");
			 	$('.btn1').remove();
			 }
			}else{
				layer.msg("次数用完！");
			}		
		})
	},
	isMobile : function(){
		var sUserAgent= navigator.userAgent.toLowerCase(),
		bIsIpad= sUserAgent.match(/ipad/i) == "ipad",
		bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os",
		bIsMidp= sUserAgent.match(/midp/i) == "midp",
		bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
		bIsUc= sUserAgent.match(/ucweb/i) == "ucweb",
		bIsAndroid= sUserAgent.match(/android/i) == "android",
		bIsCE= sUserAgent.match(/windows ce/i) == "windows ce",
		bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile",
		bIsWebview = sUserAgent.match(/webview/i) == "webview";
		return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM);
     }
}
if(!gameMonitor.isMobile()){
	gameMonitor.eventType.start = 'mousedown';
	gameMonitor.eventType.move = 'mousemove';
	gameMonitor.eventType.end = 'mouseup';
}

gameMonitor.init();
