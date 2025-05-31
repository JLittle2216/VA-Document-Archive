(function() {var template = Handlebars.template, templates = $$WP.Templates = $$WP.Templates || {};templates = templates.Documents = templates.Documents || {};templates['AddressEntrySend'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return container.escapeExpression((helpers.setStringNamespace || (depth0 && depth0.setStringNamespace) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"documents.downloadmyrecord",{"name":"setStringNamespace","hash":{},"data":data}))
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.PreText : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div class=\"section downloadpopsection\">"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.showTabs : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<!-- start of main content --><div id=\"sendPopupTabContent\"><form>"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.directEnabled : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.emailEnabled : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div class=\"formbuttons\">"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.findProviderEnabled : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<input class=\"button multi nextstep sendManualEntryButton message active\" data-id=\"sendManualEntry\" value=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"SendButton",{"name":"getStringResource","hash":{},"data":data}))
    + "\" type=\"submit\" "
    + container.escapeExpression(((helper = (helper = helpers.disableIfInvalidAttribute || (depth0 != null ? depth0.disableIfInvalidAttribute : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"disableIfInvalidAttribute","hash":{},"data":data}) : helper)))
    + "></input><input class=\"button multi cancel cancelworkflow message active\" data-id=\"cancel\" value=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"CancelButtonText",{"name":"getStringResource","hash":{},"data":data}))
    + "\" type=\"button\"></input></div></form></div><!-- End Section Block --></div>"
    + container.escapeExpression(((helper = (helper = helpers.clearStringNamespace || (depth0 != null ? depth0.clearStringNamespace : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"clearStringNamespace","hash":{},"data":data}) : helper)));
},"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<p class=\"pretext\">"
    + container.escapeExpression(((helper = (helper = helpers.PreText || (depth0 != null ? depth0.PreText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"PreText","hash":{},"data":data}) : helper)))
    + "</p>";
},"3":function(container,depth0,helpers,partials,data) {
    return "<div class=\"innertabs navparent noprint\"><div class=\"navchild\" role=\"tablist\"><div class=\"membertab\"><a href=\"#\" class=\"bodyTextColor\" id=\"tab_topic_emailAddress\" data-id=\"tab_topic_emailAddress\" name=\"sendpopuptab\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"EmailAddressTabTitle",{"name":"getStringResource","hash":{},"data":data}))
    + "</a></div><div class=\"membertab\"><a href=\"#\" class=\"bodyTextColor\" id=\"tab_topic_directAddress\" data-id=\"tab_topic_directAddress\" name=\"sendpopuptab\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"DirectAddressTabTitle",{"name":"getStringResource","hash":{},"data":data}))
    + "</a></div></div></div>";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"section\" id=\"topic_directAddress\" tabindex=\"0\"><div id=\"directAddressPretext\"><h2 class=\"sendPopupHeader\" tabindex=\"-1\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"DirectAddressSubHeader",{"name":"getStringResource","hash":{},"data":data}))
    + "</h2><div class=\"pretext content\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"DirectAddressDescription",{"name":"getStringResource","hash":{},"data":data}))
    + container.escapeExpression((helpers.infoBubble || (depth0 && depth0.infoBubble) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(helpers.getDisplayString || (depth0 && depth0.getDisplayString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"WhatsThisDirectAddress",{"name":"getDisplayString","hash":{},"data":data}),(helpers.getDisplayString || (depth0 && depth0.getDisplayString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"WhatsThisDirectAddressContents",{"name":"getDisplayString","hash":{},"data":data}),{"name":"infoBubble","hash":{},"data":data}))
    + "</div></div><fieldset class=\"intab clearfieldset\"><label id=\"labelDirectAddressInput\" for=\"directAddressInput\" class=\"required\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"DirectAddressLabel",{"name":"getStringResource","hash":{},"data":data}))
    + "</label><input type=\"email\" data-id=\"directAddressInput\" id=\"directAddressInput\" name=\"directAddressInput\" data-addresstype=\"direct\" "
    + ((stack1 = (helpers.validationSettingsAttribute || (depth0 && depth0.validationSettingsAttribute) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.directAddressValidation : depth0),true,{"name":"validationSettingsAttribute","hash":{},"data":data})) != null ? stack1 : "")
    + "/>"
    + container.escapeExpression((helpers.messageDisplay || (depth0 && depth0.messageDisplay) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"directAddressInput",{"name":"messageDisplay","hash":{},"data":data}))
    + "<label id=\"labelConfirmDirectAddressInput\" for=\"confirmDirectAddressInput\" class=\"required\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"ConfirmDirectAddressLabel",{"name":"getStringResource","hash":{},"data":data}))
    + "</label><input type=\"email\" data-id=\"confirmDirectAddressInput\" id=\"confirmDirectAddressInput\" data-addresstype=\"direct\" class=\"forConfirmation\" name=\"confirmDirectAddressInput\" "
    + ((stack1 = (helpers.validationSettingsAttribute || (depth0 && depth0.validationSettingsAttribute) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.confirmDirectAddressValidation : depth0),true,{"name":"validationSettingsAttribute","hash":{},"data":data})) != null ? stack1 : "")
    + "/>"
    + container.escapeExpression((helpers.messageDisplay || (depth0 && depth0.messageDisplay) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"confirmDirectAddressInput",{"name":"messageDisplay","hash":{},"data":data}))
    + "</fieldset></div>";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"section\" id=\"topic_emailAddress\" tabindex=\"0\"><div id=\"emailAddressPretext\"><h2 class=\"sendPopupHeader\" tabindex=\"-1\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"EmailAddressSubHeader",{"name":"getStringResource","hash":{},"data":data}))
    + "</h2><div class=\"pretext content\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"EmailAddressDescription",{"name":"getStringResource","hash":{},"data":data}))
    + "</div></div><fieldset class=\"intab clearfieldset\"><label id=\"labelEmailAddressInput\" for=\"emailAddressInput\" class=\"required\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"EmailAddressLabel",{"name":"getStringResource","hash":{},"data":data}))
    + "</label><input type=\"email\" data-id=\"emailAddressInput\" id=\"emailAddressInput\" name=\"emailAddressInput\" "
    + ((stack1 = (helpers.validationSettingsAttribute || (depth0 && depth0.validationSettingsAttribute) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.emailAddressValidation : depth0),true,{"name":"validationSettingsAttribute","hash":{},"data":data})) != null ? stack1 : "")
    + "/>"
    + container.escapeExpression((helpers.messageDisplay || (depth0 && depth0.messageDisplay) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"emailAddressInput",{"name":"messageDisplay","hash":{},"data":data}))
    + "<label id=\"labelConfirmEmailAddressInput\" for=\"confirmEmailAddressInput\" class=\"required\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"ConfirmEmailAddressLabel",{"name":"getStringResource","hash":{},"data":data}))
    + "</label><input type=\"email\" data-id=\"confirmEmailAddressInput\" id=\"confirmEmailAddressInput\" class=\"forConfirmation\" name=\"confirmEmailAddressInput\" "
    + ((stack1 = (helpers.validationSettingsAttribute || (depth0 && depth0.validationSettingsAttribute) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.confirmEmailAddressValidation : depth0),true,{"name":"validationSettingsAttribute","hash":{},"data":data})) != null ? stack1 : "")
    + "/>"
    + container.escapeExpression((helpers.messageDisplay || (depth0 && depth0.messageDisplay) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"confirmEmailAddressInput",{"name":"messageDisplay","hash":{},"data":data}))
    + "</fieldset></div>";
},"9":function(container,depth0,helpers,partials,data) {
    return "<input class=\"button multi previousstep message active\" data-id=\"back\" value=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"BackButtonText",{"name":"getStringResource","hash":{},"data":data}))
    + "\" type=\"button\"></input>";
},"useData":true});})();