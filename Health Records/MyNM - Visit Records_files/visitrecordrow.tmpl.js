(function() {var template = Handlebars.template, templates = $$WP.Templates = $$WP.Templates || {};templates = templates.Documents = templates.Documents || {};templates['VisitRecordRow'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return container.escapeExpression((helpers.setStringNamespace || (depth0 && depth0.setStringNamespace) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"documents.downloadmyrecord",{"name":"setStringNamespace","hash":{},"data":data}))
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.VisitList : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = helpers.clearStringNamespace || (depth0 != null ? depth0.clearStringNamespace : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"clearStringNamespace","hash":{},"data":data}) : helper)));
},"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<tr id=\"visitRecords_row"
    + container.escapeExpression((helpers.addition || (depth0 && depth0.addition) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(data && data.index),((stack1 = (data && data.root)) && stack1.NextRowId),{"name":"addition","hash":{},"data":data}))
    + "\" class=\"singlevisitrow clickable\"><td headers=\"visitRecords_col0\" class=\"shortColumn\"><label class=\"clearlabel\" for=\"visitRecords_row"
    + container.escapeExpression((helpers.addition || (depth0 && depth0.addition) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(data && data.index),((stack1 = (data && data.root)) && stack1.NextRowId),{"name":"addition","hash":{},"data":data}))
    + "_select\" data-value=\""
    + container.escapeExpression(((helper = (helper = helpers.DateTimeToShow || (depth0 != null ? depth0.DateTimeToShow : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"DateTimeToShow","hash":{},"data":data}) : helper)))
    + "\">"
    + container.escapeExpression(((helper = (helper = helpers.DescriptionToShow || (depth0 != null ? depth0.DescriptionToShow : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"DescriptionToShow","hash":{},"data":data}) : helper)))
    + " - "
    + container.escapeExpression(((helper = (helper = helpers.SubtextToShow || (depth0 != null ? depth0.SubtextToShow : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"SubtextToShow","hash":{},"data":data}) : helper)))
    + " - "
    + container.escapeExpression(((helper = (helper = helpers.DateTimeToShow || (depth0 != null ? depth0.DateTimeToShow : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"DateTimeToShow","hash":{},"data":data}) : helper)))
    + "</label><input type=\"radio\" id=\"visitRecords_row"
    + container.escapeExpression((helpers.addition || (depth0 && depth0.addition) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(data && data.index),((stack1 = (data && data.root)) && stack1.NextRowId),{"name":"addition","hash":{},"data":data}))
    + "_select\" name=\"selectVisit\" value=\""
    + container.escapeExpression(((helper = (helper = helpers.Csn || (depth0 != null ? depth0.Csn : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"Csn","hash":{},"data":data}) : helper)))
    + "\" data-index=\""
    + container.escapeExpression((helpers.addition || (depth0 && depth0.addition) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(data && data.index),((stack1 = (data && data.root)) && stack1.NextRowId),{"name":"addition","hash":{},"data":data}))
    + "\" autocomplete=\"off\" /></td><td headers=\"visitRecords_col1\" class=\"singlevisitrowtext\" aria-hidden=\"true\"><span class=\"rowDateTime\">"
    + container.escapeExpression(((helper = (helper = helpers.DateTimeToShow || (depth0 != null ? depth0.DateTimeToShow : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"DateTimeToShow","hash":{},"data":data}) : helper)))
    + "</span><strong>"
    + container.escapeExpression(((helper = (helper = helpers.DescriptionToShow || (depth0 != null ? depth0.DescriptionToShow : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"DescriptionToShow","hash":{},"data":data}) : helper)))
    + "</strong><br /><span>"
    + container.escapeExpression(((helper = (helper = helpers.SubtextToShow || (depth0 != null ? depth0.SubtextToShow : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"SubtextToShow","hash":{},"data":data}) : helper)))
    + "</span></td></tr>";
},"useData":true});})();