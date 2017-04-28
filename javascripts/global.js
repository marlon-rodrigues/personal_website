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
		//load main navigation 
	templateLoad('main-navigation', null, '#main-navigation', null);
});