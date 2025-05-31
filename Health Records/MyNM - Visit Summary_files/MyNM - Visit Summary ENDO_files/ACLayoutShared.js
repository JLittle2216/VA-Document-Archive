/*global document, ro */
//---------------------------------------------
// Copyright 2016-2022 Epic Systems Corporation
// Title: ACLayoutShared.js
// Purpose: Shared object with various functions
//			needed by Layout Features.
//
//			This functionality relies on PDFReactor:
//			http://www.pdfreactor.com/
// Author: Danny Smith
// Revision History:
//   *DS   2/16 T15558 - Created
//   *JRM  6/16 T19560 - Fix positioning of debug div
//                       when there are stacked languages
//   *DS   7/16 T20455 - Add getPageContentWidth
//   *GMJ  9/16 436702 - Return correct stylesheet path for MyChart
//   *JRM 10/16 431837 - Add loadCSS
//   *MBM 03/17 454064 - Create HSWeb file and modify paths returned for HSWeb
//   *JRM 05/17 481476 - Add some handling for passing in of elements that have no boxes
//   *SDS 06/19 618848 - Update the styling of debug info
//   *SDS 02/20 668550 - Switch to querySelectorAll
//   *SDS 03/20 763646 - Update script path for HSWeb
//   *SDS 04/21 775397 - Add getBothColumns
//   *NRP 09/21 820255 - Fix reference to MyChartLocale
//   *SDS 03/22 871554 - Add round function
//---------------------------------------------

