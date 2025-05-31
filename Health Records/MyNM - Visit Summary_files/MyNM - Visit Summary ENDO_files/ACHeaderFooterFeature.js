/*global document, ACDynamicFeature */
//***************************
// Copyright 2016-2022 Epic Systems Corporation
// Title: ACHeaderFooterFeature.js
// Purpose: Report Header/Footer Feature
//
//			This functionality relies on PDFReactor:
//			http://www.pdfreactor.com/
// Author: Jordan Mauk
// Revision History:
//   *JRM 02/16 T16710 - Created
//   *JRM 06/16 T19868 - Move some of the styles to a CSS file for performance
//   *JRM 06/16 T20150 - Move some of the styles to server code for performance
//   *SDS 07/16 T19570 - Reflow margins if header isn't showing up.
//   *JRM 07/16 T20627 - Add handling for the header to be on pages other than the first so
//                       it will still work properly with cover pages.
//   *MBM 03/17 454064 - Create HSWeb file and add function to return script
//   *JRM 05/17 484703 - Fix page count and performance for cover page/footer interaction
//   *JRM 06/17 487140 - Don't set page count if not needed because a footer is being shown on the cover page
//   *JRM 06/17 489982 - Don't set footer div height since it isn't actually doing anything and causes a reflow
//   *JRM 09/17 501915 - Don't set bottom margin height unless we really need to so we don't cause a reflow
//   *JRM 11/17 514160 - Check if footer exists/force reflow before footer height setting code
//   *SDS 06/19 618848 - Remove unnecessary reflows for PDFreactor 10
//   *SDS 02/20 668550 - Handle header size of 0
//   *SDS 04/21 775397 - Fix finding the bothColumns element
//   *JF  03/22 856706 - Low vision accessibility tweaks
//***************************

