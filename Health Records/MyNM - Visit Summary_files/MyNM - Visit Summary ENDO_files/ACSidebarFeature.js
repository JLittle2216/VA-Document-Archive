/*global document, MRAVSDynamicFeature */
//***************************
//  Copyright 2016-2022 Epic Systems Corporation
// Title: ACSidebarFeature.js
// Purpose: Report Sidebar Feature
//
//			This functionality relies on PDFReactor:
//			http://www.pdfreactor.com/
// Author: Danny Smith
// Revision History:
//   *DS  02/16 T15558 - Created
//   *JRM 05/16 T18822 - Fix a few bugs with client printing/overlapping elements
//   *JRM 05/16 T19560 - Modify minHeight param to only consider sidebar main content height
//   *JRM 06/16 T19868 - Enhance performance by only marking elements on the page being worked on
//                       and by moving some styles to CSS.
//   *JRM 06/16 T20150 - Enhance performance by moving some styles to server code
//   *JRM 07/16 T20627 - Add handling to allow the sidebar to be on pages other than the first so
//                       the sidebar will work properly with cover pages
//   *LC  08/16 431837 - pass in the negative margin as a percentage instead of px for no sidebar
//						 and no PDFReactor
//   *JRM 11/16 454244 - Add special handling to make the med list client print better
//   *DPK 01/17 441458 - Add minMainHeight param to allow configuration
//   *JRM 11/16 454134 - Use window height when client printing to determine sidebar height since
//                       the window height will be set based on the print content height
//   *MBM 03/17 454064 - Create HSWeb file and add css function
//   *JRM 06/17 487692 - Remove unnecessary reflow by fixing check to see if styles were added by server
//   *JRM 07/17 492686 - Rework some of the page breaking behavior around breakAvoid and the med list
//   *JRM 05/18 545093 - Add some wiggle room around width check so sidebar always displays in Hyperspace when it should
//   *JF  12/18 581551 - Valdiate that sidebarParent contains mainCol before injecting
//   *SDS 06/19 618848 - Use margin right for sidebar instead of padding
//   *SDS 02/20 668550 - Reflow after sidebar elements are added
//   *SDS 02/20 671502 - Check for specific tables overlapping the Sidebar
//   *SDS 03/20 674837 - Prevent doubling of notNextToSidebar styles
//   *SDS 02/21 758691 - Ignore cover page tables
//   *SDS 04/21 775397 - Fix finding the bothColumns and mainColumn element
//   *SDS 03/22 871554 - Round widths for comparisons
//***************************

ACSidebarFeature: function ACSidebarFeature()
{
	///<summary>Sidebar feature class. Derived from ACDynamicFeature object</summary>

	var key, referenceObject;

	//Retrieve base class properties
	referenceObject = new ACDynamicFeature();

	if (referenceObject)
	{ // Check for null/undefined
		for (key in referenceObject)
		{ // Iterate over properties
			if (!this[key])
			{
				this[key] = referenceObject[key]; // Copy the value over
			}
		}
	}
}

