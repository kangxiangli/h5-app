var singleBodyHg = $('body').outerHeight();
var get_back = $('.get_back').height();
var footerUl = $(".footer_navigation ul").height();
$("#wrapper").height(singleBodyHg);
$(".bgBody,.bagfil").height(singleBodyHg);
$(".cloBagd ").height(singleBodyHg - footerUl);
var host = 'https://api.0-fashion.com';
var host2 = 'http://www.0-fashion.com';
var MemberId = localStorage.MemberId;
var CategoryId = localStorage.ParentCategoryName;
var userNum = localStorage.u_num;
var dataId = localStorage.dataId;

function getLocalTime(nS) {     
   return new Date(parseInt(nS) * 1000).toLocaleDateString().replace(/:\d{1,2}$/,' ');     
}     
$(function() {
	//时间戳转换日期




	//清除隐藏
	$("#account").focus(function() {
		$(".clearPhone").show();
		$(".clearPsd").hide();
		$(".clearPhone").click(function() {
			$("#account").val('');
		});
	});
	$("#psd").focus(function() {
		$(".clearPsd").show();
		$(".clearPhone").hide();
		$(".clearPsd").click(function() {
			$("#psd").val('');
		});
	});
	$(".close_dialog").click(function() {
		$(".dialog_box").hide();
	});
	$(".souquan").click(function() {
		localStorage.MemberId='';
	    localStorage.u_num='';
		location.replace('login.html');
		
	})
	//登陆
	$("#login_btn").click(function() {
		var phoneNumber = $("#account").val();
		var pasd = $("#psd").val();
		//			var phoneNumber = 15210775802;
		//			var pasd = 321321;
		var MemberId;
		if((phoneNumber == null) || (phoneNumber == '')) {
			showDiag("请输入手机号码");
		} else if((pasd == null) || (pasd == '')) {
			showDiag("请输入密码");
		} else {
			$.ajax({
				type: "post",
				url: host + '/api/members/member/login',
				data: {
					PhoneNumber: phoneNumber,
					PassWord: pasd
				},
				success: function(data) {
					if(data.ResultType == 3) {
						console.log(data.Data);
						localStorage.MemberId = data.Data.MemberId;
						localStorage.u_num = data.Data.U_Num;
						localStorage.UserPhoto = data.Data.UserPhoto;
						localStorage.MemberName = data.Data.MemberName;
						localStorage.isTest=data.Data.IsTest;//true做了风格测试false没做
						localStorage.isDetailTest=data.Data.isDetailTest;//1做了详细测试0没做
						location.href = 'shezhi.html';
					} else {
						showDiag(data.Message);
					}
				}
			});
		}
	});

	//商品
	var buyHgBody = $("body").height(),
		buyFooter = $(".buyFooter ul").height(),
		handMall = $(".hand_mall").height(),
		header = $(".header").height();
	$("#buyerBox").height(buyHgBody - buyFooter);
	$("#buyClothes").height(buyHgBody - $(".Footer").height());
	halfBox = ($("#buyClothes").height() - $(".minddleBox").height() + header / 2);
	halfMall = ($("#buyerBox").height() - handMall);
	$(".hand_mall").css("margin-top", halfMall / 2);
	$(".minddleBox").css("margin-top", halfBox / 2);
	//搜索框
	$(".header .imgBg").click(function() {
		$(this).hide();
		$(".header").animate({
			top: '0'
		});
	});
	$(".search").click(function() {
		$(".header .imgBg").show();
		$(".header").animate({
			top: '-0.8rem'
		});
	});
	//点击零时商尚
	$(".back_more").click(function() {
		$(".warmPrompt").show(100).delay(1500).fadeOut();
	});

	//点击登陆或个人设置
	$(".back_me").click(function() {
		var idMb = localStorage.MemberId;
		if((idMb == '') || (idMb == undefined)) {
			location.href = "login.html";
		} else {
			location.href = "shezhi.html";
		}
	});
	//获取单品数据	
	$(".cloDec div").click(function() {
		var typeId = $(this).attr("data-type");
		localStorage.ParentCategoryName = typeId;
		window.localStorage.setItem("datt", 0);
	//	location.href = '/home/store/shangpin.html';
				location.href = 'shangpin.html';
	});
	$('.searchMsg').click(function() {//index页面的搜索栏
		var inTxt = $(".huohao").val();
		window.localStorage.setItem("val", inTxt);
		window.localStorage.setItem("datt", 1);
		//location.href = '/home/store/shangpin.html';
				location.href = 'shangpin.html';
	});

	$('.searchShangpin').click(function() {//商品页面的搜索栏
		var inTxt = $(".huohao").val();
		window.localStorage.setItem("datt", 1);
		//window.localStorage.setItem("val", inTxt);
		location.href = 'shangpin.html';
	});
	//积分
	$(".bottom_nav").click(function() {
		$("#wrapper,.bagfil,.cloBagd").addClass("bgfilter");
		$(".showHid").show().animate({
			top: '0'
		});
	});
	$(".showHid").click(function() {
		$(".showHid").animate({
			top: '130%'
		}).hide(50);
		$("#wrapper,.bagfil,.cloBagd").removeClass("bgfilter");
	});
	//引导层
	//主页
	$(".know").click(function() {
		$(".yinDaoy").attr("data-int", '1').hide();
		var yinDaoInt = $(".yinDaoy").attr("data-int");
		localStorage.yinDaoInt = yinDaoInt;
		if((localStorage.MemberId == '') || (localStorage.MemberId == null) || (localStorage.MemberId == undefined)) {
			location.href = 'login.html';
		} else {
			location.href = 'shezhi.html';
		}
	});
	if(localStorage.yinDaoInt == 1) {
		$(".yinDaoy").hide();
	}
	//登陆页
	$(".dengLsu").click(function() {
		$(".dengl").attr("data-int", '1').hide();
		var dengLint = $(".dengl").attr("data-int");
		localStorage.dengLint = dengLint;
	});
	if(localStorage.dengLint == 1) {
		$(".dengl").hide();
	}
	$(".active_register").click(function() {
		window.location.href = 'register.html';
	});
	$(".find_psd").click(function() {
		window.location.href = 'findpsd.html';

	});
	//个人信息页
	$(".yuyueYd").click(function() {
		$(".yuyueYd").attr("data-int", '1').hide();
		var yuyueYd = $(".yuyueYd").attr("data-int");
		localStorage.yuyueYd = yuyueYd;
		$(".huodongYd").show();
	});
	if(localStorage.yuyueYd == 1) {
		$(".yuyueYd").hide();
	}
	$(".huodBtn").unbind("click").click(function() {
		$(".huodongYd").attr("data-int", '1').hide();
		var huodongYd = $(".huodongYd").attr("data-int");
		localStorage.huodongYd = huodongYd;
		$.post("http://api.0-fashion.com/Api/Games/Game/GetGameInfo", {
			Tag: 'FiveYear',
			MemberId: localStorage.MemberId,
			U_Num: localStorage.u_num

		}, function(da) {
			console.log(da);
			if(da.ResultType == 3) {
				var LimitCount = da.Data.LimitCount;
				var PlayedCount = da.Data.PlayedCount;
				var startTime = da.Data.StartTime;
				var endTime = da.Data.EndTime;
				var toDay = getNowFormatDate();
				var remained = LimitCount - PlayedCount;
				if(toDay <= endTime && toDay >= startTime) {
					if(remained == 0) {
						//									layer.msg("您的次数已经用完~", {
						//										time: 100000
						//									});
						layer.msg("您的次数已经用完");
					} else {
						window.location.href = "/home/store/game/DZZ.html";
					}
				} else {
					layer.msg("暂无活动");
				}

			} else {
				layer.msg("游戏未定义");
			}
		})

		function getNowFormatDate() {
			var date = new Date();
			var seperator1 = "-";
			var seperator2 = ":";
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if(month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if(strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
				" " + date.getHours() + seperator2 + date.getMinutes() +
				seperator2 + date.getSeconds();
			return currentdate;
		}
	})
	if(localStorage.huodongYd == 1) {
		$(".huodongYd").hide();
	}
});

function clearLocal() {
	window.onbeforeunload = function() {
		//		localStorage.clear();
		localStorage.MemberId.clear();
		localStorage.u_num.clear();
		localStorage.UserPhoto.clear();
		localStorage.MemberName.clear();
		//return "真的要关掉页面吗"; 
		//这一句如果写了，会弹窗提示是否要关掉页面，如果没这个需求，可以不写
	};
}
//共用方法
function showDiag(msg) {
	$(".dialog_box").show();
	$(".dialog_box span").html(msg);
}