var $$layoutShared = {
	__debugDiv: null,
	__currentDebugUL: null,

	loadCSS: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$loadCSS(CSSName)
	{
		/// <summary>Checks if the CSS is in the head, if not, adds it</summary>
		var css;
		if (document.getElementById(CSSName + "CSS") == null)
		{
			if (this.__debugMode)
			{
				this.addDebugStatement("Adding " + CSSName + ".css");
			}
			css = document.createElement("link");
			css.rel = "stylesheet";
			css.type = "text/css";
			css.id = CSSName + "CSS";
			css.href = this.getStylesheetPath() + CSSName + ".css";
			document.head.appendChild(css);
		}
	},

	createDebugDiv: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$createDebugDiv()
	{
		var header, bothColumns;

		this.__debugDiv = document.getElementById("PluginDebugDiv");

		if (this.__debugDiv)
		{
			this.__currentDebugUL = this.__debugDiv.firstChild;
			return;
		}
		else
		{
			this.__debugDiv = document.createElement("div");
			this.__debugDiv.id = "PluginDebugDiv";

			header = document.createElement("h2");
			header.innerHTML = "Report Plugin Debug Info";

			this.__debugDiv.appendChild(header);

			this.__currentDebugUL = document.createElement("ul");
			this.__currentDebugUL.style.listStyleType = "none";
			this.__debugDiv.appendChild(this.__currentDebugUL);

			bothColumns = document.body.querySelectorAll(".bothColumns");
			if (bothColumns)
			{
				bothColumns[bothColumns.length - 1].appendChild(this.__debugDiv);
			}
			else
			{
				document.body.insertBefore(this.__debugDiv, document.body.firstChild);
			}
		}
	},

	addDebugStatement: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$addDebugStatement(statement)
	{
		var debugLI, caller;

		if (!this.__debugDiv || !this.__currentDebugUL)
		{
			this.createDebugDiv();
		}

		caller = this.__getCaller(arguments);

		debugLI = document.createElement("li");
		debugLI.innerHTML = "<span style='color: #5e717a;'>" + caller + ":</span> " + statement;
		this.__currentDebugUL.appendChild(debugLI);
	},

	startDebugLevel: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$startDebugLevel(title)
	{
		var debugLI, debugNestedLevel, caller;

		if (!this.__debugDiv)
		{
			this.createDebugDiv();
		}

		caller = this.__getCaller(arguments);

		//Create an LI with a nested UL
		debugLI = document.createElement("li");
		debugLI.innerHTML = "<span style='color: #5e717a;'>" + caller + ":</span> " + title;
		debugNestedLevel = document.createElement("ul");
		debugNestedLevel.style.listStyleType = "none";
		debugLI.appendChild(debugNestedLevel);
		this.__currentDebugUL.appendChild(debugLI);

		//Point current debug list to the nested list
		this.__currentDebugUL = debugNestedLevel;

	},

	__getCaller: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$__getCaller(funcArguments)
	{
		var caller, callerInfo;
		caller = arguments.callee.caller.caller.toString().match(/function ([^\(]+)/)[1];
		callerInfo = caller.split("$");
		caller = callerInfo[callerInfo.length - 2] + "." + callerInfo[callerInfo.length - 1];
		return caller;
	},

	endDebugLevel: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$endDebugLevel()
	{
		if (this.__currentDebugUL && this.__currentDebugUL.parentNode && this.__currentDebugUL.parentNode.parentNode)
		{
			this.__currentDebugUL = this.__currentDebugUL.parentNode.parentNode;
		}
	},

	getBothColumns: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getBothColumns()
	{
		/// <summary>Finds the primary bothColumns element that contains the report content</summary>
		/// <returns type="Element">The bothColumns element to use</returns>
		return document.querySelector(".bothColumns[data-plugins]");
	},

	getElementTop: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getElementTop(element, type)
	{
		/// <summary>Returns the element's top (in pixels). For multiple regions, returns the top of the first region.</summary>
		/// <param name="element" type="HTMLElement">Element to find the top</param>
		/// <param name="type" type="Number">0: Content rectangle (no padding, border or margin), 1: Padding rectangle (no border or margin), 2: Border rectangle (no margin), 3: Margin rectangle (includes everything)</param>
		/// <returns type="Number">Top of element (in pixels)</returns>
		var top, regions;

		if (element)
		{
			if (this.canUsePDFReactor())
			{
				regions = this.__getElementRegions(element);

				if (regions.length == 0)
				{
					return 0;
				}

				switch (type)
				{
					case 0:
						top = regions[0].contentRect.top;
						break;
					case 1:
						top = regions[0].paddingRect.top;
						break;
					case 2:
						top = regions[0].borderRect.top;
						break;
					case 3:
						top = regions[0].marginRect.top;
						break;
					default:
						top = 0;
						break;
				}
			}
			else
			{
				switch (type)
				{
					case 0:
						top = element.offsetTop + parseInt(getComputedStyle(element).getPropertyValue("padding-top")) + element.clientTop + parseInt(getComputedStyle(element).getPropertyValue("margin-top"));
						break;
					case 1:
						top = element.offsetTop + element.clientTop + parseInt(getComputedStyle(element).getPropertyValue("margin-top"));
						break;
					case 2:
						top = element.offsetTop + parseInt(getComputedStyle(element).getPropertyValue("margin-top"));
						break;
					case 3:
						top = element.offsetTop;
						break;
					default:
						top = 0;
						break;
				}
			}
		}

		return top;
	},

	getElementLeft: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getElementLeft(element, type)
	{
		/// <summary>Returns the element's left (in pixels). For multiple regions, it will be the left-most value.</summary>
		/// <param name="element" type="HTMLElement">Element to find the left</param>
		/// <param name="type" type="Number">0: Content rectangle (no padding, border or margin), 1: Padding rectangle (no border or margin), 2: Border rectangle (no margin), 3: Margin rectangle (includes everything)</param>
		/// <returns type="Number">Left of element (in pixels)</returns>
		var left, regions, currLeft;

		if (element)
		{
			if (this.canUsePDFReactor())
			{
				regions = this.__getElementRegions(element);

				for (var i = 0; i < regions.length; i++)
				{
					switch (type)
					{
						case 0:
							currLeft = regions[i].contentRect.left;
							break;
						case 1:
							currLeft = regions[i].paddingRect.left;
							break;
						case 2:
							currLeft = regions[i].borderRect.left;
							break;
						case 3:
							currLeft = regions[i].marginRect.left;
							break;
						default:
							currLeft = 0;
							break;
					}

					if (left == null || currLeft < left)
					{
						left = currLeft;
					}
				}
			}
			else
			{
				switch (type)
				{
					case 0:
						left = element.offsetLeft + parseInt(getComputedStyle(element).getPropertyValue("padding-left")) + element.clientLeft + parseInt(getComputedStyle(element).getPropertyValue("margin-left"));
						break;
					case 1:
						left = element.offsetLeft + element.clientLeft + parseInt(getComputedStyle(element).getPropertyValue("margin-left"));
						break;
					case 2:
						left = element.offsetLeft + parseInt(getComputedStyle(element).getPropertyValue("margin-left"));
						break;
					case 3:
						left = element.offsetLeft;
						break;
					default:
						left = 0;
						break;
				}
			}
		}

		return left;
	},

	getElementRight: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getElementRight(element, type)
	{
		/// <summary>Returns the element's right (in pixels). For multiple regions, this will be the right-most value.</summary>
		/// <param name="element" type="HTMLElement">Element to find the right</param>
		/// <param name="type" type="Number">0: Content rectangle (no padding, border or margin), 1: Padding rectangle (no border or margin), 2: Border rectangle (no margin), 3: Margin rectangle (includes everything)</param>
		/// <returns type="Number">Right of element (in pixels)</returns>
		var right, regions, currRight;

		if (element)
		{
			if (this.canUsePDFReactor())
			{
				regions = this.__getElementRegions(element);

				for (var i = 0; i < regions.length; i++)
				{
					switch (type)
					{
						case 0:
							currRight = regions[i].contentRect.right;
							break;
						case 1:
							currRight = regions[i].paddingRect.right;
							break;
						case 2:
							currRight = regions[i].borderRect.right;
							break;
						case 3:
							currRight = regions[i].marginRect.right;
							break;
						default:
							currRight = 0;
							break;
					}

					if (currRight > right)
					{
						right = currRight;
					}
				}
			}
			else
			{
				right = $$layoutShared.getElementLeft(element, type) + $$layoutShared.getElementWidth(element, type);
			}
		}

		return right;
	},

	getElementHeight: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getElementHeight(element, type)
	{
		/// <summary>Returns the element's height (in pixels). For multiple regions, returns the sum of heights for all regions</summary>
		/// <param name="element" type="HTMLElement">Element to find the height</param>
		/// <param name="type" type="Number">0: Content rectangle (no padding, border or margin), 1: Padding rectangle (no border or margin), 2: Border rectangle (no margin), 3: Margin rectangle (includes everything)</param>
		/// <returns type="Number">Height of element (in pixels)</returns>
		var totalHeight, regions, height;
		totalHeight = 0;

		if (element)
		{
			if (this.canUsePDFReactor())
			{
				regions = this.__getElementRegions(element);
				for (var i = 0; i < regions.length; i++)
				{
					switch (type)
					{
						case 0:
							height = regions[i].contentRect.height;
							break;
						case 1:
							height = regions[i].paddingRect.height;
							break;
						case 2:
							height = regions[i].borderRect.height;
							break;
						case 3:
							height = regions[i].marginRect.height;
							break;
						default:
							height = 0;
							break;
					}
					totalHeight += height;
				}
			}
			else
			{
				switch (type)
				{
					case 0:
						totalHeight = parseInt(getComputedStyle(element).getPropertyValue("height"));
						break;
					case 1:
						totalHeight = parseInt(getComputedStyle(element).getPropertyValue("height")) + parseInt(getComputedStyle(element).getPropertyValue("padding-top")) + parseInt(getComputedStyle(element).getPropertyValue("padding-bottom"));
						break;
					case 2:
						totalHeight = element.offsetHeight;
						break;
					case 3:
						totalHeight = element.offsetHeight + parseInt(getComputedStyle(element).getPropertyValue("margin-top")) + parseInt(getComputedStyle(element).getPropertyValue("margin-bottom"));
						break;
					default:
						totalHeight = 0;
						break;
				}
			}
		}

		return totalHeight;
	},

	getElementWidth: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getElementWidth(element, type)
	{
		/// <summary>Returns the element's width (in pixels). For multiple regions, returns the width of the widest region.</summary>
		/// <param name="element" type="HTMLElement">Element to find the width</param>
		/// <param name="type" type="Number">0: Content rectangle (no padding, border or margin), 1: Padding rectangle (no border or margin), 2: Border rectangle (no margin), 3: Margin rectangle (includes everything)</param>
		/// <returns type="Number">Width of element (in pixels)</returns>
		var currWidth, regions, width;

		if (element)
		{
			if (this.canUsePDFReactor())
			{
				regions = this.__getElementRegions(element);
				width = 0;
				for (var i = 0; i < regions.length; i++)
				{
					switch (type)
					{
						case 0:
							currWidth = regions[i].contentRect.width;
							break;
						case 1:
							currWidth = regions[i].paddingRect.width;
							break;
						case 2:
							currWidth = regions[i].borderRect.width;
							break;
						case 3:
							currWidth = regions[i].marginRect.width;
							break;
						default:
							currWidth = 0;
							break;
					}
					if (currWidth > width)
					{
						width = currWidth;
					}
				}
			}
			else
			{
				switch (type)
				{
					case 0:
						width = parseInt(getComputedStyle(element).getPropertyValue("width"));
						break;
					case 1:
						width = parseInt(getComputedStyle(element).getPropertyValue("width")) + parseInt(getComputedStyle(element).getPropertyValue("padding-left")) + parseInt(getComputedStyle(element).getPropertyValue("padding-right"));
						break;
					case 2:
						width = element.offsetWidth;
						break;
					case 3:
						width = element.offsetWidth + parseInt(getComputedStyle(element).getPropertyValue("margin-left")) + parseInt(getComputedStyle(element).getPropertyValue("margin-right"));
						break;
					default:
						width = 0;
						break;
				}
			}
		}

		return width;
	},

	getElementBottom: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getElementBottom(element, type)
	{
		/// <summary>Returns the element's bottom position (in pixels). For multiple regions, returns the bottom position of the last region.</summary>
		/// <param name="element" type="HTMLElement">Element to find the bottom position</param>
		/// <param name="type" type="Number">0: Content rectangle (no padding, border or margin), 1: Padding rectangle (no border or margin), 2: Border rectangle (no margin), 3: Margin rectangle (includes everything)</param>
		/// <returns type="Number">Bottom of element (in pixels)</returns>
		var regions;

		if (element)
		{
			if (this.canUsePDFReactor())
			{
				regions = this.__getElementRegions(element);

				if (regions.length == 0)
				{
					return 0;
				}

				switch (type)
				{
					case 0:
						return regions[regions.length - 1].contentRect.bottom;
						break;
					case 1:
						return regions[regions.length - 1].paddingRect.bottom;
						break;
					case 2:
						return regions[regions.length - 1].borderRect.bottom;
						break;
					case 3:
						return regions[regions.length - 1].marginRect.bottom;
						break;
					default:
						return 0;
						break;
				}
			}
			else
			{
				return $$layoutShared.getElementTop(element, type) + $$layoutShared.getElementHeight(element, type);
			}
		}

		return 0;
	},

	getPageContentHeight: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getPageContentHeight(pageIndex)
	{
		/// <summary>Returns the height of the content region (in pixels) for the given page</summary>
		/// <param name="pageIndex" type="Number">Page number to retrieve content height.</param>
		/// <returns type="Number">Height of the content region (in pixels) for the given page</returns>

		if ($$layoutShared.canUsePDFReactor())
		{
			return ro.layout.getPageDescription(pageIndex).contentRect.height;
		}
		else
		{
			return 1047; //This is the default PageDescription contentRect height in PDFReactor for a page without modified margins
		}
	},

	getPageContentWidth: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getPageContentWidth(pageIndex)
	{
		/// <summary>Returns the width of the content region (in pixels) for the given page</summary>
		/// <param name="pageIndex" type="Number">Page number to retrieve content width.</param>
		/// <returns type="Number">Width of the content region (in pixels) for the given page</returns>

		if (this.canUsePDFReactor())
		{
			return ro.layout.getPageDescription(pageIndex).contentRect.width;
		}
		else
		{
			var bothColumns = this.getBothColumns();
			if (bothColumns)
			{
				return this.getElementWidth(bothColumns, 1);
			}

			return 718;		// This is the default PageDescription contentRect width in PDFReactor for a page without modified margins
		}
	},

	getElementFirstPageIndex: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getElementFirstPageIndex(element)
	{
		/// <summary>Returns the first page an element is displayed for a printed document</summary>
		/// <param name="element" type="HTMLElement">Element to query which page is the first it is displayed</param>
		/// <returns type="Number">If printing, returns the first page this element is displayed on. When not printing, returns 0</returns>
		var pageIndex, boxes;

		pageIndex = 0;

		if (element && this.canUsePDFReactor())
		{
			boxes = ro.layout.getBoxDescriptions(element)
			if (boxes.length > 0)
			{
				pageIndex = boxes[0].pageIndex;		//Use first page index
			}
		}

		return pageIndex;
	},

	getScriptPath: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getScriptPath()
	{
		/// <summary>Returns the file path for script elements</summary>
		/// <returns type="String">File path for script elements. Includes last "/"</returns>
		var fileName;

		// HSWeb
		if (typeof ($$rf) !== 'undefined')
		{
			fileName = "JSEngine.cjs";
			return document.getElementById(fileName).src.slice(0, document.getElementById(fileName).src.length - (fileName.length));
		}
		//VB+EPS+MyChart
		else
		{
			fileName = "ACLayoutEngine";
			return document.getElementById(fileName).src.slice(0, document.getElementById(fileName).src.length - ((fileName + ".js").length));
		}

	},

	getStylesheetPath: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getStylesheetPath()
	{
		/// <summary>Returns the file path for stylesheet elements</summary>
		/// <returns type="String">File path for stylesheet elements. Includes last "/"</returns>
		var fileName;

		// Mychart
		if (window.$$WP && $$WP.Settings && $$WP.Settings.ScriptPath && $$WP.I18N)
		{
			fileName = "ACLayoutEngine";
			scriptPath = $$WP.Settings.ScriptPath + "Epic-Internal/Report/";
			stylePath = $$WP.I18N.getMyChartLocale() + "/styles/report/";
			return document.getElementById(fileName).src.slice(0, document.getElementById(fileName).src.length - ((scriptPath + fileName + ".js").length)) + stylePath;
		}
		// HSWeb
		else if (typeof ($$rf) !== 'undefined')
		{
			fileName = "JSEngine.cjs";
			return document.getElementById(fileName).src.slice(0, document.getElementById(fileName).src.length - (("Scripts/ReportViewerSupport/Plugins/" + fileName).length)) + "Styles/Default/Default/";
		}
		//VB+EPS
		else 
		{
			fileName = "ACLayoutEngine";
			return document.getElementById(fileName).src.slice(0, document.getElementById(fileName).src.length - (("Scripts/" + fileName + ".js").length)) + "css/";
		}
	},

	getTotalElementHeight: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$getTotalElementHeight(element)
	{
		/// <summary>Returns the total element's height (in pixels) including top+bottom margins</summary>
		/// <param name="element" type="HTMLElement">Element to find height</param>
		/// <returns type="Number">Height of element (in pixels)</returns>
		if (element)
		{
			if (this.canUsePDFReactor())
			{
				var regions, totalHeight;

				regions = this.__getElementRegions(element);

				totalHeight = 0;
				for (var i = 0; i < regions.length; i++)
				{
					totalHeight += regions[i].marginRect.height;
				}

				return totalHeight;
			}
			else
			{
				return Number(element.offsetHeight) + Number(element.style.marginTop) + Number(element.style.marginBottom);
			}
		}

		return 0;
	},

	round: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$round(numberIn)
	{
		/// <summary>Rounds a number to 2 decimal points to prevent far-off decimal points from influencing comparisons</summary>
		/// <returns type="Number">Rounded number</returns>
		return Math.round(numberIn * 100) / 100;
	},

	canUsePDFReactor: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$canUsePDFReactor()
	{
		/// <summary>Determines whether or not PDFReactor functionality can be leveraged for the report/printout</summary>
		/// <returns type="Boolean">True if PDFReactor functionality is available</returns>
		return (typeof (ro) !== 'undefined') && ro && ro.layout;
	},

	__getElementRegions: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$__getElementRegions(element)
	{
		/// <summary>Returns the PDFReactor regions of an element</summary>
		/// <param name="element" type="HTMLElement">Element to retrieve regions</param>
		/// <returns type="Array">Array of PDFReactor box descriptions</returns>
		if (element && this.canUsePDFReactor())
		{
			return ro.layout.getBoxDescriptions(element);
		}
		return null;
	},

	forceReflow: function Epic$Common$ReportViewer$Plugins$ACLayoutShared$forceReflow()
	{
		/// <summary>Forces a reflow in PDFreactor by inserting a style that does nothing. We use this function when we find that PDFreactor isn't forcing itself to reflow when it should</summary>
		if (this.canUsePDFReactor())
		{
			document.styleSheets[0].insertRule('#foo { }', 0);
		}
		return;
	},
}