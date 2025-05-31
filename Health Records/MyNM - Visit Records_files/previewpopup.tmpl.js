(function() {var template = Handlebars.template, templates = $$WP.Templates = $$WP.Templates || {};templates = templates.Documents = templates.Documents || {};templates['PreviewPopup'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression((helpers.setStringNamespace || (depth0 && depth0.setStringNamespace) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"documents.downloadmyrecord",{"name":"setStringNamespace","hash":{},"data":data}))
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.ShowMoreThanLucy : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div class=\"details\" id=\"iframeContent\" tabindex=\"-1\"><div class=\"inlineloading component documentSection\">"
    + container.escapeExpression((helpers.ajaxSpinner || (depth0 && depth0.ajaxSpinner) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),1,{"name":"ajaxSpinner","hash":{},"data":data}))
    + "</div>"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.ShowLucy : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.ShowMulti : depth0),{"name":"if","hash":{},"fn":container.program(25, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.ShowMoreThanLucy : depth0),{"name":"if","hash":{},"fn":container.program(30, data, 0),"inverse":container.program(32, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>";
},"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"menu\" id=\"previewPopupMenu\"><ul class=\"visitlist\">"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.ShowMultiOrLucy : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.ShowLucy : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.ShowMulti : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.ShowMultiOrLucy : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<li data-id=\"selectli\" data-index=\"-3\" class=\"listheaderelement\"><h3 class=\"listheaderelement\"><span class=\"SubMenuHeaders\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"PreviewSpecificVisitsHeaderText",{"name":"getStringResource","hash":{},"data":data}))
    + "</span></h3><ul class=\"specifiVisitInformation\" aria-label=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"PreviewSpecificVisitsHeaderText",{"name":"getStringResource","hash":{},"data":data}))
    + "\">"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.HasNoVisits : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.visitList : depth0),{"name":"each","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul></li></ul></div>";
},"2":function(container,depth0,helpers,partials,data) {
    return "<li data-id=\"selectli\" data-index=\"-3\" class=\"listheaderelement\" ><h3 class=\"listheaderelement\"><span class=\"SubMenuHeaders\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"PreviewSummariesHeaderText",{"name":"getStringResource","hash":{},"data":data}))
    + "</span></h3><ul class=\"overallHealthSummary\" aria-label=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"PreviewSummariesHeaderText",{"name":"getStringResource","hash":{},"data":data}))
    + "\" >";
},"4":function(container,depth0,helpers,partials,data) {
    return "<li data-id=\"selectli\"  data-index=\"-2\" class=\"listelement selected previewVisitElement\"><a href=\"#iframeContent\" class=\"anchorListElement clickable\" data-id=\"selectlianchor\" title=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"LucyRecordTitle",{"name":"getStringResource","hash":{},"data":data}))
    + "\" ><div class=\"col1\"><div class=\"visitIcon lucysummary\" alt=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"LucySummaryImgAltText",{"name":"getStringResource","hash":{},"data":data}))
    + "\"></div></div><div class=\"col2\"><span class=\"row name\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"LucyRecordText",{"name":"getStringResource","hash":{},"data":data}))
    + "</span></div></a></li>";
},"6":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<li data-id=\"selectli\" data-index=\"-1\" class=\"listelement previewVisitElement\"><a href=\"#iframeContent\" class=\"anchorListElement clickable\" data-id=\"selectlianchor\" title=\""
    + container.escapeExpression(((helper = (helper = helpers.MultiDateHeader || (depth0 != null ? depth0.MultiDateHeader : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"MultiDateHeader","hash":{},"data":data}) : helper)))
    + "\" ><div class=\"col1\"><div class=\"visitIcon multivisitsummary\" alt=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"MultiVisitImgAltText",{"name":"getStringResource","hash":{},"data":data}))
    + "\"></div></div><div class=\"col2\"><div><span class=\"row name\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"MultiRecordSummaryText",{"name":"getStringResource","hash":{},"data":data}))
    + "</span></div><div><span class=\"row other\">"
    + container.escapeExpression(((helper = (helper = helpers.MultiDateHeader || (depth0 != null ? depth0.MultiDateHeader : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"MultiDateHeader","hash":{},"data":data}) : helper)))
    + "</span></div></div></a></li>";
},"8":function(container,depth0,helpers,partials,data) {
    return "</ul></li>";
},"10":function(container,depth0,helpers,partials,data) {
    return "<li class=\"viewNoVisitsText\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"NoVisitsFound",{"name":"getStringResource","hash":{},"data":data}))
    + "</li>";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<li data-id=\"selectli\" data-index=\""
    + container.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"listelement previewVisitElement\"><a href=\"#iframeContent\" class=\"anchorListElement clickable\" data-id=\"selectlianchor\" ><div class=\"col1\">"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.IsAdmission : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "")
    + "</div><div class=\"col2\">"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.IsAdmission : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.program(19, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.Provider : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div></a></li>";
},"13":function(container,depth0,helpers,partials,data) {
    return "<div class=\"visitIcon admissionicon\" alt=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"HospitalVisitImgAltText",{"name":"getStringResource","hash":{},"data":data}))
    + "\"></div>";
},"15":function(container,depth0,helpers,partials,data) {
    return "<div class=\"date\">"
    + container.escapeExpression((helpers.verticalDateWithYear || (depth0 && depth0.verticalDateWithYear) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.DateOfMonth : depth0),(depth0 != null ? depth0.Month : depth0),(depth0 != null ? depth0.Year : depth0),{"name":"verticalDateWithYear","hash":{},"data":data}))
    + "</div>";
},"17":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div><span class=\"row name\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"HospitalVisitText",{"name":"getStringResource","hash":{},"data":data}))
    + "</span></div><div><span class=\"row other\">"
    + container.escapeExpression(((helper = (helper = helpers.DateTimeToShow || (depth0 != null ? depth0.DateTimeToShow : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"DateTimeToShow","hash":{},"data":data}) : helper)))
    + "</span></div>";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div><span class=\"row name\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.VisitType : depth0)) != null ? stack1.Name : stack1), depth0))
    + "</span></div>";
},"21":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div><span class=\"row other\">"
    + container.escapeExpression(((helper = (helper = helpers.Provider || (depth0 != null ? depth0.Provider : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"Provider","hash":{},"data":data}) : helper)))
    + "</span></div>";
},"23":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"ccdiframediv selected hidden\" data-index=\"-2\" ><iframe class=\"iframe\" src=\""
    + container.escapeExpression(((helper = (helper = helpers.lucyiframesrc || (depth0 != null ? depth0.lucyiframesrc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"lucyiframesrc","hash":{},"data":data}) : helper)))
    + "\" title=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"PreviewIFrameTitle",{"name":"getStringResource","hash":{},"data":data}))
    + "\"></iframe></div>";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"ccdiframediv selected hidden\" data-index=\"-1\"><iframe class=\"iframe\" src=\""
    + container.escapeExpression(((helper = (helper = helpers.altstartupsrc || (depth0 != null ? depth0.altstartupsrc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"altstartupsrc","hash":{},"data":data}) : helper)))
    + "\" title=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"PreviewIFrameTitle",{"name":"getStringResource","hash":{},"data":data}))
    + "\"></iframe></div>"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.visitList : depth0),{"name":"each","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"26":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"ccdiframediv hidden\" data-index=\""
    + container.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"index","hash":{},"data":data}) : helper)))
    + "\" ></div>";
},"28":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"ccdiframediv hidden\" data-index=\"0\" ><iframe class=\"iframe\" src=\""
    + container.escapeExpression(((helper = (helper = helpers.altstartupsrc || (depth0 != null ? depth0.altstartupsrc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"altstartupsrc","hash":{},"data":data}) : helper)))
    + "\" title=\""
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"PreviewIFrameTitle",{"name":"getStringResource","hash":{},"data":data}))
    + "\"></iframe></div>";
},"30":function(container,depth0,helpers,partials,data) {
    return "<a class=\"skiplink\" href=\"#previewPopupMenu\" style=\"position: absolute; right:0; bottom:0\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"BackToMenu",{"name":"getStringResource","hash":{},"data":data}))
    + "</a>";
},"32":function(container,depth0,helpers,partials,data) {
    return "<a class=\"skiplink\" href=\"#\" id=\"popupCloseAction\" style=\"position: absolute; right:0; bottom:0\">"
    + container.escapeExpression((helpers.getStringResource || (depth0 && depth0.getStringResource) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"PopupBackToPreviousPageButton",{"name":"getStringResource","hash":{},"data":data}))
    + "</a>";
},"useData":true});})();