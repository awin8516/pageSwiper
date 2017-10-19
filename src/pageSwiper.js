/****************************************
 * plus name : 模拟APP页面上下左右滑动切换
 * author    : F
 * date      : 2015-05-06
 * note      : href="#pageHome__left" or pageSwiper.to('#pageList', {position:'right'});;
 ****************************************************************************
 * HTML layout
 *	<section id="pageHome" class="page page-active" data-before="beforeHome" data-after="afterHome">
 *		<a href="#pageList__right">change page to pageList</a>
 *	</section>
 *	<section id="pageList" class="page">
 *		<a href="#" onclick="pageSwiper.to('#pageList', {position:'right'});">change page to pageDetail</a>
 *	</section>
 *	<section id="pageDetail" class="page">
 *		<a href="#pageHome__left">back to pageHome</a>
 *	</section>
 */

jQuery("head").append(
	'<style>'+
		'body .page-swiper-switching {width:100%;height:100%;overflow:hidden;}'+
		'body .page-swiper-switching body:before {content:"";position:fixed;left:0;top:0;width:100%;height:100%;}'+
		'body .page {display:none;width:100%;position:absolute;left:0;top:0;}'+
		'body .page-next {position:fixed;width:100%;left:0;top:0;display:block;z-index:101;visibility:visible;}'+
		'body .page-active {display:block;position:relative;z-index:100}'+
	'</style>'
);

