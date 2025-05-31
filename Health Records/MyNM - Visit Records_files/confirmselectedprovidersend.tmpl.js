(function() {var template = Handlebars.template, templates = $$WP.Templates = $$WP.Templates || {};templates = templates.Documents = templates.Documents || {};templates['ConfirmSelectedProviderSend'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return container.escapeExpression((helpers.setStringNamespace || (depth0 && depth0.setStringNamespace) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"documents.downloadmyrecord",{"name":"setStringNamespace","hash":{},"data":data}))
    + "<div class=\"DisplaySelectedProviderContent section\" id=\"DisplaySelectedProviderContent\"><a class=\"focusanchor clickable\" name=\"selectedProvTopAnchor\"></a><div class=\"section\" id=\"ProviderSelectionDisplay\"><div class=\"selectedProviderView\"><div><p>"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"SendVisitSummaryConfirmationLabel",{"name":"getStringResource","hash":{},"data":data}))
    + "</p></div><ul class=\"selectedProviderView\"><li data-id=\"selectli\" data-index=\""
    + container.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"listOfProviders card\"><a class=\"contactcard\"><div class=\"titlebar providerName\"><span class=\"name\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.SelectedProvider : depth0)) != null ? stack1.DisplayName : stack1), depth0))
    + "</span></div><div class=\"providerDetails\">"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.SelectedProvider : depth0)) != null ? stack1.Organization : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.SelectedProvider : depth0)) != null ? stack1.ShowDirectAddress : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.SelectedProvider : depth0)) != null ? stack1.Address : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.SelectedProvider : depth0)) != null ? stack1.SpecialtyCategories : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</a></li></ul></div></div><div class=\"formbuttons\"><input class=\"button multi previousstep message active\" data-id=\"backToSearchResults\" value=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"BackButtonText",{"name":"getStringResource","hash":{},"data":data}))
    + "\" type=\"submit\"></input><input class=\"button multi nextstep sendDirectToProvider message active\" data-id=\"sendDirectToProvider\" value=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"SendButton",{"name":"getStringResource","hash":{},"data":data}))
    + "\" type=\"submit\"></input><input class=\"button multi cancel cancelworkflow message active\" data-id=\"cancel\" value=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"CancelButtonText",{"name":"getStringResource","hash":{},"data":data}))
    + "\" type=\"submit\"></input></div><a class=\"clearlabel clickable\" name=\"selectProvBottomAnchor\" data-id=\"endanchor\"></a></div>"
    + container.escapeExpression(((helper = (helper = helpers.clearStringNamespace || (depth0 != null ? depth0.clearStringNamespace : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"clearStringNamespace","hash":{},"data":data}) : helper)));
},"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<span class=\"organization\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.SelectedProvider : depth0)) != null ? stack1.Organization : stack1), depth0))
    + "</span><br/>";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<span class=\"directaddress\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.SelectedProvider : depth0)) != null ? stack1.DirectAddress : stack1), depth0))
    + "</span>";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"address\"><span class=\"header\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"AddressContactCardHeader",{"name":"getStringResource","hash":{},"data":data}))
    + "</span>"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.SelectedProvider : depth0)) != null ? stack1.Address : stack1),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"6":function(container,depth0,helpers,partials,data) {
    return "<span class=\"addressline\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</span><br/>";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"specialties\"><span class=\"header\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"SpecialtiesContactCardHeader",{"name":"getStringResource","hash":{},"data":data}))
    + "</span>"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.SelectedProvider : depth0)) != null ? stack1.SpecialtyCategories : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"9":function(container,depth0,helpers,partials,data) {
    return "<span class=\"specialty\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</span><br/>";
},"useData":true});})();