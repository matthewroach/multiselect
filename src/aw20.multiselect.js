/*
 * Multi Select Plugin
 * http://www.aw20.net/
 *
 * Copyright 2012, aw2.0 Ltd.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * 
 */

(function( $ ){

  var methods = {
    init : function( options ) { 
    return this.each(function() {

      var $multiselect = $(this);

      if (!$multiselect.data('multi')) {

      var s = $.extend({}, $.fn.awmultiselect.defaults, options);

      var tId = $(this).attr('id');
      
      $multiselect.data('multi', {
        id : tId,
        eId : '#'+tId,
        input : '#input-'+tId,
        drop : '.aw-drop-'+tId,
        list : '.aw-drop-'+tId+' ul',
        listItem : '.aw-drop-'+tId+' ul li',
        pill : '.aw-pill',
        output : s.output,
        dropH : s.dropH
      })


      $(this).after('<div class="aw-multiselect"><input type="text" class="aw-ms-input" id="input-'+$multiselect.data('multi').id+'" autocomplete="off" /><div id="aw-drop" class="aw-drop-'+$multiselect.data('multi').id+'"><ul></ul></div></div>');


      $.each($('#'+tId+' option'), function(i) {
        if (this.selected == false) {
          $($multiselect.data('multi').list).append('<li data-id="'+this.value+'"><span>'+this.innerHTML+'</span></li>');
        } else {
          $($multiselect.data('multi').list).append('<li data-id="'+this.value+'" class="aw-selected"><span>'+this.innerHTML+'</span></li>');
          methods.prePopulate($multiselect.data('multi'),this);
        }
      });

      $($multiselect.data('multi').input).on('keyup', function(e) {

        var key = e.keyCode;
        if(key == 38) {
          methods.moveUp($multiselect.data('multi'));
        } else if(key == 40) { // Down Key
          methods.moveDown($multiselect.data('multi'));
        } else if(key == 13) { // Enter
          methods.selectItem($multiselect.data('multi'));
          $($multiselect.data('multi').input).val('').focus();
        } else {
          methods.filter($multiselect.data('multi'), this);
        }
      });

      $($multiselect.data('multi').input).on('focus', function() {
        $($multiselect.data('multi').drop).fadeIn();
        methods.unhide($multiselect.data('multi'));
        if ($(this).val() != "") {
          methods.filter(obj, this);
        }
      });

      $($multiselect.data('multi').input).on('focusout', function() {
        $($multiselect.data('multi').drop).fadeOut();
      });

      $($multiselect.data('multi').output).on('click', 'span', function() {
        methods.unselect($multiselect.data('multi'), this);
      });


      $($multiselect.data('multi').listItem).on('click', function() {
        methods.selectItem($multiselect.data('multi'), this);
      });

      $(this).hide();

      }
    });
    },
    destroy : function( ) {
      
      return this.each(function(){ 
        var $multiselect = $(this);

        $(this).next('.aw-multiselect').remove();
        $(this).show();
        $($multiselect.data('multi').output).empty();

        $multiselect.removeData('multi');
      });

    },
    filter : function( obj, item ) {

      var filter_str = $.trim($(item).val()).toLowerCase();

      $(obj.list).animate({top : 0},100);
      $(obj.listItem).removeClass('aw-highlighted')

      if(filter_str.length > 0 && filter_str != "") {

        var filteritems = $(obj.listItem+':not(.aw-selected)');
  
        for( var i=0; i < filteritems.length; i++){ 
          var showFilter = ($('span', filteritems[i]).text().toLowerCase().indexOf(filter_str) > -1 || $('span', filteritems[i]).text().toLowerCase().indexOf(filter_str) > -1);
          
          if(showFilter) {
            $(filteritems[i]).removeClass('aw-hide');
          } else {
            $(filteritems[i]).addClass('aw-hide');
          }
        } // JS For Loop
      } else {
        methods.unhide(obj);
      }

    },

    unhide : function( obj ) { 

      $(obj.listItem).removeClass('aw-hide');

    },

    moveDown : function( obj ) { 
      var currentItem = $(obj.listItem+'.aw-highlighted'), 
          visibleOpts = $(obj.listItem).not('li.aw-selected, .aw-hide'),
          nextItem = $(obj.listItem+'.aw-highlighted').nextAll("li:not(.aw-selected,.aw-hide):first");

      var cTop = nextItem.position();
      if (cTop != null ) {
        var cTop = cTop.top;
        var cOH = currentItem.outerHeight();
        var total = parseInt(cTop) + parseInt(cOH);

        if (total >= obj.dropH) {
          var moveTo = parseInt(obj.dropH) - parseInt(total);
          $(obj.list).animate({top : moveTo},100);
        }
      }

      if (currentItem.length == 0) {
        $(obj.listItem+':visible').first().addClass('aw-highlighted')
        $(obj.list).animate({top : 0},100);
      } else {
        visibleOpts.removeClass('aw-highlighted');
        nextItem.addClass('aw-highlighted');

      }
    },

    moveUp : function( obj ) {
      var currentItem = $('li.aw-highlighted'),
          visibleOpts = $(obj.listItem).not('li.aw-selected, .aw-hide'),
          prevItem  = $(".aw-highlighted").prevAll("li:not(.aw-selected,.aw-hide):first");

      var cTop = prevItem.position();
      if (cTop != null ) {
        var cTop = cTop.top;
        var cOH = currentItem.outerHeight();
        var total = parseInt(cTop) + parseInt(cOH);

        if (total <= obj.dropH) {
          var moveTo = parseInt(obj.dropH) - parseInt(total);
          if (moveTo > 0) { 
            var moveTo = 0 
          }
          $(obj.list).animate({top : moveTo},100);
        }
      }

      if (currentItem.length == 0) {
        $(obj.listItem+':visible').first().addClass('aw-highlighted');
        $(obj.list).animate({top : 0},100);
      } else {
        visibleOpts.removeClass('aw-highlighted');
        prevItem.addClass('aw-highlighted');
      }
    },

    selectItem : function ( obj, item ) {
      if (item == undefined) {
        var selected = $(obj.list+' li.aw-highlighted')
      } else {
        var selected = $(item);
      }

      var sId = selected.attr('data-id');
      
      $(obj.output).append('<span class="aw-pill" data-id="'+sId+'">'+selected.text()+'</span>');
      $(obj.eId+' option[value='+sId+']').attr('selected','selected');
      selected.addClass('aw-selected').removeClass('aw-highlighted');
    },

    unselect : function ( obj, item ) {

      var sId = $(item).attr('data-id');

      $(obj.eId+' option[value='+sId+']').removeAttr('selected');
      $(obj.list+' li[data-id='+sId+']').removeClass('aw-selected')
      $(item).remove();

    },

    prePopulate : function ( obj, item ) {

      var selected = $(obj.eId +' option[value='+item.value+']');
      $(obj.output).append('<span class="aw-pill" data-id="'+item.value+'">'+item.text+'</span>');
      selected.attr('selected','selected');

    }
  };

  $.fn.awmultiselect = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.multiselect' );
    }    
  
  };

  //default settings
  $.fn.awmultiselect.defaults = {
    output  : '#selected',            // Place where the selected items will go
    selected: '',                           // Comma seperated list of pre selected list items
    dropH : 160
  };

})( jQuery );