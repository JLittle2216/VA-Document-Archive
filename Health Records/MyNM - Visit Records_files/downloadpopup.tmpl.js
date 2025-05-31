(function() {var template = Handlebars.template, templates = $$WP.Templates = $$WP.Templates || {};templates = templates.Documents = templates.Documents || {};templates['DownloadPopup'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return container.escapeExpression((helpers.setStringNamespace || (depth0 && depth0.setStringNamespace) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"documents.downloadmyrecord",{"name":"setStringNamespace","hash":{},"data":data}))
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.PreText : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div class=\"section downloadpopsection\"><!-- Start Section Block --><div id=\"vdtsidetab\" class=\"sidetab\">"
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.PasswordForced : depth0),{"name":"unless","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div class=\"tabcontent\">"
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.PasswordForced : depth0),{"name":"unless","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.PasswordForced : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div class=\"content\"><form><!-- Start Content Block --><div autocomplete=\"off\" method=\"post\" action=\""
    + container.escapeExpression(((helper = (helper = helpers.DownloadButtonLink || (depth0 != null ? depth0.DownloadButtonLink : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"DownloadButtonLink","hash":{},"data":data}) : helper)))
    + "\" name=\"ccdform\" id=\"ccdform\"><div id=\"usePwd\" class=\"hidden\"><div class=\"hidden\"><input type=\"hidden\" name=\"doencrypt\" id=\"doencrypt\" value=\"false\" autocomplete=\"off\"/><input type=\"hidden\" name=\"mode\" id=\"mode\" value=\""
    + container.escapeExpression(((helper = (helper = helpers.mode || (depth0 != null ? depth0.mode : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"mode","hash":{},"data":data}) : helper)))
    + "\" autocomplete=\"off\"/><input type=\"hidden\" name=\"csn\" id=\"csn\" value=\""
    + container.escapeExpression(((helper = (helper = helpers.csn || (depth0 != null ? depth0.csn : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"csn","hash":{},"data":data}) : helper)))
    + "\" autocomplete=\"off\"/><input type=\"hidden\" name=\"startdate\" id=\"startdate\" value=\""
    + container.escapeExpression(((helper = (helper = helpers.startDate || (depth0 != null ? depth0.startDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"startDate","hash":{},"data":data}) : helper)))
    + "\" autocomplete=\"off\"/><input type=\"hidden\" name=\"enddate\" id=\"enddate\" value=\""
    + container.escapeExpression(((helper = (helper = helpers.endDate || (depth0 != null ? depth0.endDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"endDate","hash":{},"data":data}) : helper)))
    + "\" autocomplete=\"off\"/><input type=\"hidden\" name=\"enccount\" id=\"enccount\" value=\""
    + container.escapeExpression(((helper = (helper = helpers.EncCount || (depth0 != null ? depth0.EncCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"EncCount","hash":{},"data":data}) : helper)))
    + "\" autocomplete=\"off\"/><input type=\"hidden\" name=\"encdate\" id=\"encdate\" value=\""
    + container.escapeExpression(((helper = (helper = helpers.EncDate || (depth0 != null ? depth0.EncDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"EncDate","hash":{},"data":data}) : helper)))
    + "\" autocomplete=\"off\"/></div><fieldset class=\"intab clearfieldset\"><legend class=\"clearlabel\" aria-describedby=\"passwordhelptext\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"PasswordProtectLegend",{"name":"getStringResource","hash":{},"data":data}))
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"DocumentPasswordHelpText",{"name":"getStringResource","hash":{},"data":data}))
    + "</legend><label for=\"documentpassword\" class=\"required\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"DocumentPasswordLabel",{"name":"getStringResource","hash":{},"data":data}))
    + "</label><input type=\"password\" data-id=\"documentpassword\" id=\"documentpassword\" name=\"documentpassword\" autocomplete=\"new-password\"  data-invalid=\"true\" "
    + ((stack1 = (helpers.validationSettingsAttribute || (depth0 && depth0.validationSettingsAttribute) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.documentpasswordValidation : depth0),true,{"name":"validationSettingsAttribute","hash":{},"data":data})) != null ? stack1 : "")
    + " /><p id=\"passwordhelptext\" class=\"helptext\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"DocumentPasswordHelpText",{"name":"getStringResource","hash":{},"data":data}))
    + "</p>"
    + container.escapeExpression((helpers.messageDisplay || (depth0 && depth0.messageDisplay) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"documentpassword",{"name":"messageDisplay","hash":{},"data":data}))
    + "<label for=\"passwordverify\" class=\"required\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"PasswordVerify",{"name":"getStringResource","hash":{},"data":data}))
    + "</label><input type=\"password\" data-id=\"passwordverify\" id=\"passwordverify\" name=\"passwordverify\" autocomplete=\"new-password\"  data-invalid=\"true\" "
    + ((stack1 = (helpers.validationSettingsAttribute || (depth0 && depth0.validationSettingsAttribute) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.passwordverifyValidation : depth0),true,{"name":"validationSettingsAttribute","hash":{},"data":data})) != null ? stack1 : "")
    + "/>"
    + container.escapeExpression((helpers.messageDisplay || (depth0 && depth0.messageDisplay) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"passwordverify",{"name":"messageDisplay","hash":{},"data":data}))
    + "</fieldset></div><div class=\"formbuttons\"><input class=\"button completeworkflow\" id=\"downloadbtn\" name=\"downloadbtn\" type=\"submit\" value=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"DownloadButtonLabel",{"name":"getStringResource","hash":{},"data":data}))
    + "\" data-id=\"download_button\" tabindex=\"0\" "
    + container.escapeExpression(((helper = (helper = helpers.disableIfInvalidAttribute || (depth0 != null ? depth0.disableIfInvalidAttribute : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"disableIfInvalidAttribute","hash":{},"data":data}) : helper)))
    + " ></input><input class=\"button multi cancel cancelworkflow\" value=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"CancelButtonText",{"name":"getStringResource","hash":{},"data":data}))
    + "\" type=\"button\" data-id=\"cancel\"></input></div><!-- End Content Block --></div></form></div><div id=\"showondownload\" class=\"hidden\"><p>"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"WaitText",{"name":"getStringResource","hash":{},"data":data}))
    + "</p>"
    + container.escapeExpression((helpers.ajaxSpinner || (depth0 && depth0.ajaxSpinner) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),1,{"name":"ajaxSpinner","hash":{},"data":data}))
    + "</div></div></div><!-- End Section Block --></div>"
    + container.escapeExpression(((helper = (helper = helpers.clearStringNamespace || (depth0 != null ? depth0.clearStringNamespace : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"clearStringNamespace","hash":{},"data":data}) : helper)));
},"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<p class=\"pretext\">"
    + container.escapeExpression(((helper = (helper = helpers.PreText || (depth0 != null ? depth0.PreText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"PreText","hash":{},"data":data}) : helper)))
    + "</p>";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.PasswordEnabled : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<ul class=\"sectiontabs\" role=\"tablist\"><li id=\"li_open\" class=\"selected\" data-id=\"li_open\" tabindex=\"0\" role=\"tab\" aria-selected=\"true\"><a class=\"clickable\"><img alt=\"\" src=\""
    + container.escapeExpression(((helper = (helper = helpers.OpenHealthRecordImage || (depth0 != null ? depth0.OpenHealthRecordImage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"OpenHealthRecordImage","hash":{},"data":data}) : helper)))
    + "\"/><div class=\"downloadicontext\"><span>"
    + container.escapeExpression(((helper = (helper = helpers.TabText || (depth0 != null ? depth0.TabText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"TabText","hash":{},"data":data}) : helper)))
    + "</span></div></a></li><li id=\"li_protect\" data-id=\"li_protect\" tabindex=\"0\" role=\"tab\" aria-selected=\"false\"><a class=\"clickable\"><img alt=\"\" src=\""
    + container.escapeExpression(((helper = (helper = helpers.ProtectedHealthRecordImage || (depth0 != null ? depth0.ProtectedHealthRecordImage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ProtectedHealthRecordImage","hash":{},"data":data}) : helper)))
    + "\"/><div class=\"downloadicontext\">"
    + container.escapeExpression(((helper = (helper = helpers.TabText || (depth0 != null ? depth0.TabText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"TabText","hash":{},"data":data}) : helper)))
    + "<span style=\"white-space: pre-line\" class=\"subtitle\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"ProtectedHealthRecordSub",{"name":"getStringResource","hash":{},"data":data}))
    + "</span></div></a></li></ul>";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.PasswordEnabled : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div id=\"noprotectionpretext\"><p class=\"pretext\">"
    + container.escapeExpression(((helper = (helper = helpers.OpenVisitSummaryPreText || (depth0 != null ? depth0.OpenVisitSummaryPreText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"OpenVisitSummaryPreText","hash":{},"data":data}) : helper)))
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"NoProtectionPreText",{"name":"getStringResource","hash":{},"data":data}))
    + "</p></div><div id=\"protectionpretext\" class=\"hidden\"><p class=\"pretext\">"
    + container.escapeExpression(((helper = (helper = helpers.ProtectedVisitSummaryPreText || (depth0 != null ? depth0.ProtectedVisitSummaryPreText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ProtectedVisitSummaryPreText","hash":{},"data":data}) : helper)))
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"ProtectionPreText",{"name":"getStringResource","hash":{},"data":data}))
    + "</p></div>";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div id=\"protectionpretext\"><p class=\"pretext\">"
    + container.escapeExpression(((helper = (helper = helpers.ProtectedVisitSummaryPreText || (depth0 != null ? depth0.ProtectedVisitSummaryPreText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ProtectedVisitSummaryPreText","hash":{},"data":data}) : helper)))
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"ProtectionPreText",{"name":"getStringResource","hash":{},"data":data}))
    + "</p></div>";
},"useData":true});})();