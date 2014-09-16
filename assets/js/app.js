$(function() {
	$('.login').click(function(){
		$('.menu').toggleClass('active');
	});

	$( ".author" ).each(function( ) {
	  var instagram = $( this ).data( 'instagram' );

		if(instagram) {
			$.ajax({
			  dataType: "jsonp",
			  url: "https://api.instagram.com/v1/users/self?access_token="+instagram,
			  success: function(response){
			    var profile_picture = response['data']['profile_picture'];
			    $('.author[data-instagram="'+instagram+'"] .image').css('background-image', 'url(' + profile_picture + ')');
			  }
			});
		}
	});

	$('.controls').click(function(){
		var self = this;
		if ( $(self).hasClass('active') ) {
			var instagramId =	$(self).data('instagram-id');
			var user = $(self).data('user');
			$.ajax({                    
			  url: '/users/'+user+'/instagram/'+instagramId,     
			  type: 'post', // performing a POST request                 
			  success: function()         
			  {
			  	$(self).removeClass('active');
			  } 
			});
		} 
		else {
			var instagramId =	$(self).data('instagram-id');
			var standardRes =	$(self).data('standard-resolution');
			var user = $(self).data('user');
			console.log('JSON.stringify(standard-resolution): '+JSON.stringify(standardRes));
			$.ajax({                    
			  url: '/users/'+user+'/instagram',     
			  type: 'post', // performing a POST request
			  data : {
			    standardRes : standardRes,
			    instagramId : instagramId
			  },
			  dataType: 'json',                   
			  success: function(data)         
			  {
			  	$(self).addClass('active');
			  } 
			});
		}
	});

	$('#post-button').click(function(){
		$('.content-object, .content-items').removeClass('active');
		$(this).addClass('active');
		$('.posts').addClass('active');
	});
	$('#instagram-button').click(function(){
		$('.content-object, .content-items').removeClass('active');
		$(this).addClass('active');
		$('.instagrams').addClass('active');
	});	

  $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').stop().animate({
            scrollTop: target.offset().top
          }, 1000);
          $('.navigation').removeClass('active');
          $('.navigation-items').removeClass('active');
          return false;
        }
      }
  });

});