/*global document, ACDynamicFeature */
//***************************
// Copyright 2016-2023 Epic Systems Corporation
// Title: ACReportHandlingFeature.js
// Purpose: Feature to perform additional report handling such as making content fit
//
//			This functionality relies on PDFReactor:
//			http://www.pdfreactor.com/
// Author: Jordan Mauk
// Revision History:
//   *JRM 09/16 442930 - Created
//   *SDS 10/16 445113 - Add handling for resizing tall images
//   *JRM 11/16 450942 - Add handling for PDFreactor bug where table content is being cut off
//   *MBM 03/17 454064 - Create HSWeb file and add css function
//   *JRM 10/17 507902 - Move pdfreactor fix function for tables into finalize
//   *JRM 06/18 552271 - Prevent infinite loop related to images
//   *SDS 05/19 610172 - Avoid wrapping images to get image dimensions
//   *SDS 06/19 618848 - Get image dimensions directly
//   *SDS 02/20 668550 - Switch to querySelectorAll
//   *SDS 04/21 775397 - Fix finding the bothColumns element
//   *SDS 02/23 953973 - Only process tables within report
//***************************

ACReportHandlingFeature: function ACReportHandlingFeature()
{
	///<summary>Report handling feature class. Derived from ACDynamicFeature object</summary>

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

ACReportHandlingFeature.prototype = {
	//#region fields
	///<field name="__reportWidth" type="Number">Width of the content of the report in pixels. Only used outside of PDFreactor.</field>
	__reportWidth: null,

	///<field name="__gotImages" type="Boolean">Indicates whether we have searched the document for images already</field>
	__gotImages: null,

	///<field name="__images" type="HTMLElements">List of image elements in the document</field>
	__images: null,

	///<field name="__imageStartIdx" type="Number">Which index to start looking for images at</field>
	__imageStartIdx: 0,

	//#endregion


	createInstance: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$createInstance()
	{
		/// <summary>Creates an instance of ACReportHandlingFeature. This is called by the $$pluginFactory</summary>
		/// <returns type="ACReportHandlingFeature">An instance of ACReportHandlingFeature</returns>

		return new ACReportHandlingFeature();
	},

	styleSheetNeeded: function Epic$Common$ReportViewer$Plugins$ACRepeatingHeaderFeature$styleSheetNeeded()
	{
		/// <summary>Returns the name of a stylesheet if needed</summary>
		return "ACReportHandlingFeature.css";
	},

	needsToBeInitialized: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$needsToBeInitialized()
	{
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Returning true since this feature needs to load its associated css file.");
		}
		return true;
	},

	needsToBeRun: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$needsToBeRun()
	{
		/// <summary>Returns whether DoWork should be run</summary>
		// Return true since this feature should always be run
		return true;
	},

	initialize: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$initialize()
	{   /// <summary>Load the associated css file if it hasn't been loaded.</summary>

		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("In initialize - loading ACReportHandlingFeature.css if it hasn't already been loaded.");
		}

		if (typeof ($$rf) === 'undefined')
		{
			$$layoutShared.loadCSS("ACReportHandlingFeature");
		}

		//Need to do this here before the sidebar initialize has been run since the sidebar's initialize will change the report width.
		if (!$$layoutShared.canUsePDFReactor())
		{

			this.__getReportWidth();
		}
		return;
	},

	doWork: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$doWork()
	{
		/// <summary> Make the content fit within the width of a page </summary>
		var tables, idx, curTable, pageRight, internalCellsSpillOut;

		if ($$layoutShared.canUsePDFReactor())
		{
			if (document.querySelectorAll(".hasRightSidebar") != null)
			{
				//If there is a right sidebar the we just get the full page width and subtract the left margin width
				//because we want to make sure the tables fit on a full page width, not a page that has a sidebar width
				pageRight = ro.layout.getPageDescription(0).marginRect.right - ro.layout.getPageDescription(0).contentRect.left;
			}
			else
			{
				//If there is no sidebar or a left sidebar then we can just get the right of the content
				pageRight = ro.layout.getPageDescription(0).contentRect.right;
			}
		}
		else if (!this.__reportWidth)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Exiting since we couldn't find the report's width.");
			}
			return;
		}

		tables = document.querySelectorAll(".rpt table");

		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Examining " + tables.length + " tables.");
		}

		//Remove all of the classes from the tables in case we've run already - if we haven't this won't do anything
		for (idx = 0; idx < tables.length; idx++)
		{
			tables[idx].classList.remove("fixTableLayout", "autoHyphenate", "makeImagesInTableFit", "breakWord");
		}

		//Loop through all the tables and modify them as necessary
		for (idx = 0; idx < tables.length; idx++)
		{
			curTable = tables[idx];

			//Skip tables that should be handled by ACRTFTableScalingFeature
			if (curTable.classList.contains("fmtConvTable"))
			{
				continue;
			}

			if ($$layoutShared.canUsePDFReactor())
			{
				if (!this.__doesTableFitPDFreactor(curTable, pageRight))
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Turning on auto-hyphenation for table " + (idx + 1) + ".");
					}

					curTable.classList.add("autoHyphenate");

					if (!this.__doesTableFitPDFreactor(curTable, pageRight))
					{
						if (this.__debugMode)
						{
							$$layoutShared.addDebugStatement("Turning on break-word for table " + (idx + 1) + ".");
						}
						curTable.classList.remove("autoHyphenate");
						curTable.classList.add("fixTableLayout");		// Add table layout fixed for PDFreactor 10 when breaking words
						curTable.classList.add("breakWord");
					}
				}
			}
			else
			{
				//Check to see if the table's content spills outside of its parent, or if cells might be overlapping each other because their content spills out
				if ((curTable.parentElement.scrollWidth - 1) > this.__reportWidth)
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Turning on auto-hyphenation for table " + (idx + 1) + " because its parent's scrollwidth is: " + curTable.parentElement.scrollWidth + " and the report content's clientwidth is: " + this.__reportWidth);
					}
					curTable.classList.add("fixTableLayout");
					curTable.classList.add("autoHyphenate");

					//Now that we've set table-layout:fixed we can check to see if the table's contents spills outside of the table, or if its cells might be overlapping each other because their content spills out within the table
					internalCellsSpillOut = this.__doInternalCellsSpillOut(curTable);
					if ((curTable.scrollWidth - 1) > curTable.clientWidth || internalCellsSpillOut)
					{
						if (this.__debugMode)
						{
							if (internalCellsSpillOut)
							{
								$$layoutShared.addDebugStatement("Turning on makeImagesInTableFit for table " + (idx + 1) + " because its inner cells have content spilling out");
							} else
							{
								$$layoutShared.addDebugStatement("Turning on makeImagesInTableFit for table " + (idx + 1) + " because its scrollwidth is: " + curTable.scrollWidth + " and its clientwidth is: " + curTable.clientWidth);
							}
						}
						curTable.classList.add("makeImagesInTableFit");

						//Check to see if things still don't fit
						internalCellsSpillOut = this.__doInternalCellsSpillOut(curTable);
						if ((curTable.scrollWidth - 1) > curTable.clientWidth || internalCellsSpillOut)
						{
							if (this.__debugMode)
							{
								if (internalCellsSpillOut)
								{
									$$layoutShared.addDebugStatement("Turning on break word for table " + (idx + 1) + " because its inner cells have content spilling out");
								} else
								{
									$$layoutShared.addDebugStatement("Turning on break word for table " + (idx + 1) + " because its scrollwidth is: " + curTable.scrollWidth + " and its clientwidth is: " + curTable.clientWidth);
								}
							}
							curTable.classList.remove("autoHyphenate");
							curTable.classList.add("breakWord");
						}
					}
				}
			}
		}

	},

	doPageLevelWork: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$doPageLevelWork(pgIdx)
	{
		/// <summary>Does report handling functionality for the given page index</summary>
		// Don't do anything if not in PDFreactor
		if (!$$layoutShared.canUsePDFReactor())
		{
			return;
		}

		// Tall image handling - for each page, resize any super tall images so they fit on the page
		this.__resizeTallImages(pgIdx);
	},

	finalize: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$finalize()
	{
		/// <summary>Does report handling functionality at the very end of processing</summary>
		// Don't do anything if not in PDFreactor
		if (!$$layoutShared.canUsePDFReactor())
		{
			return;
		}
		// Temporary fix to a PDFreactor bug found in QAN 3750629
		this.__pdfReactorFix();
	},

	__pdfReactorFix: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$__pdfReactorFix()
	{
		var fontSize, modFontSize, idx, tables, prevTable, pageBottom, errorMessage, tablePrevModified, previouslyDone, errorMessageBoxes, tableBoxes, initialTableStartPage, initialTableEndPage, initialLastPageTableHeight;
		var tablesPreviouslyModified = {};

		pageBottom = ro.layout.getPageDescription(0).contentRect.bottom;

		//Loop through every table
		tables = document.getElementsByTagName("table");
		for (idx = 0; idx < tables.length; idx++)
		{
			curTable = tables[idx];

			//PDFreactor seems to get us the same table multiple times -- skip if this is the same as the last one we looked at
			//We also want to skip child tables since we will recognize/fix the parent table, so it is a waste to also look at the child table
			if (curTable === prevTable || this.__hasParentTable(curTable))
			{
				continue;
			}

			//When we manipulate things and throw in the error messages it can throw off our indexing a bit - this is to fix that.
			previouslyDone = false;
			for (tablePrevModified in tablesPreviouslyModified)
			{
				if (curTable === tablesPreviouslyModified[tablePrevModified])
				{
					previouslyDone = true;
					break;
				}
			}
			if (previouslyDone)
			{
				continue;
			}

			//If the table is broken (content goes beyond the bottom of the page) - try to fix it or at least display an error message
			if (this.__isTableBroken(curTable, pageBottom))
			{
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Found a broken table");
				}
				tablesPreviouslyModified[idx] = curTable;

				tableBoxes = ro.layout.getBoxDescriptions(curTable);
				if (tableBoxes && tableBoxes.length > 0)
				{
					initialTableStartPage = tableBoxes[0].pageIndex;
					initialTableEndPage = tableBoxes[tableBoxes.length - 1].pageIndex;
					initialLastPageTableHeight = tableBoxes[tableBoxes.length - 1].marginRect.height;
				}

				errorMessage = document.querySelectorAll(".renderDisplayWarning");
				if (errorMessage && errorMessage.length > 0)
				{
					errorMessage = errorMessage[0].cloneNode(true);
					errorMessage.classList.remove("hideMe");

					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Adding an error message since the table isn't displaying properly.");
					}

					if (initialLastPageTableHeight > (ro.layout.getPageDescription(initialTableEndPage).contentRect.height - 20))
					{
						//Set this as a flag so we know that the last page should just take the full page.
						initialLastPageTableHeight = -1;
					}

					curTable.parentNode.insertBefore(errorMessage, curTable);

					errorMessageBoxes = ro.layout.getBoxDescriptions(errorMessage);
					if (errorMessageBoxes && errorMessageBoxes.length > 0)
					{

						this.__addFillerWhitespace(errorMessageBoxes[errorMessageBoxes.length - 1].pageIndex, initialTableEndPage, initialLastPageTableHeight, errorMessage);
					}
					curTable.parentNode.removeChild(curTable);
				}
			}
			prevTable = curTable;
		}
	},

	__addFillerWhitespace: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature__addFillerWhitespace(startPage, lastPage, heightToFillOnLastPage, thingToInsertAfter)
	{
		var lastPageDiv, blankPageDiv, thingToInsertAfterParent, thingToInsertAfterNextSibling;

		thingToInsertAfterParent = thingToInsertAfter.parentNode;
		thingToInsertAfterNextSibling = thingToInsertAfter.nextSibling;
		if (startPage >= lastPage)
		{
			return;
		}

		//Fill the inner blank pages
		for (idx = 0; idx < (lastPage - startPage - 1); idx++)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Adding a blank page filler div for page " + (startPage + 1 + idx));
			}
			blankPageDiv = document.createElement("div");
			blankPageDiv.style.pageBreakBefore = "always";
			blankPageDiv.style.border = 0;
			blankPageDiv.style.margin = 0;
			blankPageDiv.style.padding = 0;
			thingToInsertAfterParent.insertBefore(blankPageDiv, thingToInsertAfterNextSibling);
			thingToInsertAfterNextSibling = blankPageDiv.nextSibling;
		}

		//Fill the height on the last page
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Adding a last page div for page " + lastPage + " of height " + heightToFillOnLastPage);
		}

		lastPageDiv = document.createElement("div");
		if (heightToFillOnLastPage == -1)
		{
			lastPageDiv.style.pageBreakAfter = "always";
			lastPageDiv.style.height = "0px";
		}
		else
		{
			lastPageDiv.style.height = heightToFillOnLastPage + "px";
		}

		lastPageDiv.style.pageBreakBefore = "always";
		lastPageDiv.style.border = 0;
		lastPageDiv.style.margin = 0;
		lastPageDiv.style.padding = 0;
		thingToInsertAfterParent.insertBefore(lastPageDiv, thingToInsertAfterNextSibling);
	},

	__isTableBroken: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$__isTableBroken(curTable, pageBottom)
	{
		var thead, cells, cellIdx, cellBoxes, cellBoxIdx;

		thead = curTable.getElementsByTagName("thead");
		if (thead && thead.length > 0)
		{
			cells = curTable.getElementsByTagName("td");
			if (cells && cells.length > 0)
			{
				for (cellIdx = 0; cellIdx < cells.length; cellIdx++)
				{
					cellBoxes = ro.layout.getBoxDescriptions(cells[cellIdx]);
					if (cellBoxes && cellBoxes.length > 0)
					{

						for (cellBoxIdx = 0; cellBoxIdx < cellBoxes.length; cellBoxIdx++)
						{
							if (cellBoxes[cellBoxIdx].marginRectInPage.bottom > pageBottom)
							{
								if (this.__debugMode)
								{
									$$layoutShared.addDebugStatement("Returning true because the bottom of the box is " + cellBoxes[cellBoxIdx].marginRectInPage.bottom + " page bottom is " + pageBottom);
								}
								return true;
							}
						}
					}
				}
			}
		}
	},

	__hasParentTable: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$__hasParentTable(elem)
	{
		while ((elem != null) && (elem.nodeName != "BODY"))
		{
			elem = elem.parentNode;
			if (elem.nodeName == "TABLE")
			{
				return true;
			}
		}
		return false;
	},

	__resizeTallImages: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$__resizeTallImages(pgIdx)
	{
		/// <summary>Loops through images in the document and resizes tall ones to fit on the page</summary>
		/// <param name="pgIdx" type="Number">Page index of the page being worked on</param>		
		var page, curImage, elementBoxes, imageHeight, pageHeight;

		// Get the page from the page index
		page = pgIdx + 1;

		// Get all images if not present already
		if (this.__gotImages != 1)
		{
			this.__images = document.querySelectorAll(".fmtConv img");
			this.__gotImages = 1;
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Retrieving all images in the document.");
			}

			// Mark hidden images moved by the Attachment feature as no-resize so we skip them
			var hiddenImages = document.querySelectorAll('div[data-plugin-attachment-moved="1"] .fmtConv img');

			if (hiddenImages && hiddenImages.length > 0)
			{
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Marking " + hiddenImages.length + " hidden images as data-noresize to skip processing them.");
				}

				for (var idx = 0; idx < hiddenImages.length; idx++)
				{
					hiddenImages[idx].setAttribute("data-noresize", '1');
				}
			}
		}

		// Loop through images, picking up where we left off
		for (var idx = this.__imageStartIdx; idx < this.__images.length; idx++)
		{
			// Get the current image & increment starting index
			curImage = this.__images[idx];
			this.__imageStartIdx = idx + 1;
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("At image [" + idx + "].");
			}

			// Check if the image explicitly should not be resized
			if (curImage.getAttribute("data-noresize") == 1)
			{
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Image [" + idx + "] should not be resized. Moving on.");
				}
				continue;
			}

			// Get the image's boxes
			elementBoxes = ro.layout.getBoxDescriptions(curImage);

			// Only work on visible images
			if (elementBoxes != null && elementBoxes.length > 0)
			{
				// Since the image is visible, get its height now
				imageHeight = $$layoutShared.getElementHeight(curImage, 3);

				if (!imageHeight)
				{
					$$layoutShared.forceReflow();
					imageHeight = $$layoutShared.getElementHeight(curImage, 3);
				}

				if (elementBoxes[0].pageIndex + 1 > page)
				{
					// Image is on a future page - break the loop to go to the next page
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Exiting the image loop because image [" + idx + "] is after the page we're looking at");
					}

					this.__imageStartIdx = idx;		// Make sure we go back to look at this image again
					break;
				}
			}
			else
			{
				// No boxes - continue on
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Skipping image [" + idx + "] because it doesn't have any boxes");
				}
				continue;
			}

			// --- At this point, we have an image that is on the current page ---
			// Ensure that we are not trying to look at a page that doesn't exist (due to previous resizing)
			if (page > ro.layout.numberOfPages)
			{
				pgIdx = ro.layout.numberOfPages - 1;
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Using page height of last page because page [" + page + "] doesn't exist");
				}
			}

			pageHeight = $$layoutShared.getPageContentHeight(pgIdx);

			// Ensure we have real heights to work with
			if (pageHeight && imageHeight)
			{
				// See if the image exceeds the page content height
				if (imageHeight >= (pageHeight - 45))
				{
					// Resize the image
					// Because pdfReactor carries over the padding of parent elements, we need to set the height so that any padding on the
					//  section and other parents will not overlap onto the footer and make it look cut off.
					// The current number is chosen based on pgSection padding-bottom (24) + some breathing room.
					curImage.style.height = (pageHeight - 45) + "px";
					curImage.style.width = "auto";

					// Set the no-resize attribute so this image isn't visited again.
					// This is needed because there are some cases when resizing moves images to what is technically
					//  a previous page, but still needs to be handled.
					curImage.setAttribute("data-noresize", '1');

					// Reflow the document - unfortunately, this is needed because PDFreactor doesn't handle elements larger than a page well.
					// Without the reflow, it's possible for our image resizing to confuse PDFreactor's page tracking, causing it to completely
					//  miss a subsequent image, thinking it's hidden and not displaying it at all on the final PDF.
					// Unfortunately, this is still needed in PDFreactor 10.
					$$layoutShared.forceReflow();

					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Resizing image [" + idx + "] so it will fit on the page.");
					}
				}
				else
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Leaving image [" + idx + "] alone.");
					}
				}
			}
			else
			{
				if (!imageHeight && this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Unable to find a height for image [" + idx + "].");
				}
				if (!pageHeight && this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Unable to find a height for the page.");
				}
			}
		}

	},

	__doesTableFitPDFreactor: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$__doesTableFitPDFreactor(table, rightLimit)
	{
		/// <summary> Function to determine if a table fits on the page in PDFreactor </summary>
		var boxes, boxIdx;

		boxes = ro.layout.getBoxDescriptions(table);
		if (boxes.length == 0)
		{
			return true;
		}

		for (boxIdx = 0; boxIdx < boxes.length; boxIdx++)
		{
			if (boxes[boxIdx].borderRectInPage.right > rightLimit)
			{
				return false;
			}
		}

		return true;
	},

	__getReportWidth: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$__getReportWidth()
	{
		/// <summary> Return the report content's width and set this.__reportWidth </summary>
		if (this.__reportWidth)
		{
			return this.__reportWidth;
		}
		else
		{
			var bothColumnsDiv = $$layoutShared.getBothColumns();

			if (bothColumnsDiv)
			{
				this.__reportWidth = bothColumnsDiv.clientWidth;
				return this.__reportWidth;
			}
			else
			{
				this.__reportWidth = null;
				return null;
			}
		}
	},

	__doInternalCellsSpillOut: function Epic$Common$ReportViewer$Plugins$ACReportHandlingFeature$__doInternalCellsSpillOut(table)
	{
		/// <summary> Check if cells within a table have content overflowing them </summary>
		var tdIdx, tds, thIdx, ths;

		tds = table.getElementsByTagName("td");
		for (tdIdx = 0; tdIdx < tds.length; tdIdx++)
		{
			if ((tds[tdIdx].scrollWidth - 1) > tds[tdIdx].clientWidth)
			{
				return true;
			}
		}

		ths = table.getElementsByTagName("th");
		for (thIdx = 0; thIdx < ths.length; thIdx++)
		{
			if ((ths[thIdx].scrollWidth - 1) > ths[thIdx].clientWidth)
			{
				return true;
			}
		}
		return false;
	},
};

$$pluginFactory.register("ACReportHandlingFeature", ACReportHandlingFeature.prototype.createInstance);