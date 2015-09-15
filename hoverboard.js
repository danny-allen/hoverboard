/**
 * Hoverboard
 * Used as a floating selected/hover state for navigation buttons.
 */

var Effects = Effects || {};

(function($, window, document, undefined) {

	'use strict';

	Effects.Hoverboard = function(userOptions){

		//default options
		this.options = {
			class: 'hoverboard',
			hoverboardElementType: 'li',
			targetClass: 'selected',
			speed: 200,
			easing: 'swing',
			intent: 200,
			debug: false
		};
		
		//extend default options with module options
		$.extend(this.options, userOptions);

		//check for hoverboard
		if($('.' + this.options.class).length === 0){
			return;
		}

		//initial functionality on instantiation
		this._init();
	};


	/**
	 * _init
	 *
	 * Initial functionality that happens on instantiation of Hoverboard.
	 */
	Effects.Hoverboard.prototype._init = function(){

		//reference this
		var self = this;

		//set element from selector
		this.el = $('.'+this.options.class);

		//create the moving element
		this._createHoverboardElement();

		//set the currently selected item (or active)
		this.selected = this.el.find('.'+this.options.targetClass).first();

		//if there is no selected element! return
		if(this.selected.length < 1){
			return;
		}

		//initial position the element
		this._positionSlider(this.selected, false, function(){
			$('.' + self.options.class + '__slider').fadeIn();
		});

		//now set the event handlers to reposition the element etc...
		this._eventHandlers();
	};


	/**
	 * _createHoverboardElement
	 * 
	 * and set initial styles
	 */
	Effects.Hoverboard.prototype._createHoverboardElement = function(){

		//create the element (the hoverboard)
		this.hoverboardElement = $('<'+this.options.hoverboardElementType+' />')
			.addClass(this.options.class + '__slider').hide();

		//append the element to the main selector
		this.el.prepend(this.hoverboardElement);
	};


	/**
	 * _positionSlider
	 *
	 * Sets the position of the slider based on a selector
	 */
	Effects.Hoverboard.prototype._positionSlider = function(targetSelector, animate, callback){

		//default of animate is true
		if(typeof animate === 'undefined'){
			animate = true;
		}

		this.debug(targetSelector);

		//set position options
		var options = {
			left: targetSelector.position().left,
			width: targetSelector.width()
		};

		//animate the slider into position
		if(animate){
			$('.' + this.options.class + '__slider').stop().animate(options, this.options.speed, this.options.easing, function(){
				//run callback if exists
				if(typeof callback === 'function'){
					callback();
				}
			}); //end of animate
		
		//dont animate
		}else{
			$('.' + this.options.class + '__slider').css(options);
			
			//run callback if exists
			if(typeof callback === 'function'){
				callback();
			}
		}
	};


	/**
	 * debug
	 *
	 * Useful if you are trying to debug with multiple instances of Hoverboard.
	 */
	Effects.Hoverboard.prototype.debug = function(val){

		//if we're debugging
		if(this.options.debug){
			console.log('DEBUG: '+ val);
		}
	};


	/**
	 * _eventHandlers
	 *
	 * Set event handlers for the hoverboard effect. mouseenter and mousout have been used.
	 */
	Effects.Hoverboard.prototype._eventHandlers = function(){

		//reference this
		var self = this;

		//delay for the event handler main feature
		var timeout = null;

		//the selector we've found in the event handler
		var targetSelector;

		//the selectors we don't want to match
		var notThis = '.' + this.options.class + '--ignore, ' + '.' + this.options.class + '--ignore ' + this.options.hoverboardElementType;

		//on mouse over send the slider to the hovered element
		this.el.find('> '+ this.options.hoverboardElementType).not(notThis).on('mouseenter', function(){

			//change target based on mouseenter
			targetSelector = $(this);

			//if there is a timeout, clear it, we start again!
			if(timeout !== null){
				clearTimeout(timeout);
			}

			//run animation but delay it
			timeout = setTimeout(function(){
				self._positionSlider(targetSelector);
			}, self.options.intent);
		});

		//on mouse out, default back to the selected
		this.el.find('> '+ this.options.hoverboardElementType).not(notThis).on('mouseout', function(){

			//if there is a timeout, clear it, we start again!
			if(timeout !== null){
				clearTimeout(timeout);
			}

			//run animation but delay it
			timeout = setTimeout(function(){
				self._positionSlider(self.selected);
			}, self.options.intent);
		});

		//on window resize, position the slider appropriatly.
		$(window).on('resize', function(){

			//run animation but delay it
			timeout = setTimeout(function(){
				self._positionSlider(self.selected);
			}, self.options.intent);
		});

		//on window load, position the slider appropriatly - without animation.
		$(window).on('load', function(){

			//run animation but delay it
			timeout = setTimeout(function(){
				self._positionSlider(self.selected, false);
			}, self.options.intent);
		});
	};


})(jQuery, window, document);