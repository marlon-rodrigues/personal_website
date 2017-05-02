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
	templateLoad('main-navigation', null, '#main-navigation', null);

		//load sub navigation 
	templateLoad('sub-navigation', null, '#sub-navigation', null);

		//load careers
	templateLoad('careers', null, '#careers', loadCareersSkillsSet);	


	function createCareersCarousel() {
		$('.careers-content-wrapper').owlCarousel({
			items: 1,
			nav: false
		});
	}

	function loadCareersSkillsSet() { 
		$('.skillbar').each(function() { 
			$(this).find('.skillbar-bar').animate({
				width:$(this).attr('data-percent')
			},6000);
		});
	}
});