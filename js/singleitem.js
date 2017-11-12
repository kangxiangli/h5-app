var singleBodyHg = $('body').outerHeight();
var get_back = $('.get_back').height();
var footerUl    =$(".footer_navigation ul").height();
//$("#wrapper").height(singleBodyHg);

pullUpAction();

var myScroll,
	pullUpEl, pullUpOffset,
	generatedCount = 0,
	PageIndex = 1,
	PageSize = 10;

/**
 * 初始化iScroll控件
 */
function loaded() {

	pullUpEl = document.getElementById('pullUp');	
	pullUpOffset = pullUpEl.offsetHeight;
	
	myScroll = new iScroll('wrapper', {
		scrollbarClass: 'myScrollbar', /* 重要样式 */
		useTransition: false, /* 此属性不知用意，本人从true改为false */

		onRefresh: function () {
			if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
			}
		},
		onScrollMove: function () {
			if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
				this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function () {
			if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
				pullUpAction();	// Execute custom function (ajax call?)
			}
		}
	});
	
	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

//初始化绑定iScroll控件 
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
document.addEventListener('DOMContentLoaded', loaded, false);


/**
 * 上拉刷新 （自定义实现此方法）
 * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
 */
function pullUpAction () {
	setTimeout(function () {
		var el, li, i;
		el = document.getElementById('thelist');		
		//商品详情页
		getCommodity();
		
		myScroll.refresh();		// 数据加载完成后，调用界面更新方法 Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000);
}
function getCommodity(){
	PageIndex++;
	 $.ajax({
	 	type:"post",
	 	url:"http://api.0-fashion.com/api/Products/Product/GetListByStore",
	 	async:true,
	 	data:{
	 		MemberId:MemberId,
			StoreId:14,
			CategoryId:CategoryId,
			PageIndex:PageIndex,
			PageSize:PageSize,
			
	 	},
	 	success:function(data){
	 		var divFooter = '</div></div>',
	 		     sedDivHed = '<div class="message_box"><div class="message">',
	 		     sedDivFooter = '</div></div>';
	 		if(data.ResultType=='3'){
	 			var contacts = data.Data;
	 			if(contacts.length==0){
	 				var div = '<div class="dialog">还没有此类商品</div>';
	 				$("#thelist").append(div);
	 			}
	 			for(var i=0; i<contacts.length; i++){
	 				 var con = contacts[i];
	 				 var divHed = '<div class="white_bg" data-product-id='+con.ProductId+'><div class="commodity">';
	 				 var img ='<img  class="picture" src='+con.ImagePath+' />';
	 				 var cost = '<p>￥'+con.Price+'</p>';
	 				 var CategoryName = '<ul class="mold"><li>'+con.CategoryName+'</li><li>'+con.SeasonName+'</li></ul>	'
	 				 var html = divHed + img + sedDivHed + cost + CategoryName + sedDivFooter + divFooter;             
	 			}
	 			$("#thelist").append(html);
	 			$("#thelist .white_bg").bind('click',function(){ 	
					var dataId = $(this).attr('data-product-id');
					localStorage.dataId = dataId;		
	  				location.href = "xiangqing.html";	
				})
	 		}
	 	}
	 });
}
