(function() {var template = Handlebars.template, templates = $$WP.Templates = $$WP.Templates || {};templates = templates.Documents = templates.Documents || {};templates['SelectProviderSend'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return container.escapeExpression((helpers.setStringNamespace || (depth0 && depth0.setStringNamespace) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"documents.downloadmyrecord",{"name":"setStringNamespace","hash":{},"data":data}))
    + "<div class=\"DisplayFindProviderSearchResultsContent section\" id=\"DisplayFindProviderSearchResultsContent\"><a class=\"focusanchor clickable\" name=\"selectProvTopAnchor\" title=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"ShowingProviderSearchResultsText",{"name":"getStringResource","hash":{},"data":data}))
    + "\"></a><div class=\"section\" id=\"ProviderResultsDisplay\"><h2>"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"FindAProviderSelectSectionTitle",{"name":"getStringResource","hash":{},"data":data}))
    + "</h2><div class=\"p content\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"FindAProviderSelectSectionPretext",{"name":"getStringResource","hash":{},"data":data}))
    + container.escapeExpression((helpers.infoBubble || (depth0 && depth0.infoBubble) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(helpers.getDisplayString || (depth0 && depth0.getDisplayString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"WhatsThisDirectAddress",{"name":"getDisplayString","hash":{},"data":data}),(helpers.getDisplayString || (depth0 && depth0.getDisplayString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"WhatsThisDirectAddressContents",{"name":"getDisplayString","hash":{},"data":data}),{"name":"infoBubble","hash":{},"data":data}))
    + "<p class=\"addressLink\"><a href=\"#\" class=\"link clickable\" data-id=\"linkToManualEntry\">"
    + container.escapeExpression(((helper = (helper = helpers.AddressLinkString || (depth0 != null ? depth0.AddressLinkString : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"AddressLinkString","hash":{},"data":data}) : helper)))
    + "</a></p></div><div class=\"listOfProviders\"><ul class=\"listOfProviders list hoverable cardlist matchHeights column_2\">"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.DisplayProviders : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul></div></div><div class=\"afterList sendingspinnerdiv\">"
    + container.escapeExpression(((helper = (helper = helpers.ajaxSpinner || (depth0 != null ? depth0.ajaxSpinner : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ajaxSpinner","hash":{},"data":data}) : helper)))
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.HasNoData : depth0),{"name":"unless","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<br></br></div><div class=\"formbuttons selectproviderbuttons\"><input class=\"button multi previousstep message active\" data-id=\"back\" value=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"BackButtonText",{"name":"getStringResource","hash":{},"data":data}))
    + "\" type=\"submit\"></input><input class=\"button multi cancel cancelworkflow message active\" data-id=\"cancel\" value=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"CancelButtonText",{"name":"getStringResource","hash":{},"data":data}))
    + "\" type=\"submit\" tabindex=\"0\"></input></div><a class=\"clearlabel clickable\" name=\"selectProvBottomAnchor\" data-id=\"endanchor\"></a></div>"
    + container.escapeExpression(((helper = (helper = helpers.clearStringNamespace || (depth0 != null ? depth0.clearStringNamespace : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"clearStringNamespace","hash":{},"data":data}) : helper)));
},"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<li data-id=\"selectedProvider\" data-index=\""
    + container.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"listOfProviders card clickable\"><a class=\"contactcard\" data-id=\"selectedProvider\" role=\"link\" tabindex=\"0\"><div class=\"titlebar providerName\"><span class=\"name\">"
    + container.escapeExpression(((helper = (helper = helpers.DisplayName || (depth0 != null ? depth0.DisplayName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"DisplayName","hash":{},"data":data}) : helper)))
    + "</span></div><div class=\"providerDetails\">"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.Organization : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.ShowDirectAddress : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div><div class=\"address\"><span class=\"header\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"AddressContactCardHeader",{"name":"getStringResource","hash":{},"data":data}))
    + "</span>"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.Address : depth0),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.SpecialtyCategories : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</a></li>";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"organization\">"
    + container.escapeExpression(((helper = (helper = helpers.Organization || (depth0 != null ? depth0.Organization : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"Organization","hash":{},"data":data}) : helper)))
    + "</span><br/>";
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"directaddress\">"
    + container.escapeExpression(((helper = (helper = helpers.DirectAddress || (depth0 != null ? depth0.DirectAddress : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"DirectAddress","hash":{},"data":data}) : helper)))
    + "</span>";
},"6":function(container,depth0,helpers,partials,data) {
    return "<span class=\"addressline\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</span><br/>";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"specialties\"><span class=\"header\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"SpecialtiesContactCardHeader",{"name":"getStringResource","hash":{},"data":data}))
    + "</span>"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.SpecialtyCategories : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"9":function(container,depth0,helpers,partials,data) {
    return "<span class=\"specialty\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</span><br/>";
},"11":function(container,depth0,helpers,partials,data) {
    return "<div class=\"loadMoreProvidersPrompt\"><a class=\"loadmore loadMoreProvidersPrompt clickable\" data-id=\"loadmore\" role=\"button\"><span class=\"active\" tabindex=\"0\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"LoadMoreProvidersPrompt",{"name":"getStringResource","hash":{},"data":data}))
    + "</span></a></div>";
},"useData":true});})();