	//load handlebars template
function templateLoad(templateName, dataSource, htmlNode, callback) { //TODO - VERIFY IF I NEED THE DATA SOURCE
	var templateFile = 'views/' + templateName + '.html';

	jQuery.get(templateFile, function(template) { 
		var renderedTemplate = Handlebars.compile(template);
		var result = renderedTemplate(dataSource);	

		jQuery(htmlNode).html(result);

		if(callback != null) { 
			callback();
		}
	});
}

$(document).ready(function(){
		//load site header
	templateLoad('site-header', null, '#site-header', null);
		
		//load main navigation 
	templateLoad('main-navigation', null, '#main-navigation', setupMainNavigation);

		//load sub navigation 
	templateLoad('sub-navigation', null, '#sub-navigation', setupSubNavigation);

		//load career
	templateLoad('career', null, '#career', loadcareerSkillsSet);	

		//load education
	templateLoad('education', null, '#education', loadcareerSkillsSet);	

	function setupMainNavigation() {
		$('.main-nav-item').click(function(e){
			if (!$(this).hasClass('active')) {
				e.preventDefault();

		    	$('.sub-navigation-item').slideUp('slow');
		    	$('.sub-navigation-item').removeClass('active');
		    	$('#' + $(this).attr('sub-nav')).slideDown('slow');
		    	$('#' + $(this).attr('sub-nav')).addClass('active');

		    	$('.main-nav-item').removeClass('active');
		    	$(this).addClass('active');

		    	var navSection = $(this).children('a').attr('href');

		    	$('html, body').animate({
				    scrollTop: $(navSection).offset().top - 200
				}, 750, function(){
		        	// Add hash (#) to URL when done scrolling (default click behavior)
		        	window.location.hash = navSection;
		      	});
		  	}
		});
	}

	function setupSubNavigation() {
		$('.sub-navigation-item .sub-navigation-body a').click(function(e){
		  	if($(this).attr("href") !== "") {
		  		e.preventDefault();

			  	var section = $(this).attr("href");

			  	$('html, body').animate({
				    scrollTop: $(section).offset().top - 200
				}, 750, function(){
		        	// Add hash (#) to URL when done scrolling (default click behavior)
		        	window.location.hash = section;
		      	});
		  	}
		});
	}


	function createcareerCarousel() {
		$('.career-content-wrapper').owlCarousel({
			items: 1,
			nav: false
		});
	}

	function loadcareerSkillsSet() { 
		$('.skillbar').each(function() { 
			$(this).find('.skillbar-bar').animate({
				width:$(this).attr('data-percent')
			},6000);
		});
	}
});