window.pageSwiper = {
	fn : {
		getPropertyCount : function (o){
			var n, count = 0;for(n in o){if(o.hasOwnProperty(n)){count++;}};
			return count;
		},
		addCssSpeed : function(speed, name) {
			name = name || 'transform';
			return {
				"-webkit-transition": "-webkit-"+name+" " + speed + "ms",
				"-moz-transition": "-moz-"+name+" " + speed + "ms",
				"-o-transition": "-o-"+name+" " + speed + "ms",
				"transition": name+" " + speed + "ms"
			};
		},
		removeTransition : function(){
			return {
				"-webkit-transition": "",
				"-moz-transition": "",
				"-o-transition": "",
				"transition": ""
			};
		},
		doTranslate : function(x,y,z,speed){
			x = isNaN(x) ? x: x+"px";//数字
			y = isNaN(y) ? y: y+"px";//数字
			z = z ? isNaN(z) ? z: z+"px" : 0;//数字
			speed = speed ? this.addCssSpeed(speed) : this.removeTransition();		
			translate3d = {
				"-webkit-transform": "translate3d("+x+", " + y + ", "+z+")",
				"-moz-transform": "translate3d("+x+", " + y + ", "+z+")",
				"-o-transform": "translate3d("+x+", " + y + ", "+z+")",
				"-ms-transform": "translate3d("+x+", " + y + ", "+z+")",
				"transform": "translate3d("+x+", " + y + ", "+z+")"
			};
			style = jQuery.extend(speed, translate3d);		
			return style;
		},
		getTranslate : function(o){
			var reg=/\-?[0-9]+\.?[0-9]*/g;				
			var Transform =  o.css("webkitTransform") ? 'webkitTransform' : 'transform';
			return {
				x:parseInt(o.css(Transform).match(reg)[4]), 
				y:parseInt(o.css(Transform).match(reg)[5])
			};
		},
		removeTranslate : function(){
			return {
				"-webkit-transform": "",
				"-moz-transform": "",
				"-o-transform": "",
				"-ms-transform": "",
				"transform": ""
			};
		},
		transition : (function(){
			var s = document.createElement('p').style,
				r = 'transition' in s ||
					  'WebkitTransition' in s ||
					  'MozTransition' in s ||
					  'msTransition' in s ||
					  'OTransition' in s;
			s = null;
			return r;
		})(),
		slideTo : function(o, x, y, z, speed, animateEnd){
			if(this.transition){
				if(speed == 0){
					o.css(this.doTranslate(x, y, z));
					animateEnd && setTimeout(animateEnd,100);
				}else{
					animateEnd && (o.one('webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionend', function(){
						animateEnd();
						o.off('webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionend');
					}));
					o.css(this.doTranslate(x, y, z, speed));
				};
			}else{
				if(speed == 0){
					o.css({'left':x, 'top':y});
					animateEnd && setTimeout(animateEnd,1);
				}else{
					o.animate({'left':x, 'top':y}, speed, function(){animateEnd && animateEnd()});
				};
			};
		},
		fadeTo : function(o,opacity, speed, animateEnd){
			if(this.transition){
				if(speed == 0){
					o.css({'opacity':opacity});
					animateEnd && setTimeout(animateEnd,100);
				}else{
					o.css(this.addCssSpeed(speed, 'opacity'));
					animateEnd && (o.one('webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionend', function(){
						animateEnd();
						o.off('webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionend');
					}));
					o.css({'opacity':opacity});	
				};
			}else{
				if(speed == 0){
					o.css({'opacity':opacity});
					animateEnd && setTimeout(animateEnd,100);
				}else{
					o.animate({'opacity':opacity}, speed, function(){animateEnd && animateEnd()});
				};
			};
		}
	},
	to : function(next, option){
		option = jQuery.extend({
			effect   : 'slide',//slide | fade | scale | none
			position : 'right',//left | top | right | bottom
			speed    : 400,
			before   : null,
			after    : null,
			ishash   : false,
		}, option || {});
		var swiper = this;
		swiper.hash = option.ishash;
		if(!swiper.completed) return ;
		swiper.completed = false;
		var self = {};
		if(jQuery(next).hasClass('page')){//#Page页面
			self.next = jQuery(next);
		}else{
			if(jQuery(next).length > 0){//锚点 
				self.next = jQuery(next).closest('.page');
			}else{//# none
				swiper.completed = true;
				return;
			};
		};
		self.active = self.next.siblings('.page-active');
		self.active = self.active.length <=0 ? self.next : self.active;
		self.before = self.next.data('before');
		self.after  = self.next.data('after');
		swiper.active = self.next;
		
		self.complete = function(){
			swiper.win.scrollTop(0);
			self.active.removeClass('page-active page-next').removeAttr('style');
			self.next.addClass('page-active').removeClass('page-next').removeAttr('style');
			swiper.html.removeClass('page-swiper-switching');
			swiper.completed = true;
			swiper.ishash && (location.hash = jQuery(self.next).attr('id')+ (option.effect == 'slide' && option.position ? '__'+option.position : ''));
			setTimeout(function(){swiper.hash = true;},0);
			try{ eval(self.after+'(self.next)');}catch(e){};
			option.after && option.after(self.next);
		}
		
		try{ eval(self.before+'(self.next)');}catch(e){};
		option.before && option.before(self.next);
		swiper.html.addClass('page-swiper-switching');	
		self.active.top    = self.active.offset().top;
		self.active.height = self.active.outerHeight(true);
		self.next.height   = self.next.outerHeight(true);
		
		if(option.effect == 'slide' && option.position){			
			var topY    = self.next.height   > swiper.parent.height ? self.next.height:swiper.parent.height;
			var bottomY = self.active.height > swiper.parent.height ? self.active.height:swiper.parent.height;
			var _oppo   = {left:'right',right:'left',top:'bottom',bottom:'top'};
			var _pos    = {left : {x:'-100%', y:0, z:0},right : {x:'100%', y:0, z:0},top : {x:0, y:-topY, z:0},	bottom : {x:0, y:bottomY, z:0}};
			self.next.addClass('page-next').css({'top':self.active.top});
			swiper.fn.slideTo(self.next, _pos[option.position].x, _pos[option.position].y, _pos[option.position].z, 0, function(){
				swiper.fn.slideTo(self.active, _pos[_oppo[option.position]].x, _pos[_oppo[option.position]].y, _pos[_oppo[option.position]].z, option.speed);
				swiper.fn.slideTo(self.next, 0, 0, 0, option.speed, self.complete);	
			});
		}else if(option.effect == 'fade'){
			self.next.addClass('page-next').css({'top':self.active.top});
			swiper.fn.fadeTo(self.next, 0, 0, function(){
				swiper.fn.fadeTo(self.next, 1, option.speed, self.complete);
			});			
		}else{
			self.complete();
		};
	},
	setup : function(option){
		this.ishash = option ? option.hash : true;
		this.win = jQuery(window);
		this.html = jQuery('html');
		this.win.height = this.win.outerHeight(true);
		this.animEndEvent = 'webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionend';
		this.active = (jQuery('.page-active').length > 0) ? jQuery('.page-active:last') : jQuery('.page:first');
		this.parent = this.active.parent();
		this.parent.height = this.parent.height();
		this.completed = true;
		this.active = jQuery(location.hash.split("__")[0]).length > 0 ? jQuery(location.hash.split("__")[0]) : this.active; 
		this.ishash && this.hashEvent();
		this.to(this.active,{effect:'none',position:location.hash.split("__")[1] ? location.hash.split("__")[1] : false});
	},
	hashEvent : function(){
		var swiper = this;
		swiper.hash = true;
		swiper.win.off('hashchange.pageSwiper').on( 'hashchange.pageSwiper', function(){
			var hash     = location.hash.split("__")[0];
			var action   = location.hash.split("__")[1];
			var effect   = action == 'fade' ? action : 'slide';
			var position = !action || action == 'fade' ? false : action;
			swiper.hash && swiper.to(hash,{effect:effect,position:position,ishash:true});
		});
	}
};
jQuery(window).ready(function(e) {
    pageSwiper.setup();
});
