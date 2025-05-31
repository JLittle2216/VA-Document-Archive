(function() {var template = Handlebars.template, templates = $$WP.Templates = $$WP.Templates || {};templates = templates.Documents = templates.Documents || {};templates['SearchProviderSend'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return container.escapeExpression((helpers.setStringNamespace || (depth0 && depth0.setStringNamespace) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"documents.downloadmyrecord",{"name":"setStringNamespace","hash":{},"data":data}))
    + "<div id=\"popup\" class=\"section\"><a class=\"clickable focusanchor\" name=\"provSearchTopAnchor\"></a><div class=\"section providersearch\"><div id=\"SearchInfoContent\"><h2 class=\"sendPopupHeader\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"FindAProviderSearchSectionTitle",{"name":"getStringResource","hash":{},"data":data}))
    + "</h2><div class=\"p\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"FindAProviderSearchSectionPretext",{"name":"getStringResource","hash":{},"data":data}))
    + container.escapeExpression((helpers.infoBubble || (depth0 && depth0.infoBubble) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(helpers.getDisplayString || (depth0 && depth0.getDisplayString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"WhatsThisDirectAddress",{"name":"getDisplayString","hash":{},"data":data}),(helpers.getDisplayString || (depth0 && depth0.getDisplayString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"WhatsThisDirectAddressContents",{"name":"getDisplayString","hash":{},"data":data}),{"name":"infoBubble","hash":{},"data":data}))
    + "<p class=\"addressLink\"><a href=\"#\" class=\"link clickable\" data-id=\"linkToManualEntry\">"
    + container.escapeExpression(((helper = (helper = helpers.AddressLinkString || (depth0 != null ? depth0.AddressLinkString : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"AddressLinkString","hash":{},"data":data}) : helper)))
    + "</a></p><span class=\"required\"></span>"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"RequiredFieldHelpText",{"name":"getStringResource","hash":{},"data":data}))
    + "</div><div role=\"alert\" class=\"alert\"><span class=\"alert\" id=\"findprovidersearcherror\"></span></div><form id=\"sendProviderSendForm\" class=\"content\"><div class=\"formrow\"><label class=\"required\" for=\"lastNameInput\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"LastNameFieldLabel",{"name":"getStringResource","hash":{},"data":data}))
    + "</label><input type=\"text\" name=\"lastNameInput\" class=\"lastNameInput\" autocomplete=\"off\" data-id=\"lastNameForSearch\" id=\"lastNameInput\" "
    + ((stack1 = (helpers.validationSettingsAttribute || (depth0 && depth0.validationSettingsAttribute) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.Validation : depth0),(depth0 != null ? depth0.isInitiallyInvalid : depth0),{"name":"validationSettingsAttribute","hash":{},"data":data})) != null ? stack1 : "")
    + "></input>"
    + container.escapeExpression((helpers.messageDisplay || (depth0 && depth0.messageDisplay) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"lastNameInput",{"name":"messageDisplay","hash":{},"data":data}))
    + "</div><div class=\"noErrorMsgFormInput\"><label for=\"firstNameInput\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"FirstNameFieldLabel",{"name":"getStringResource","hash":{},"data":data}))
    + "</label><input type=\"text\" class=\"firstNameInput\" autocomplete=\"off\" data-id=\"firstNameForSearch\" id=\"firstNameInput\"></input></div><div class=\"noErrorMsgFormInput\"><label for=\"specialtyInput\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"SpecialtyFieldLabel",{"name":"getStringResource","hash":{},"data":data}))
    + "</label><select id=\"specialtyInput\" class=\"specialtyInput\" data-id=\"specialtyForSearch\"><option value=\"\"></option>"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.SpecialtyList : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</select></div><label class=\"required\" for=\"stateInput\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"StateFieldLabel",{"name":"getStringResource","hash":{},"data":data}))
    + "</label><select name=\"stateInput\" id=\"stateInput\" class=\"stateInput\" data-id=\"stateForSearch\" "
    + ((stack1 = (helpers.validationSettingsAttribute || (depth0 && depth0.validationSettingsAttribute) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.Validation : depth0),(depth0 != null ? depth0.isInitiallyInvalid : depth0),{"name":"validationSettingsAttribute","hash":{},"data":data})) != null ? stack1 : "")
    + ">><option value=\"\"></option>"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.StateList : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</select>"
    + container.escapeExpression((helpers.messageDisplay || (depth0 && depth0.messageDisplay) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"stateInput",{"name":"messageDisplay","hash":{},"data":data}))
    + "<div class=\"formbuttons\"><input class=\"button multi nextstep enterSearchButton\" type=\"submit\" value=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"SearchButton",{"name":"getStringResource","hash":{},"data":data}))
    + "\" data-id=\"searchForProviders\" "
    + container.escapeExpression(((helper = (helper = helpers.disableIfInvalidAttribute || (depth0 != null ? depth0.disableIfInvalidAttribute : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"disableIfInvalidAttribute","hash":{},"data":data}) : helper)))
    + "></input><input class=\"button multi cancel cancelworkflow\" value=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"CancelButtonText",{"name":"getStringResource","hash":{},"data":data}))
    + "\" type=\"button\" data-id=\"cancel\"></input></div></form></div><br />"
    + container.escapeExpression(((helper = (helper = helpers.ajaxSpinner || (depth0 != null ? depth0.ajaxSpinner : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ajaxSpinner","hash":{},"data":data}) : helper)))
    + "</div></div>"
    + container.escapeExpression(((helper = (helper = helpers.clearStringNamespace || (depth0 != null ? depth0.clearStringNamespace : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"clearStringNamespace","hash":{},"data":data}) : helper)));
},"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<option value=\""
    + container.escapeExpression(((helper = (helper = helpers.Number || (depth0 != null ? depth0.Number : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"Number","hash":{},"data":data}) : helper)))
    + "\">"
    + container.escapeExpression(((helper = (helper = helpers.Title || (depth0 != null ? depth0.Title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"Title","hash":{},"data":data}) : helper)))
    + "</option>";
},"useData":true});})();