ACHeaderFooterFeature: function ACHeaderFooterFeature()
{
	///<summary>Header/Footer feature class. Derived from ACDynamicFeature object</summary>

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

ACHeaderFooterFeature.prototype = {
	//#region fields
	///<field name="__headerObject" type="HTMLElement">Element that represents the header</field>
	__headerObject: null,
	///<field name="__footerObject" type="HTMLElement">Element that represents the footer</field>
	__footerObject: null,
	///<field name="__idObject" type="">Object to hold unique ids</field>
	__idObject: {},
	///<field name="__headerFooterParentObject" type="HTMLElement">Element that represents the parent div of the header/footer in non-PDF Reactor mode</field>
	__headerFooterParentObject: null,
	///<field name="__hasBeenInitialized" type="Boolean">Indicates whether initialize has been called</field>
	__hasBeenInitialized: false,
	///<field name="__hasBeenRun" type="Boolean">Indicates whether DoWork has been called</field>
	__hasBeenRun: false,
	///<field name="__headerPage" type="Number">Indicates which page the header should be placed on</field>
	__headerPage: 1,
	//#endregion

	createInstance: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$createInstance()
	{
		/// <summary>Creates an instance of ACHeaderFooterFeature. This is called by the $$pluginFactory</summary>
		/// <returns type="ACHeaderFooterFeature">An instance of ACHeaderFooterFeature</returns>

		return new ACHeaderFooterFeature();
	},

	styleSheetNeeded: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$styleSheetNeeded()
	{
		/// <summary>Returns the name of a stylesheet if needed</summary>
		return "ACHeaderFooterFeature.css";
	},

	needsToBeInitialized: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$needsToBeInitialized()
	{
		/// <summary>Determines whether the initialize function should be run</summary>
		/// <returns type="Boolean">True if initialize should be run. False otherwise</returns>
		if (!(this.__hasBeenInitialized && this.__headerFooterObjectsMatchDivs()))
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Initializing because it hasn't been run yet.");
			}
			return true;
		}
		if (this.__headerFooterDivsExist())
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Not initializing because the header already exists.");
			}
			return false;
		}
		else
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Run initialize even though we have initialized before, because header does not exist.");
			}
			return true;
		}
	},

	needsToBeRun: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$needsToBeRun()
	{
		/// <summary>Returns whether DoWork should be run</summary>
		/// <returns type="Boolean">True if DoWork should be run. False otherwise</returns>

		if (!this.__hasBeenRun)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Running doWork because it hasn't been run yet.");
			}
			return true;
		}
		else if (this.__headerFooterObjectsExist())
		{
			if (document.querySelectorAll("[data-headerID]").length > 0 || document.querySelectorAll("[data-footerID]").length > 0)
			{
				//If the elements are already added and such, no need to run doWork again
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Not running doWork because headerID/footerID's already exist.");
				}
				return false;
			}
			//Should still do some work if the header is empty.
			else if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Running doWork because no headerID/footerID's exist so we likely haven't run doWork.");
			}
			return true;
		}
		//If we don't have the header at all, we shouldn't try and play with the elements in the header
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Not running doWork because there is no header/footer object, so we can't perform operations on it.");
		}
		return false;
	},

	initialize: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$initialize()
	{
		/// <summary>Initializes the feature by creating the sidebar elements and adding them to the DOM</summary>
		var headerCreatedHere, footerCreatedHere;

		this.__hasBeenInitialized = true;
		if (typeof ($$rf) === 'undefined')
		{
			$$layoutShared.loadCSS("ACHeaderFooterFeature");
		}

		//Retrieve the parent element for the sidebar
		this.__headerFooterParentObject = $$layoutShared.getBothColumns();
		if (!this.__headerFooterParentObject)
		{
			return;
		}

		this.__headerObject = document.getElementById("RptHeader");


		//Initialize the header object
		if (!this.__headerObject)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Creating Header Object");
			}
			headerCreatedHere = true;

			this.__headerObject = document.createElement("div");
			this.__headerObject.id = "RptHeader";
			var elem = document.querySelector("[data-plugin-start-on-page]");

			if (elem)
			{
				this.__headerPage = elem.getAttribute("data-plugin-start-on-page");
			}

			this.__headerObject.className = "mainColumn header page" + this.__headerPage;

			//If using PDF reactor, move the header to the margin
			if ($$layoutShared.canUsePDFReactor())
			{
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Adding PDFReactor-specific setup");
				}

				// If the padding top was already set by server code, we don't need to set it again.
				// Check a data attribute set on the server because it's faster than relayouting the document to get the computed style.
				var addedPaddingTop = false;
				var elemAddedPadding = document.querySelector("[data-added-pad-top]");

				if (elemAddedPadding)
				{
					addedPaddingTop = true;
				}

				if (!addedPaddingTop)
				{
					if (ro.layout.numberOfPages > this.__headerPage) 
					{
						// Grab the margin from 2nd page so that we don't run into the true AVS header's height needs.
						// GetPageDescription is 0 indexed, but __headerPage is 1 indexed, so what we actually want is the page after the header, but in this case that is actually just __headerPage. 
						// Most likely marginRect.top will be 0, but it's possible that may change in the future
						this.__headerObject.style.paddingTop = (ro.layout.getPageDescription(this.__headerPage).contentRect.top - ro.layout.getPageDescription((this.__headerPage)).marginRect.top) + "px"
					}
					else
					{
						// If we don't have a safe header margin to use, fall back to the footer margin, it should be close to a normal header height. 
						this.__headerObject.style.paddingTop = (ro.layout.getPageDescription((this.__headerPage - 1)).marginRect.bottom - ro.layout.getPageDescription((this.__headerPage - 1)).contentRect.bottom) + "px";
					}

					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Default header padding set: " + this.__headerObject.style.paddingTop);
					}

				}
			}
			//If not using PDF reactor, just add it to the top
			else
			{
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Adding Hyperspace-specific setup");
				}
				this.__headerObject.style.display = "block";
			}
		}

		//Initialize the footer object
		this.__footerObject = document.getElementById("RptFooter");
		if (!this.__footerObject)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Creating Footer Object");
			}
			footerCreatedHere = true;

			this.__footerObject = document.createElement("div");
			this.__footerObject.id = "RptFooter";

			this.__footerObject.className = "mainColumn footer";

			//If using PDF reactor, move the footer to the margin
			if ($$layoutShared.canUsePDFReactor())
			{
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Adding PDFReactor-specific setup");
				}
			}
			//If not using PDF reactor, just remove it
			else
			{
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Adding Hyperspace-specific setup");
				}
				this.__footerObject.style.display = "none";
			}
		}

		//Insert the header object into the DOM
		if (headerCreatedHere)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Adding Header Object to DOM");
			}
			this.__headerFooterParentObject.insertBefore(this.__headerObject, this.__headerFooterParentObject.firstChild);
		}

		//Insert the footer object into the DOM
		if (footerCreatedHere)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Adding Footer Object to DOM");
			}

			var elems = document.querySelectorAll(".EmptyFooter");
			if (elems != null && elems.length > 0)
			{
				//If there are empty footers the goal is to replace the normal footer with them so we don't have a footer on cover page(s)
				//Therefore we need to move the normal footer below the empty footers, that is how PDF reactor footers work.
				var lastEmptyFooter = elems[elems.length - 1];
				lastEmptyFooter.parentNode.insertBefore(this.__footerObject, lastEmptyFooter.nextSibling);
			}
			else
			{
				this.__headerFooterParentObject.insertBefore(this.__footerObject, this.__headerFooterParentObject.firstChild);
			}
		}

		return;
	},

	doWork: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$doWork()
	{
		/// <summary>Places elements in the header/footer</summary>
		var elementIndex, headerElements, footerElements, footerContentHeight;

		this.__hasBeenRun = true;
		if (!this.__headerFooterObjectsExist())
		{
			return true;
		}

		if (document.querySelectorAll("[data-headerID]").length > 0 || document.querySelectorAll("[data-footerID]").length > 0)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Resetting Header and Footer");
			}
			this.__undoDoWork();
		}

		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Adding Header Elements");
		}

		headerElements = this.__getHeaderFooterElements();
		for (elementIndex = 0; elementIndex < headerElements.length; elementIndex++)
		{
			this.__addElementToObject(headerElements[elementIndex], this.__headerObject, "header", "data-headerID", "data-plugin-header-content");
		}

		if (headerElements.length > 0)
		{
			if ($$layoutShared.canUsePDFReactor())
			{
				var headerSize = Math.round($$layoutShared.getElementHeight(this.__headerObject, 3));
				var marginSize = Math.round(ro.layout.getPageDescription((this.__headerPage - 1)).contentRect.top);
				var excessMargin = marginSize - headerSize;

				//If the header doesn't fit in the space we're giving it OR we've given it way too much space, then set the margin top (this could have already been set appropriately by the server)
				if ((headerSize > marginSize) || (excessMargin > 20))
				{
					var margin = headerSize;
					if (!margin)
					{
						margin = marginSize;
					}

					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Setting top margin on page " + this.__headerPage + " to " + margin + " since the header height is " + headerSize + ", the margin height is " + marginSize + ", and the excess margin top is " + excessMargin);
					}
					document.styleSheets[0].insertRule('@page:-ro-nth(' + this.__headerPage + '){margin-top:' + margin + 'px !important;}', 0);
				}
			}
		}

		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Adding Footer Elements To Footer Div");
		}

		footerElements = this.__getHeaderFooterElements(1);
		if (footerElements.length == 0)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Quitting - no footer elements");
			}
			return;
		}

		for (elementIndex = 0; elementIndex < footerElements.length; elementIndex++)
		{
			this.__addElementToObject(footerElements[elementIndex], this.__footerObject, "footer", "data-footerID", "data-plugin-footer-content");
		}

		if (!$$layoutShared.canUsePDFReactor())
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Not adding footer styling since we aren't in PDF Reactor and the footer isn't displayed in Hyperspace");
			}
			return;
		}

		//  Make sure this check is run before the footer height reading so we can set the bottom margin height correctly.
		//  Content check - if header or footer are empty for some reason, reflow the document to make them appear.
		//  This ideally wouldn't be necessary, but may happen if the Sidebar or Repeating Header features are not
		//   present to set the margins and reflow the document enough to make the header/footer appear.
		var headerHeight = $$layoutShared.getElementHeight(this.__headerObject, 3);
		var footerHeight = $$layoutShared.getElementHeight(this.__footerObject, 3);
		if (headerHeight == 0 || footerHeight == 0)
		{
			$$layoutShared.forceReflow();

			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Reflowing the document because the header and footer previously were not appearing.");
			}
		}

		boxes = ro.layout.getBoxDescriptions(this.__footerObject);
		if (boxes.length > 0)
		{
			footerContentHeight = Math.round(boxes[0].marginRect.height);
		}
		else
		{
			footerContentHeight = 0;
		}

		originalBottomMargin = ro.layout.getPageDescription(0).marginRect.bottom - ro.layout.getPageDescription(0).contentRect.bottom;
		if ((footerContentHeight + 28) > originalBottomMargin) //Add 28 px since that is the extra space needed when 18pt font wraps (which could happen if we transition from page 9 of 10 to 10 of 10 or something).
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Setting bottom margin since the footer height is " + footerContentHeight + " and the bottom margin height is " + originalBottomMargin);
			}
			document.styleSheets[0].insertRule('@page{margin-bottom:' + (footerContentHeight + 28) + 'px !important;}', 0);
		}

		// Content check - if header or footer are empty for some reason, reflow the document to make them appear.
		// This ideally wouldn't be necessary, but may happen if the Sidebar or Repeating Header features are not
		//  present to set the margins and reflow the document enough to make the header/footer appear.
		headerHeight = $$layoutShared.getElementHeight(this.__headerObject, 3);
		footerHeight = $$layoutShared.getElementHeight(this.__footerObject, 3);
		if (headerHeight == 0 || footerHeight == 0)
		{
			$$layoutShared.forceReflow();

			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Reflowing the document because the header and footer previously were not appearing.");
			}
		}
	},

	doPageLevelWork: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$doPageLevelWork(pgIdx)
	{
		/// <summary>If the header isn't on page 1 then we are adding a cover page(s) and we need to dynamically set the footer's total page count to disregard cover page(s)</summary>
		var pageCountNotIncludingCoverPages;

		if (!$$layoutShared.canUsePDFReactor())
		{
			return;
		}

		//This is the general cover page case
		if (this.__headerPage != 1)
		{
			//This is so we only run it on the last few pages for performance
			if (pgIdx >= ro.layout.numberOfPages - 2)
			{
				//This is to prevent causing a reflow if we are going to have a footer on the cover page because then we don't need to set the page count manually - it will have used the normal counter(pages) method.
				if (document.querySelectorAll(".EmptyFooter").length > 0)
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("The page count is empty because we don't run page level functions on debug only pages and we only want to set the info once (at the end of the document) - which we can't do since the end of the document is debug only pages.");
					}

					var styleElement = document.createElement("style");
					if (this.__headerPage == 2)
					{
						pageCountNotIncludingCoverPages = pgIdx;
						styleElement.appendChild(document.createTextNode("html { string-set: numberOfPages '" + pageCountNotIncludingCoverPages + "';}"));
					} else if (this.__headerPage == 3)
					{
						pageCountNotIncludingCoverPages = pgIdx - 1;
						styleElement.appendChild(document.createTextNode("html { string-set: numberOfPages '" + pageCountNotIncludingCoverPages + "';}"));
					}
					document.head.appendChild(styleElement);
				}
			}
		}
	},

	__undoDoWork: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$__undoDoWork()
	{
		/// <summary>Undoes work done by DoWork (removes header/footer elements)</summary>
		this.__undoObjectWork(this.__headerObject, "data-headerID");
		this.__undoObjectWork(this.__footerObject, "data-footerID");

	},

	__undoObjectWork: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$__undoObjectWork(object, idString)
	{
		var objectElements, objectElement, elementID, mainColElement, elementIndex;
		if (object)
		{
			objectElements = object.childNodes;
			for (elementIndex = 0; elementIndex < objectElements.length;)
			{
				objectElement = objectElements[elementIndex];
				if (objectElement.hasAttribute(idString))
				{
					elementID = objectElement.getAttribute(idString);
					objectElement.parentNode.removeChild(objectElement);

					mainColElement = document.querySelector("[" + idString + "=\"" + elementID + "\"]");
					mainColElement.style.display = "";
					mainColElement.removeAttribute(idString);
				}
			}
		}
	},

	__headerFooterObjectsMatchDivs: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$__headerFooterObjectsMatchDivs()
	{
		if (document.getElementById("RptHeader") === this.__headerObject && document.getElementById("RptFooter") === this.__footerObject)
		{
			return true;
		}
		else
		{
			return false;
		}
	},
	__headerFooterDivsExist: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$__headerFooterDivsExist()
	{
		if (document.getElementById("RptHeader") == null || document.getElementById("RptFooter") == null)
		{
			return false;
		}
		else
		{
			return true;
		}
	},

	__headerFooterObjectsExist: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$__headerFooterObjectsExist()
	{
		if (this.__headerObject == null || this.__footerObject == null)
		{
			return false;
		}
		else
		{
			return true;
		}
	},

	__getHeaderFooterElements: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$__getHeaderFooterElements(getFooterElements)
	{
		/// <summary>Returns all elements marked to be in the header</summary>
		/// <returns type="Array">Array of elements marked to be in the header/footer</returns>
		if (getFooterElements) return document.querySelectorAll("[data-plugin-footer-content]");
		return document.querySelectorAll("[data-plugin-header-content]");
	},

	__addElementToObject: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$__addElementToObject(element, object, objectName, idString, attrString)
	{
		/// <summary>Adds an element to an object</summary>
		/// <param name="element" type="HTMLElement">Element to add to footer</param>
		var elementCopy;

		if (!element.hasAttribute(idString))
		{
			element.setAttribute(idString, this.__generateObjectID(idString));
		}

		//Remove the data attribute from the copy to avoid an infinite loop due to the way Javascript maintains arrays returned by querySelectorAll
		elementCopy = element.cloneNode(true);
		if (elementCopy.hasAttribute(attrString))
		{
			elementCopy.removeAttribute(attrString);
		}

		//Append copy to the object
		if (object)
		{
			object.appendChild(elementCopy);
		}

		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Element added to " + objectName);
		}
		element.style.display = "none";
		return true;
	},

	__generateObjectID: function Epic$Common$ReportViewer$Plugins$ACHeaderFooterFeature$__generateObjectID(idString)
	{
		/// <summary>Generates a unique ID for the header element and the element it was copied from</summary>
		/// <returns type="Numeric">Unique ID</returns>
		if (this.__idObject[idString] == null)
		{
			this.__idObject[idString] = 0;
		}
		return this.__idObject[idString]++;
	}

};

$$pluginFactory.register("ACHeaderFooterFeature", ACHeaderFooterFeature.prototype.createInstance);