ACSidebarFeature.prototype = {
	//#region fields
	///<field name="__sidebarObject" type="HTMLElement">Element that represents the sidebar</field>
	__sidebarObject: null,
	///<field name="__sidebarMainObject" type="HTMLElement">Element that represents the sidebar main content container (added from the top)</field>
	__sidebarMainObject: null,
	///<field name="__sidebarFooterObject" type="HTMLElement">Element that represents the sidebar footer content container (added from the bottom)</field>
	__sidebarFooterObject: null,
	///<field name="__sidebarParentObject" type="HTMLElement">Element that represents the 'bothColumns' div in CSS Reports</field>
	__sidebarParentObject: null,
	///<field name="__mainColumn" type="HTMLElement">Element that represents the 'mainColumn' div in CSS Reports</field>
	__mainColumn: null,
	///<field name="__minSidebarHeight" type="Number">Minimum height (in pixels) allowed for the sidebar main content. If the height is less than this when completing, it will be discarded</field>
	__minSidebarHeight: 1,
	///<field name="__maxWidth" type="Number">Maximum width (in pixels) allowed for the sidebar. if the width exceeds this amount, content must be removed</field>
	__maxWidth: null,
	///<field name="__sidebarIDCounter" type="Number">Counter to generate unique sidebar IDs</field>
	__sidebarIDCounter: 0,
	///<field name="__sidebarWidthPercentage" type="Number">Percent Width the sidebar should have</field>
	__sidebarWidthPercentage: 0,
	///<field name="__hasBeenInitialized" type="Boolean">Indicates whether initialize has been called</field>
	__hasBeenInitialized: false,
	///<field name="__hasBeenRun" type="Boolean">Indicates whether DoWork has been called</field>
	__hasBeenRun: false,
	///<field name="__useRightSide" type="Boolean">Indicates which side the sidebar should be on. If 1, it will be on the right side, else, it will be on the left.</field>
	__useRightSide: false,
	///<field name="__originalMarginWidth" type="Number">Original left/right side margin width in pixels.</field>
	__originalMarginWidth: 0,
	///<field name="__stylesSetInServerCode" type="Boolean">True if the styling (such as rptsidebar's width) was done in server code.</field>
	__stylesSetInServerCode: false,
	///<field name="__sidebarPage" type="Number">The page the sidebar should be put on.</field>
	__sidebarPage: 1,
	///<field name="__minMainHeight" type="Number">Minimum height (in pixels) that the main content needs to be in order to display the sidebar. If the height is less than this when completing, the sidebar will not be displayed</field>
	__minMainHeight: 300,

	//#endregion

	createInstance: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$createInstance()
	{
		/// <summary>Creates an instance of ACSidebarFeature. This is called by the $$pluginFactory</summary>
		/// <returns type="ACSidebarFeature">An instance of ACSidebarFeature</returns>

		return new ACSidebarFeature();
	},

	styleSheetNeeded: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$styleSheetNeeded()
	{
		/// <summary>Returns the name of a stylesheet if needed</summary>
		return "ACSidebarFeature.css";
	},

	needsToBeInitialized: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$needsToBeInitialized()
	{
		/// <summary>Determines whether the initialize function should be run</summary>
		/// <returns type="Boolean">True if initialize should be run. False otherwise</returns>
		if (!(this.__hasBeenInitialized && this.__sidebarObject === document.getElementById("RptSidebar")))
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Initializing because it hasn't been run yet.");
			}
			return true;
		}
		if (document.getElementById("RptSidebar") != null)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Not initializing because the Sidebar already exists.");
			}
			return false;
		}
		else
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Run initialize even though we have initialized before, because sidebar does not exist.");
			}
			return true;
		}
	},

	needsToBeRun: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$needsToBeRun()
	{
		/// <summary>Returns whether DoWork should be run</summary>
		/// <returns type="Boolean">True if DoWork should be run. False otherwise</returns>
		var oldMaxWidth;

		if (!this.__hasBeenRun)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Running doWork because it hasn't been run yet.");
			}
			return true;
		}
		else if (this.__sidebarObject)
		{
			oldMaxWidth = this.__maxWidth;
			this.__maxWidth = this.findSidebarMaxWidth(this.__sidebarWidthPercentage);

			if (document.querySelectorAll("[data-sidebarID]").length > 0)
			{
				if (oldMaxWidth == this.__maxWidth)
				{
					//If the width is the same as the last time we ran doWork and elements are already added and such, no need to run doWork again
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Not running doWork because sidebarID's already exist and the width is the same as the last time it was run.");
					}
					return false;
				}
			}

			//Should still do some work if the width of the sidebar changed or if the sidebar is empty.
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Running doWork because the width of the report changed or no sidebarID's exist so we likely haven't run doWork.");
			}
			return true;
		}
		//If we don't have the sidebar at all, we shouldn't try and play with the elements in the sidebar
		else if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Not running doWork because there is no sidebar object, so we can't perform operations on it.");
		}

		return false;
	},

	initialize: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$initialize()
	{
		/// <summary>Initializes the feature by creating the sidebar elements and adding them to the DOM</summary>
		var sidebarCreatedHere;

		this.__getParameters();
		this.__hasBeenInitialized = true;

		if (typeof ($$rf) === 'undefined')
		{
			$$layoutShared.loadCSS("ACSidebarFeature");
		}

		this.__findSidebarParentAndMainCol();
		if (!this.__sidebarParentObject || !this.__mainColumn || !this.__sidebarParentObject.contains(this.__mainColumn))
		{
			return;
		}

		this.__sidebarObject = document.getElementById("RptSidebar");

		//Initialize the main sidebar object
		if (!this.__sidebarObject)
		{
			sidebarCreatedHere = true;
			this.__createSidebarObject();
			this.__maxWidth = this.findSidebarMaxWidth(this.__sidebarWidthPercentage);

			//If using PDF reactor, move the sidebar to the margin
			if ($$layoutShared.canUsePDFReactor())
			{
				this.__addSidebarPDFReactorStyles();
			}
			//If not using PDF reactor, just float it to the left/right
			else
			{
				this.__addSidebarHyperspaceStyles();
			}
		}

		this.__addWrappersIfTheyDontExist();

		//Insert the sidebar object into the DOM
		if (sidebarCreatedHere)
		{
			this.__addSidebarToDOM();
		}

		return;
	},

	doWork: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$doWork()
	{
		/// <summary>Places elements in the sidebar and determines whether a sidebar fits</summary>
		var elementIndex, sidebarFooterElements, sidebarElements, hasHeader, docHeight;

		this.__hasBeenRun = true;
		if (!this.__sidebarObject)
		{
			return true;
		}

		//Set the sidebar height - Can't do this in initialize since other js that may impact the height of the sidebar (like the header/footer) might not have run yet
		if ($$layoutShared.canUsePDFReactor())
		{
			//If we already set the height appropriately in server code, then we don't need to set it again.
			if ($$layoutShared.getPageContentHeight(this.__sidebarPage - 1) != parseInt(getComputedStyle(this.__sidebarObject).getPropertyValue("height")))
			{
				this.__sidebarObject.style.height = $$layoutShared.getPageContentHeight(this.__sidebarPage - 1) + "px";
			}
		}
		else
		{
			hasHeader = (document.getElementById("RptHeader") != null);

			//Initialize to 910 since this seems like a height that works in general for portrait printed Letter/A4 Documents 
			docHeight = 910;

			if (document.querySelector("[data-plugin-isClientPrinting]") != null)
			{
				docHeight = window.innerHeight;
			}

			if (hasHeader)
			{
				this.__sidebarObject.style.height = (docHeight - $$layoutShared.getElementHeight(document.getElementById("RptHeader"), 3)).toString() + "px";
			}
			else
			{
				this.__sidebarObject.style.height = docHeight + "px";
			}
		}

		if (document.querySelectorAll("[data-sidebarID]").length > 0)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Resetting Sidebar");
			}
			this.__undoDoWork();
		}

		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Adding Main Sidebar Elements");
		}

		sidebarElements = this.__getSidebarElements();
		for (elementIndex = 0; elementIndex < sidebarElements.length; elementIndex++)
		{
			this.__addElementToSidebar(sidebarElements[elementIndex]);
		}

		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Adding Sidebar Footer Elements");
		}

		sidebarFooterElements = this.__getSidebarFooterElements();
		for (elementIndex = 0; elementIndex < sidebarFooterElements.length; elementIndex++)
		{
			this.__addElementToSidebarFooter(sidebarFooterElements[elementIndex]);
		}


		// Reflow the document now that elements have been added to the sidebar and removed from the main column.
		// This is necessary for cases like QAN 5636084, where without the reflow, SmartText content can run off
		//  the bottom of the page once the MyChart LPG above it gets moved into the Sidebar.
		$$layoutShared.forceReflow();


		// Check if the sidebar should be removed
		if (!this.__doesSidebarFillEnoughSpace())
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Removing Sidebar since it does not contain enough content");
			}
			this.__removeSidebar();
		}
		else if (!this.__doesMainColumnFillEnoughSpace())
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Removing Sidebar since the main column does not contain enough content");
			}
			this.__removeSidebar();
		}
		else if (this.__mainColumnIsTooWide())
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Removing Sidebar since the main column has content next to the sidebar that is too wide")
			}
			this.__removeSidebar();
		}
		else
		{
			if (!$$layoutShared.canUsePDFReactor())
			{
				var notNextToSidebarStyle, createdHere, marginPercentage, mainColumnWidthPercentage;
				notNextToSidebarStyle = document.getElementById("notNextToSidebarStyle");

				// Pass in the negative margin as a percentage instead of px.

				//	When we are not using PDFReactor, we have no control over what the printout page's margins are
				//   as it is modified in the IE page setup settings and applied after our processing here.
				//  So when we passed in an absolute margin width, the content of the print group may get cut off if
				//   the user-configured page widths are not what we assumed it will be.
				//	I am changing this code to give IE a percentage for the margin instead of the current px value.
				//	Since the sidebar really lives in the margin space, to IE, the page content width is ONLY the width of 
				//   the mainColumn, not mainColumn+sidebar, using the raw sidebarWidthPercentage for the margin
				//   is incorrect.
				//  Instead, I am dividing the sidebarWidthPercentage by the mainColumnWidthPercentage to get the
				//   sidebar width as a percentage of the main column.  

				//	For example: 
				//  40% of page=sidebar and 60%=mainColum 
				//   then the sidebar = 2/3 or 66.6% of the mainColumn 
				//  66.6% is what we have to tell IE so that it can calculate the margin correctly based on how much 
				//   room is on the page. 

				mainColumnWidthPercentage = 100 - this.__sidebarWidthPercentage;
				marginPercentage = (this.__sidebarWidthPercentage / (mainColumnWidthPercentage)) * 100;

				if (notNextToSidebarStyle == null)
				{
					notNextToSidebarStyle = document.createElement("style");
					notNextToSidebarStyle.id = "notNextToSidebarStyle";
					notNextToSidebarStyle.type = "text/css";
					createdHere = 1;
				}

				if (this.__useRightSide)
				{
					notNextToSidebarStyle.innerHTML = ".notNextToSidebar{ margin-right:-" + (marginPercentage) + "%!important; } .notNextToSidebar .notNextToSidebar { margin-right: 0 !important; }";
				}
				else
				{
					notNextToSidebarStyle.innerHTML = ".notNextToSidebar{ margin-left:-" + (marginPercentage) + "%!important; } .notNextToSidebar .notNextToSidebar { margin-left: 0 !important; }";
				}

				if (createdHere)
				{
					document.head.appendChild(notNextToSidebarStyle);
				}
			}
		}
	},

	doPageLevelWork: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$doPageLevelWork(pgIdx)
	{
		if (document.getElementById("RptSidebar") != null && this.__mainColumn != null)
		{
			if (pgIdx == 0)
			{
				if (this.__mainColumnIsTooWide())
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Removing Sidebar since the main column has content next to the sidebar that is too wide")
					}
					this.__removeSidebar();
				}
			}
			this.__markElements(pgIdx);
		}
	},

	__getParameters: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__getParameters()
	{
		/// <summary>Gathers the feature's parameters from the DOM</summary>
		var paramHolders, params;

		paramHolders = document.querySelectorAll("[data-plugins-acsidebarfeature]");
		if (paramHolders && paramHolders.length > 0)
		{
			params = paramHolders[0].getAttribute("data-plugins-acsidebarfeature");
			if (params)
			{
				params = JSON.parse(params);
				this.__minSidebarHeight = params.minSidebarHeight;
				this.__sidebarWidthPercentage = params.widthPercentage;
				this.__useRightSide = (params.rightSide == 1);
				this.__minMainHeight = params.minMainHeight;
			}
		}

		//Also gather other relevant information from the DOM
		var elem = document.querySelector("[data-plugin-start-on-page]");
		if (elem)
		{
			this.__sidebarPage = elem.getAttribute("data-plugin-start-on-page");
		}
	},

	__findSidebarParentAndMainCol: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__findSidebarParentAndMainCol()
	{
		/// <summary>Find both the sidebar parent div and the main column div.</summary>
		var idx, mainColumns;

		// Retrieve the parent element for the sidebar
		this.__sidebarParentObject = $$layoutShared.getBothColumns();
		if (!this.__sidebarParentObject)
		{
			return;
		}

		// Find the normal main column div within the parent object - the one that isn't the header/sidebar/footer
		mainColumns = this.__sidebarParentObject.querySelectorAll(".mainColumn");

		for (idx = 0; idx < mainColumns.length; idx++)
		{
			var curMainColumn = mainColumns[idx];

			if (!(curMainColumn.id == "RptHeader" || curMainColumn.id == "RptSidebar" || curMainColumn.id == "RptFooter"))
			{
				this.__mainColumn = curMainColumn;
				break;
			}
		}
	},

	__createSidebarObject: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__createSidebarObject()
	{
		/// <summary>Create the sidebar object</summary>
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Creating Sidebar Object");
		}
		this.__sidebarObject = document.createElement("div");

		this.__sidebarObject.id = "RptSidebar";
		if (this.__useRightSide)
		{
			this.__sidebarObject.className = "mainColumn rptSidebar right page" + this.__sidebarPage;
			this.__mainColumn.className += " hasRightSidebar";
		}
		else
		{
			this.__sidebarObject.className = "mainColumn rptSidebar left page" + this.__sidebarPage;
			this.__mainColumn.className += " hasLeftSidebar";
		}
	},

	__addSidebarToDOM: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__addSidebarToDOM()
	{
		/// <summary>Add the sidebar object to the DOM</summary>
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Adding Sidebar Object to DOM");
		}

		if ($$layoutShared.canUsePDFReactor())
		{
			this.__sidebarParentObject.insertBefore(this.__sidebarObject, this.__sidebarParentObject.firstChild);
		}
		else
		{
			this.__sidebarParentObject.insertBefore(this.__sidebarObject, this.__mainColumn);
		}
	},

	__addWrappersIfTheyDontExist: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__addWrappersIfTheyDontExist()
	{
		/// <summary>Adds the sidebar wrapper elements if they don't already exist</summary>
		var sidebarWrapper;

		//Try to find the wrappers
		this.__sidebarFooterObject = document.getElementById("RptSidebarFooter");
		this.__sidebarMainObject = document.getElementById("RptSidebarMain");
		sidebarWrapper = document.getElementById("RptSidebarWrapper");

		//Initialize the wrapper div around the main content and footer content. This is needed for the sidebar footer to float to the bottom properly
		if (!sidebarWrapper)
		{
			sidebarWrapper = document.createElement("div");
			sidebarWrapper.id = "RptSidebarWrapper";
			this.__sidebarObject.appendChild(sidebarWrapper);
		}

		//Create div for the main content of the sidebar
		if (!this.__sidebarMainObject)
		{
			this.__sidebarMainObject = document.createElement("div");
			this.__sidebarMainObject.id = "RptSidebarMain";
			sidebarWrapper.appendChild(this.__sidebarMainObject);
		}

		//Create div for the sidebar footer content
		if (!this.__sidebarFooterObject)
		{
			this.__sidebarFooterObject = document.createElement("div");
			this.__sidebarFooterObject.id = "RptSidebarFooter";
			sidebarWrapper.appendChild(this.__sidebarFooterObject);
		}
	},

	__addSidebarHyperspaceStyles: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__addSidebarHyperspaceStyles()
	{
		/// <summary>Adds styles related to the sidebar if we're running in Hyperspace</summary>
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Adding Hyperspace-specific setup");
		}

		this.__sidebarObject.style.width = this.__sidebarWidthPercentage + "%";
		if (this.__useRightSide)
		{
			this.__sidebarObject.style.cssFloat = "right";
		}
		else
		{
			this.__sidebarObject.style.cssFloat = "left";
		}

		//Style the main column so that it fits nicely with the sidebar
		this.__mainColumn.style.boxSizing = "border-box";
		this.__mainColumn.style.width = (100 - this.__sidebarWidthPercentage).toString() + "%";
	},

	__addSidebarPDFReactorStyles: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__addSidebarPDFReactorStyles()
	{
		/// <summary>Adds styles related to the sidebar if we're running in PDF Reactor</summary>
		var hasHeader;

		if (!this.__stylesSetInServerCode)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Adding PDFReactor-specific setup");
			}

			//Add styles needed if we have a header in the document
			hasHeader = (document.getElementById("RptHeader") != null);
			if (hasHeader)
			{
				if (this.__useRightSide)
				{
					this.__originalMarginWidth = ro.layout.getPageDescription(0).contentRect.left;
					document.getElementById("RptHeader").style.marginRight = "-" + (this.__maxWidth - this.__originalMarginWidth) + "px";
				} else
				{
					this.__originalMarginWidth = ro.layout.getPageDescription(0).marginRect.right - ro.layout.getPageDescription(0).contentRect.right;
					document.getElementById("RptHeader").style.marginLeft = "-" + (this.__maxWidth - this.__originalMarginWidth) + "px";
				}
			}

			//Since we'll be checking against max width to see if sidebar elements fit  - intentionally try to make their width's slightly less than the whole sidebar to account for rounding and such
			this.__sidebarObject.style.maxWidth = (this.__maxWidth - 1) + "px";

			//Add styling to give a left/right margin = the width of the sidebar+the original margin width which will be converted into left/right padding on the sidebar
			if (this.__useRightSide)
			{
				document.styleSheets[0].insertRule('@page:-ro-nth(' + this.__sidebarPage + ') { margin-right:' + this.__maxWidth + 'px; }', 0);
				document.styleSheets[0].insertRule('#RptSidebar { margin-right:' + this.__originalMarginWidth + 'px}', 0);

				//Add this style for the footer
				document.styleSheets[0].insertRule('@page:-ro-nth(' + this.__sidebarPage + ') { @bottom-left{margin-right:-' + (this.__maxWidth - this.__originalMarginWidth) + 'px; }}', 0);
			} else
			{
				document.styleSheets[0].insertRule('@page:-ro-nth(' + this.__sidebarPage + ') { margin-left:' + this.__maxWidth + 'px; }', 0);
				document.styleSheets[0].insertRule('#RptSidebar { margin-left:' + this.__originalMarginWidth + 'px}', 0);

				//Add this style for the footer
				document.styleSheets[0].insertRule('@page:-ro-nth(' + this.__sidebarPage + ') { @bottom-left{margin-left:-' + (this.__maxWidth - this.__originalMarginWidth) + 'px; }}', 0);
			}
		}
	},

	findSidebarMaxWidth: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$findSidebarMaxWidth(percentageOfPage)
	{
		/// <summary>Returns the max width for the sidebar</summary>
		/// <param name="percentageOfPage" type="Number"></param>
		if ($$layoutShared.canUsePDFReactor())
		{
			// If the max width already exists, then it was set on the server, so set the flag accordingly
			// Check a data attribute set on the server because it's faster than relayouting the document to get the computed style.
			var currentMaxWidth;
			var elemSidebarMaxWidth = document.querySelector("[data-sidebar-maxwidth]");

			if (elemSidebarMaxWidth)
			{
				currentMaxWidth = parseInt(elemSidebarMaxWidth.getAttribute("data-sidebar-maxwidth"));
			}
			else
			{
				currentMaxWidth = parseInt(getComputedStyle(this.__sidebarObject).getPropertyValue("max-width"));
			}

			if (!isNaN(currentMaxWidth) && currentMaxWidth != 0)
			{
				this.__stylesSetInServerCode = true;
				return currentMaxWidth + 1;
			}
			else
			{
				return percentageOfPage / 100 * ro.layout.getPageDescription(0).marginRect.width + 1;
			}
		}
		else
		{
			return percentageOfPage / 100 * this.__sidebarParentObject.clientWidth + 1; //The 1 accounts for rounding and such
		}
	},

	__markElements: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__markElements(pgIdx)
	{
		/// <summary>Marks elements with a class so they can better determine how they should display</summary>
		var elementIndex, pgSections, currentSection, boxes, sidebarBottom, breakAvoidElems, breakAvoidElement;

		pgSections = this.__mainColumn.querySelectorAll(".pgSection");
		if (!$$layoutShared.canUsePDFReactor())
		{
			sidebarBottom = $$layoutShared.getElementBottom(document.getElementById("RptSidebar"), 3);

			//If we are client printing or previewing an element with breakAvoid and it will ultimately end up on the page
			//after the sidebar then move it below the sidebar and mark it that way so we can style it appropriately.
			breakAvoidElems = this.__mainColumn.querySelectorAll(".breakAvoid");
			for (elementIndex = 0; elementIndex < breakAvoidElems.length; elementIndex++)
			{
				breakAvoidElement = breakAvoidElems[elementIndex];

				//Only apply breakBefore on elements we know have handling to expand to full width or elements that have specifically been allowed to do so
				if (!breakAvoidElement.classList.contains("enabledForSidebarToMove"))
				{
					if (!breakAvoidElement.classList.contains("pgSection"))
					{
						continue;
					} else if (!breakAvoidElement.hasAttribute("data-sectdepth"))
					{
						continue;
					}
					else if (breakAvoidElement.getAttribute("data-sectdepth") != "1")
					{
						continue;
					}
				}

				if ($$layoutShared.getElementBottom(breakAvoidElement, 3) > sidebarBottom && $$layoutShared.getElementTop(breakAvoidElement, 3) < sidebarBottom)
				{
					breakAvoidElement.className = breakAvoidElement.className.replace(/(?:^|\s)nextToSidebar(?!\S)/g, '');
					breakAvoidElement.className = breakAvoidElement.className.replace(/(?:^|\s)notNextToSidebar(?!\S)/g, '');
					breakAvoidElement.className = breakAvoidElement.className.replace(/(?:^|\s)usedToBeNextToSidebar(?!\S)/g, '');
					breakAvoidElement.className += " breakBefore";
				}
			}
		}

		for (elementIndex = 0; elementIndex < pgSections.length; elementIndex++)
		{
			currentSection = pgSections[elementIndex];

			//Only mark sections that are at the highest level
			if (currentSection.hasAttribute("data-sectdepth"))
			{
				if (currentSection.getAttribute("data-sectdepth") != "1")
				{
					continue;
				}
			}

			if ($$layoutShared.canUsePDFReactor())
			{
				boxes = ro.layout.getBoxDescriptions(currentSection);
				//If boxes.length==0, then the element isn't being displayed, so we don't need to give it the data attribute
				if (boxes.length != 0)
				{
					if (boxes[0].pageIndex > pgIdx)
					{
						return;
					}
					else if (boxes[0].pageIndex < pgIdx)
					{
						continue;
					}

					if (boxes[0].pageIndex == this.__sidebarPage - 1)
					{
						currentSection.className = currentSection.className.replace(/(?:^|\s)nextToSidebar(?!\S)/g, '');
						currentSection.className = currentSection.className.replace(/(?:^|\s)notNextToSidebar(?!\S)/g, '');
						currentSection.className = currentSection.className.replace(/(?:^|\s)usedToBeNextToSidebar(?!\S)/g, '');
						currentSection.className += " nextToSidebar";
					}
					else
					{
						var usedToBeNextToSidebar = currentSection.classList.contains("nextToSidebar");

						currentSection.className = currentSection.className.replace(/(?:^|\s)nextToSidebar(?!\S)/g, '');
						currentSection.className = currentSection.className.replace(/(?:^|\s)notNextToSidebar(?!\S)/g, '');
						currentSection.className = currentSection.className.replace(/(?:^|\s)usedToBeNextToSidebar(?!\S)/g, '');
						currentSection.className += " notNextToSidebar";
						if (usedToBeNextToSidebar)
						{
							currentSection.className += " usedToBeNextToSidebar";
						}
					}
				}

			}
			else
			{
				if ($$layoutShared.getElementTop(currentSection, 3) < sidebarBottom)
				{
					currentSection.className = currentSection.className.replace(/(?:^|\s)nextToSidebar(?!\S)/g, '');
					currentSection.className = currentSection.className.replace(/(?:^|\s)notNextToSidebar(?!\S)/g, '');
					currentSection.className = currentSection.className.replace(/(?:^|\s)usedToBeNextToSidebar(?!\S)/g, '');
					currentSection.className += " nextToSidebar";

				}
				else
				{
					var usedToBeNextToSidebar = currentSection.classList.contains("nextToSidebar");

					currentSection.className = currentSection.className.replace(/(?:^|\s)nextToSidebar(?!\S)/g, '');
					currentSection.className = currentSection.className.replace(/(?:^|\s)notNextToSidebar(?!\S)/g, '');
					currentSection.className = currentSection.className.replace(/(?:^|\s)usedToBeNextToSidebar(?!\S)/g, '');
					currentSection.className += " notNextToSidebar";
					if (usedToBeNextToSidebar)
					{
						currentSection.className += " usedToBeNextToSidebar";
					}
				}
			}
		}
	},

	__undoDoWork: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__undoDoWork()
	{
		/// <summary>Undoes work done by DoWork (removes sidebar elements)</summary>
		var sidebarElements, elementIndex, sidebarFooterElements, sidebarEl, sidebarFooterEl, mainColElement, sidebarID;

		if (this.__sidebarMainObject)
		{
			//Remove elements from sidebar and unhide main column elements
			sidebarElements = this.__sidebarMainObject.childNodes;
			for (elementIndex = 0; elementIndex < sidebarElements.length;)
			{
				sidebarEl = sidebarElements[elementIndex];
				if (sidebarEl.hasAttribute("data-sidebarID"))
				{
					sidebarID = sidebarEl.getAttribute("data-sidebarID");
					sidebarEl.parentNode.removeChild(sidebarEl);

					mainColElement = document.querySelector("[data-sidebarID=\"" + sidebarID + "\"]");
					mainColElement.style.display = "";
					mainColElement.removeAttribute("data-sidebarID");
				}
			}
		}

		//Remove elements from sidebar footer and unhide main column elements
		if (this.__sidebarFooterObject)
		{
			sidebarFooterElements = this.__sidebarFooterObject.childNodes;
			for (elementIndex = 0; elementIndex < sidebarFooterElements.length;)
			{
				sidebarFooterEl = sidebarFooterElements[elementIndex];
				if (sidebarFooterEl.hasAttribute("data-sidebarID"))
				{
					sidebarID = sidebarFooterEl.getAttribute("data-sidebarID");
					sidebarFooterEl.parentNode.removeChild(sidebarFooterEl);

					mainColElement = document.querySelector("[data-sidebarID=\"" + sidebarID + "\"]");
					mainColElement.style.display = "";
					mainColElement.removeAttribute("data-sidebarID");
				}
			}
		}
	},

	__getSidebarElements: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__getSidebarElements()
	{
		/// <summary>Returns all elements marked to be in the sidebar</summary>
		/// <returns type="Array">Array of elements marked to be in the sidebar</returns>

		return document.querySelectorAll("[data-plugin-sidebar-content]");
	},

	__getSidebarFooterElements: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__getSidebarFooterElements()
	{
		/// <summary>Returns all elements marked to be in the sidebar footer</summary>
		/// <returns type="Array">Array of elements marked to be in the sidebar footer</returns>

		return document.querySelectorAll("[data-plugin-sidebar-footer-content]");
	},

	__addElementToSidebar: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__addElementToSidebar(element)
	{
		/// <summary>Adds an element to the sidebar</summary>
		/// <param name="element" type="HTMLElement">Element to add to sidebar</param>
		/// <returns type="Boolean">True if the element was added. False if the element did not fit</returns>
		var elementCopy;

		if (!element.hasAttribute("data-sidebarID"))
		{
			element.setAttribute("data-sidebarID", this.__generateSidebarID());
		}

		//Remove the data attribute from the copy to avoid an infinite loop due to the way Javascript maintains arrays returned by querySelectorAll
		elementCopy = element.cloneNode(true);
		if (elementCopy.hasAttribute("data-plugin-sidebar-content"))
		{
			elementCopy.removeAttribute("data-plugin-sidebar-content");
		}

		//Append copy to the sidebar
		if (this.__sidebarMainObject)
		{
			this.__sidebarMainObject.appendChild(elementCopy);
		}

		//If the copy does not fit in the sidebar, remove it. Otherwise, hide the main column element
		if (!this.__doesSidebarMainFit(elementCopy))
		{
			this.__sidebarMainObject.removeChild(elementCopy);
			element.removeAttribute("data-sidebarID");
			return false;
		}
		else
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Element added to sidebar");
			}
			element.style.display = "none";
			return true;
		}

		return true;
	},

	__addElementToSidebarFooter: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__addElementToSidebarFooter(element)
	{
		/// <summary>Adds an element to the sidebar footer</summary>
		/// <param name="element" type="HTMLElement">Element to add to sidebar footer</param>
		var elementCopy;

		if (!element.hasAttribute("data-sidebarID"))
		{
			element.setAttribute("data-sidebarID", this.__generateSidebarID());
		}

		//Remove the data attribute from the copy to avoid an infinite loop due to the way Javascript maintains arrays returned by querySelectorAll
		elementCopy = element.cloneNode(true);
		if (elementCopy.hasAttribute("data-plugin-sidebar-footer-content"))
		{
			elementCopy.removeAttribute("data-plugin-sidebar-footer-content");
		}

		//Append copy to the sidebar footer
		if (this.__sidebarFooterObject)
		{
			this.__sidebarFooterObject.appendChild(elementCopy);
		}

		//If the copy does not fit in the sidebar, remove it. Otherwise, hide the main column element
		if (!this.__doesSidebarFooterFit(elementCopy))
		{
			this.__sidebarFooterObject.removeChild(elementCopy);
			element.removeAttribute("data-sidebarID");
			return false;
		}
		else
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Element added to sidebar footer");
			}
			element.style.display = "none";
			return true;
		}

		return false;
	},

	__generateSidebarID: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__generateSidebarID()
	{
		/// <summary>Generates a unique ID for the sidebar element and the element it was copied from</summary>
		/// <returns type="Numeric">Unique ID</returns>

		return this.__sidebarIDCounter++;
	},


	__removeSidebar: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__removeSidebar()
	{
		/// <summary>Removes the sidebar elements from the DOM and reverts the changes made to the DOM</summary>

		//Remove elements in sidebar and revert the main column print groups they were copied from
		this.__undoDoWork();

		//Remove sidebar
		if (this.__sidebarObject)
		{
			if (this.__sidebarObject.parentNode != null)
			{
				this.__sidebarObject.parentNode.removeChild(this.__sidebarObject);
			}

			//Revert the CSS or changes made to element inline styles
			if ($$layoutShared.canUsePDFReactor())
			{
				var pageDescription = ro.layout.getPageDescription(0);
				if (pageDescription)
				{
					if (this.__useRightSide)
					{
						document.styleSheets[0].insertRule('@page:-ro-nth(' + this.__sidebarPage + ') { margin-right:' + pageDescription.contentRect.left + 'px !important; }', 0);
						document.styleSheets[0].insertRule('@page:-ro-nth(' + this.__sidebarPage + ') { @bottom-left{margin-right:0 !important; }}', 0);
						if (document.getElementById("RptHeader") != null)
						{
							document.getElementById("RptHeader").style.marginRight = "0";
						}
					}
					else
					{
						document.styleSheets[0].insertRule('@page:-ro-nth(' + this.__sidebarPage + ') { margin-left:' + (pageDescription.marginRect.right - pageDescription.contentRect.right) + 'px !important; }', 0);
						document.styleSheets[0].insertRule('@page:-ro-nth(' + this.__sidebarPage + ') { @bottom-left{margin-left:0 !important; }}', 0);
						if (document.getElementById("RptHeader") != null)
						{
							document.getElementById("RptHeader").style.marginLeft = "0";
						}
					}
				}
			}
			else
			{
				// Use getElementsByClassName here since it returns a live list of nodes 
				var elements = document.getElementsByClassName("nextToSidebar");
				while (elements.length > 0)
				{
					elements[0].className = elements[0].className.replace(/(?:^|\s)nextToSidebar(?!\S)/g, '');
				}

				elements = document.getElementsByClassName("notNextToSidebar");
				while (elements.length > 0)
				{
					elements[0].className = elements[0].className.replace(/(?:^|\s)notNextToSidebar(?!\S)/g, '');
				}

				elements = document.getElementsByClassName("usedToBeNextToSidebar");
				while (elements.length > 0)
				{
					elements[0].className = elements[0].className.replace(/(?:^|\s)usedToBeNextToSidebar(?!\S)/g, '');
				}

				if (this.__mainColumn)
				{
					this.__mainColumn.style.width = "";
					this.__mainColumn.style.boxSizing = "";
				}
			}

			if (this.__mainColumn)
			{
				if (this.__useRightSide)
				{
					this.__mainColumn.classList.remove("hasRightSidebar");
				} else
				{
					this.__mainColumn.classList.remove("hasLeftSidebar");
				}
			}
		}

		//Set object variables to null
		this.__sidebarObject = null;
		this.__sidebarMainObject = null;
		this.__sidebarFooterObject = null;
		this.__sidebarParentObject = null;
		this.__mainColumn = null;
	},

	__doesSidebarFooterFit: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__doesSidebarFooterFit(element)
	{
		/// <summary>Checks to see whether the sidebar footer fits with the new element</summary>
		/// <param name="element" type="HTMLElement">New element added to the sidebar footer</param>
		/// <returns type="Boolean">True if the element fits in the sidebar footer</returns>

		//Element is too wide
		var fullElementWidth = $$layoutShared.getElementWidth(element, 3) + parseInt(getComputedStyle(this.__sidebarFooterObject).getPropertyValue("padding-left")) + parseInt(getComputedStyle(this.__sidebarFooterObject).getPropertyValue("padding-right"));
		var sidebarWidth = this.__maxWidth - this.__originalMarginWidth;

		if (fullElementWidth > sidebarWidth || (element.scrollWidth - 10) > $$layoutShared.getElementWidth(element, 2))
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Element not added to Sidebar Footer - Content exceeds sidebar width");
			}
			return false;
		}

		//Element is too tall
		else if ($$layoutShared.getElementHeight(this.__sidebarFooterObject, 3) > $$layoutShared.getPageContentHeight(0))
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Element not added to Sidebar Footer - Sidebar Footer height exceeds allowed amount");
			}
			return false;
		}

		//Sidebar Content and Sidebar Footer are overlapping
		else if ($$layoutShared.getElementBottom(this.__sidebarMainObject, 3) > $$layoutShared.getElementTop(this.__sidebarFooterObject, 3))
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Element not added to Sidebar Footer - Sidebar content and footer overlap");
			}
			return false;
		}

		return true;
	},

	__doesSidebarMainFit: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__doesSidebarMainFit(element)
	{
		/// <summary>Checks to see whether the sidebar main content fits with the new element</summary>
		/// <param name="element" type="HTMLElement">New element added to the sidebar</param>
		/// <returns type="Boolean">True if the element fits in the sidebar footer</returns>

		//Element is too wide
		var fullElementWidth = $$layoutShared.getElementWidth(element, 3) + parseInt(getComputedStyle(this.__sidebarMainObject).getPropertyValue("padding-left")) + parseInt(getComputedStyle(this.__sidebarMainObject).getPropertyValue("padding-right"));
		var sidebarWidth = this.__maxWidth - this.__originalMarginWidth;
		var sidebarMainHeight = $$layoutShared.getElementHeight(this.__sidebarMainObject, 3);

		//PDF Reactor could just be wrong and need to reflow. This check is done to force a reflow if we think it might be wrong.
		// (Apparently this is still necessary in some cases for PDFreactor 10 (ie: automated test (General) MR - Cover Page)
		if (sidebarMainHeight == 0)
		{
			document.body.style.backgroundColor = "white";
			document.body.style.backgroundColor = "";
			sidebarMainHeight = $$layoutShared.getElementHeight(this.__sidebarMainObject, 3);
		}

		if (fullElementWidth > sidebarWidth || (element.scrollWidth - 10) > $$layoutShared.getElementWidth(element, 2))
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Element not added to Sidebar - Content exceeds sidebar width");
			}
			return false;
		}

		//Element is too tall
		else if (sidebarMainHeight > $$layoutShared.getPageContentHeight(0))
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Element not added to Sidebar - Sidebar height exceeds allowed amount");
			}
			return false;
		}

		//Sidebar Content and Sidebar Footer are overlapping
		else if ($$layoutShared.getElementBottom(this.__sidebarMainObject, 3) > $$layoutShared.getElementTop(this.__sidebarFooterObject, 3))
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Element not added to Sidebar - Sidebar content and footer overlap");
			}
			return false;
		}

		return true;
	},

	__doesSidebarFillEnoughSpace: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__doesSidebarFillEnoughSpace()
	{
		/// <summary>Checks to see that the sidebar fills enough space</summary>
		/// <returns type="Boolean">True if the sidebar exceeds the minimum amount of content. False otherwise</returns>
		var sidebarMainHeight, sidebarFooterHeight;

		sidebarMainHeight = $$layoutShared.getElementHeight(this.__sidebarMainObject, 0);

		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Sidebar main content height: " + sidebarMainHeight + "px min height: " + this.__minSidebarHeight + "px");
		}

		return (sidebarMainHeight >= this.__minSidebarHeight);
	},

	__doesMainColumnFillEnoughSpace: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__doesMainColumnFillEnoughSpace()
	{
		/// <summary>Checks to see that the main column fills enough space</summary>
		/// <returns type="Boolean">True if the main column exceeds the minimum amount of content. False otherwise</returns>
		var pgSections, idx, mainContentOnSidebarPageHeight, boxes, boxIdx, pastSidebarPage;

		if (this.__mainColumn != null)
		{
			//Figure out the page one content height
			if ($$layoutShared.canUsePDFReactor())
			{
				mainContentOnSidebarPageHeight = 0;
				//If in PDF Reactor do this by looping through the pgSections in the main column that are on the first page and adding their heights
				pgSections = this.__mainColumn.querySelectorAll(".pgSection");
				for (idx = 0; idx < pgSections.length; idx++)
				{
					boxes = ro.layout.getBoxDescriptions(pgSections[idx]);
					if (boxes.length > 0)
					{
						for (boxIdx = 0; boxIdx < boxes.length; boxIdx++)
						{
							if (boxes[boxIdx].pageIndex == this.__sidebarPage - 1)
							{
								mainContentOnSidebarPageHeight += boxes[boxIdx].marginRect.height;
							} else if (boxes[boxIdx].pageIndex < this.__sidebarPage - 1)
							{
								continue;
							}
							else
							{
								pastSidebarPage = 1;
								break;
							}
						}
					}
					if (pastSidebarPage)
					{
						break;
					}
				}
			}
			else
			{
				//Since there isn't pagination in Hyperspace, our best guess is to just get the height of all of the main column content
				mainContentOnSidebarPageHeight = $$layoutShared.getElementHeight(this.__mainColumn, 1);
			}

			if (mainContentOnSidebarPageHeight >= this.__minMainHeight)
			{
				return true;
			}
			else
			{
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Main content on the sidebar page has a height of " + mainContentOnSidebarPageHeight + " which is less than the required height of " + this.__minMainHeight + " - removing the sidebar.");
				}
			}
		}
		else
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("No main column found - removing the sidebar since the main column won't fill enough space.");
			}
		}

		return false;
	},

	__mainColumnIsTooWide: function Epic$Common$ReportViewer$Plugins$ACSidebarFeature$__mainColumnIsTooWide()
	{
		/// <summary>Checks to see that the main column content isn't so wide that the sidebar should be removed</summary>
		/// <returns type="Boolean">True if the main column has content that exceeds the width we think it should be. False otherwise</returns>
		var currentSection, mainColRight, sidebarBottom, sidebarPageOfMainCol, boxes, currentSectionRight;

		//In PDF Reactor tables and such are resized, so this check isn't needed
		if (this.__mainColumn != null)
		{
			//PDF Reactor will force elements to be within their parent, but it doesn't stop the parent main column from overlapping with the sidebar
			//Check to see if that is happening, and if so, remove the sidebar
			if ($$layoutShared.canUsePDFReactor())
			{
				// Check if anything in the main column is making it overlap the sidebar
				// Round since PDFreactor Preview can sometimes think there's overlap due to insignificant differences
				boxes = ro.layout.getBoxDescriptions(this.__mainColumn);
				sidebarPageOfMainCol = boxes[this.__sidebarPage - 1];
				var sidebarLeft = $$layoutShared.getElementLeft(this.__sidebarObject, 3);
				var marginRight = sidebarPageOfMainCol.marginRect.right;

				sidebarLeft = $$layoutShared.round(sidebarLeft);
				marginRight = $$layoutShared.round(marginRight);

				if (sidebarLeft < marginRight)
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Main column overlapping with sidebar, setting flag to remove the sidebar.");
					}
					return true;
				}


				// Check if any tables within the main column are overlapping the sidebar
				var mainColTables = this.__mainColumn.querySelectorAll("table");

				for (var idx = 0; idx < mainColTables.length; idx++)
				{
					var currentTable = mainColTables[idx];
					var tableBoxes = ro.layout.getBoxDescriptions(currentTable);

					if (!tableBoxes || tableBoxes.length == 0) { continue; }									// Skip this table if no boxes found
					if (tableBoxes[tableBoxes.length - 1].pageIndex < (this.__sidebarPage - 1)) { continue; }   // Skip this table if before the sidebar
					if (tableBoxes[0].pageIndex > (this.__sidebarPage - 1)) { break; }							// Stop once we're past the sidebar page

					var elementRight = tableBoxes[0].marginRect.right;
					if (sidebarLeft < elementRight)
					{
						if (this.__debugMode)
						{
							$$layoutShared.addDebugStatement("Main column table overlapping with sidebar, setting flag to remove the sidebar.");
						}
						return true;
					}
				}
			}
			else
			{
				//In Hyperspace/when client printed the elements can extend past their parent, check to see if this is happening with any elements
				//that are next to the sidebar. If so, remove the sidebar.
				var prevMainColWidth, clientPrinting;

				if (document.querySelector("[data-plugin-isClientPrinting]") != null)
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("We are client printing.");
					}
					clientPrinting = 1;
					prevMainColWidth = this.__mainColumn.style.width;

					//When client printing the JS is run before the doc is laid out on the printed page so we have to estimate what space we'll have on
					// the printed page so things work appropriately.
					//380 is chosen because a portrait normal page (8.5x11) with .75 in margins has around 404px of main column space.
					//An A4 page is 8.27in (not 8.5), so if we reduce it via (8.27-1.5)/(8.5-1.5) then we have around 390px of main column space.
					//Then we subtracted a bit more just to play a little on the safe side and rounding and such so we ended up with 380.
					this.__mainColumn.style.width = "380px";
				}

				sidebarBottom = $$layoutShared.getElementBottom(this.__sidebarObject, 3);
				mainColRight = $$layoutShared.getElementRight(this.__mainColumn, 0);
				var pgSections = this.__mainColumn.querySelectorAll(".pgSection");

				for (var idx = 0; idx < pgSections.length; idx++)
				{
					currentSection = pgSections[idx];

					//Skip embedded sections since these are accounted for in the scrollwidth check on the parent section anyway
					//They can also cause issues due to the difference in how their top/right position are calculated
					if (currentSection.hasAttribute("data-sectdepth"))
					{
						if (currentSection.getAttribute("data-sectdepth") != 1)
						{
							continue;
						}
					}

					if ($$layoutShared.getElementTop(currentSection, 3) < sidebarBottom)
					{
						//The first check is to handle cases where the element's content is slightly wider than the element's width, but not so wide
						// that it extends outside of the main col. The second check is to determine if the element itself, or any of its contents extend
						// outside of the main col.

						//We have to set overflow to scroll to get accurate readings of scrollWidth when client printing
						var scrollWidth = currentSection.scrollWidth;
						var clientWidth = currentSection.clientWidth;

						//EXPLANATION OF MAGIC NUMBER -5: 
						//Setting the wiggle room to -5 because -1 should account for any decimal rounding issues, but there is also an IE bug that we have
						// to worry about. Specifically our embedded RTF uses white-space: pre-wrap to preserve spaces and such a provider might enter in a
						// text box. Using this style IE allows the trailing spaces to extend outside of the parent element, even if there were earlier spaces
						// that it could wrap with...technically this doesn't prevent that from ever happening, we stil could be turning off the sidebar in cases
						// where we don't really need to because all that is going outside the main col are transparent space chars, but we can't tell that. This
						// should catch the common case of having a single space character between words and should give enough space for that at reasonable font sizes.
						//We also don't have to worry about this actually overlapping with the sidebar since main column content has 16px of margin right between
						// it and the sidebar, so in theory we could increase this a bit if we feel we need to, but I wanted to stay as close to 1px as possible while
						// still accounting for the common single space character that I could.
						if ((scrollWidth - 5 > clientWidth && clientWidth != 0) || $$layoutShared.getElementRight(currentSection, 3) - 1 > mainColRight)
						{
							if (this.__debugMode)
							{
								$$layoutShared.addDebugStatement("Main column content not fitting next to sidebar, removing the sidebar.");
							}
							if (clientPrinting)
							{
								this.__mainColumn.style.width = prevMainColWidth;
							}
							return true;
						}
					}
				}

				if (clientPrinting)
				{
					this.__mainColumn.style.width = prevMainColWidth;
				}
			}
		}

		return false;
	}
};

$$pluginFactory.register("ACSidebarFeature", ACSidebarFeature.prototype.createInstance);