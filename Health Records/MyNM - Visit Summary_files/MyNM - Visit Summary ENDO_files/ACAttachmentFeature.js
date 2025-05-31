/*global document, ACDynamicFeature */
//***************************
// Copyright 2016-2019 Epic Systems Corporation
// Title: ACAttachmentFeature.js
// Purpose: Report Attachment Feature
//
//			This functionality relies on PDFReactor:
//			http://www.pdfreactor.com/
// Author: Sean Stemme
// Revision History:
//   *SDS 04/16 T17955 - Created
//   *SDS 06/16 T20176 - Don't repeat headers for attachments
//   *JRM 11/16 454007 - Use breakBefore class instead of manually setting
//                       page-break-before: always style
//   *JRM 06/17 488467 - Remove unnecessary reflow for performance
//   *JRM 10/17 507077 - Respect page break config passed from the server
//   *SDS 06/19 618848 - Remove old attachment element instead of hiding it
//***************************

ACAttachmentFeature: function ACAttachmentFeature()
{
	///<summary>Attachment feature class. Derived from ACDynamicFeature object</summary>

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

ACAttachmentFeature.prototype = {

	createInstance: function Epic$Common$ReportViewer$Plugins$ACAttachmentFeature$createInstance()
	{
		/// <summary>Creates an instance of ACAttachmentFeature. This is called by the $$pluginFactory</summary>
		/// <returns type="ACAttachmentFeature">An instance of ACAttachmentFeature</returns>

		return new ACAttachmentFeature();
	},

	needsToBeInitialized: function Epic$Common$ReportViewer$Plugins$ACAttachmentFeature$needsToBeInitialized()
	{
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Returning false since this feature doesn't need to be initialized.");
		}
		return false;
	},

	needsToBeRun: function Epic$Common$ReportViewer$Plugins$ACAttachmentFeature$needsToBeRun()
	{
		/// <summary>Returns whether DoWork should be run</summary>
		// Always run this feature
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Running doWork.");
		}
		return true;
	},

	initialize: function Epic$Common$ReportViewer$Plugins$ACAttachmentFeature$initialize()
	{   /// <summary>We don't need to do any initialization for the attachment feature.</summary>
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("In initialize - doing nothing since this feature doesn't need initialization.");
		}
		return;
	},

	doWork: function Epic$Common$ReportViewer$Plugins$ACAttachmentFeature$doWork()
	{
		/// <summary>Loops through elements and determines if they should be made attachments</summary>
		var attachableElements, idx, pageHeight, elementSize, maxSize, currentPage, currentBoxes;

		// If there aren't any attachable elements, no extra logic should be run
		attachableElements = document.querySelectorAll("[data-plugin-attachment-size]");
		if (attachableElements.length == 0)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("No attachable elements - quitting out.");
			}
			return;
		}

		// (Hyperspace) Determine the height of the page
		if (!$$layoutShared.canUsePDFReactor())
		{
			pageHeight = $$layoutShared.getPageContentHeight(0);
		}


		// Determine if each attachable element should be made into an attachment
		for (idx = 0; idx < attachableElements.length; idx++)
		{
			// Don't do anything if the parent has been already marked as moved
			if (attachableElements[idx].parentNode.getAttribute("data-plugin-attachment-moved") == 1)
			{
				continue;
			}


			// (PDFReactor) Determine the height of the page we're on
			if ($$layoutShared.canUsePDFReactor())
			{
				currentBoxes = ro.layout.getBoxDescriptions(attachableElements[idx]);

				if (currentBoxes == null || currentBoxes[0] == null)
				{
					// Unable to get actual page, so just use the first page's content height
					pageHeight = $$layoutShared.getPageContentHeight(0);
				}
				else
				{
					// Get the actual page's content height
					currentPage = currentBoxes[0].pageIndex;
					pageHeight = $$layoutShared.getPageContentHeight(currentPage);
				}
			}

			// Get the height of the element and % of the page it takes up
			elementSize = $$layoutShared.getElementHeight(attachableElements[idx], 3);
			maxSize = this.__inchesToPx(attachableElements[idx].getAttribute("data-plugin-attachment-size"));

			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Attachable #" + idx + ": element height = " + elementSize + "px. Comparing to max of " + maxSize + "px.");
			}

			// If element is not too large, do nothing to it and continue
			if (elementSize <= maxSize)
			{
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Attachable #" + idx + ": quitting because element is not big enough to be an attachment.");
				}
				continue;
			}

			// Otherwise, make it into an attachment
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Attachable #" + idx + ": making into an attachment.");
			}

			this.__makeAttachment(attachableElements[idx]);
		}
	},

	doPageLevelWork: function Epic$Common$ReportViewer$Plugins$ACAttachmentFeature$doPageLevelWork(pgIdx)
	{
		if (pgIdx == 0)
		{
			this.doWork();
		}
	},

	__makeAttachment: function Epic$Common$ReportViewer$Plugins$ACAttachmentFeature$__makeAttachment(attachElement)
	{
		/// <summary>Turns an element into an attachment, moving it to the end of the document on its own page</summary>
		/// <param name="attachElement" type="HTMLElement">Element to make an attachment</param>
		var attachmentWrapper, elementCopy;
		var attachParent = attachElement.parentNode;

		// Create the wrapper div and copy of the element
		attachmentWrapper = document.createElement("div");
		elementCopy = attachElement.cloneNode(true);

		// Mark the parent as having a moved attachment
		attachParent.setAttribute("data-plugin-attachment-moved", '1');

		// Add the wrapper div to either the placeholder or the end of the document
		this.__addAttachmentWrapper(attachmentWrapper, attachElement);

		// Add the copy to the end of the document, set attachment attributes
		attachmentWrapper.appendChild(elementCopy);
		elementCopy.setAttribute("data-plugin-attachment", '1');
		elementCopy.setAttribute("data-sectdepth", '1');
		elementCopy.removeAttribute("data-plugin-attachment-size");

		// Set class on the copy so that it doesn't repeat headers
		elementCopy.classList.add("singleHeader");

		// Remove the element instead of hiding it
		attachParent.removeChild(attachElement);

		// Prevent issues where the attachment content would push the section to the next page,
		//  but moving the attachment wouldn't move the section back
		this.__reflowAttachment(attachParent);
	},

	__reflowAttachment: function Epic$Common$ReportViewer$Plugins$ACAttachmentFeature$__reflowAttachment(attachParent)
	{
		/// <summary>Toggles the background color of an Instructions attachment to 'mini-reflow' it and fix issues like in ZDQ 16939846</summary>
		/// <param name="attachParent" type="HTMLElement">Parent of the attachment element</param>

		// Find the nearest .sectInstr parent
		while (attachParent && (!attachParent.classList.contains("sectInstr")))
		{
			attachParent = attachParent.parentElement;
		}

		// Toggle the background color
		if (attachParent)
		{
			attachParent.style.backgroundColor = "white";
			attachParent.style.backgroundColor = "";
		}
	},

	__addAttachmentWrapper: function Epic$Common$ReportViewer$Plugins$ACAttachmentFeature$__addAttachmentWrapper(wrapper, attachElement)
	{
		/// <summary>Turns an element into an attachment, moving it to the end of the document on its own page</summary>
		/// <param name="wrapper" type="HTMLElement">Wrapper element to place in the document</param>
		/// <param name="attachElement" type="HTMLElement">Element being made an attachment</param>
		var foundElement, searchElement, placeholder, pgSections, idx, boxes, pageBreakBehavior;

		// First find the correct element to search within the document (such as for bilingual printouts)
		searchElement = attachElement;
		while (foundElement != 1)
		{
			// Find the bothColumns div the starting element is within
			if ((' ' + searchElement.className + ' ').indexOf(' bothColumns ') > -1)
			{
				// Found the div
				foundElement = 1;
			}
			else if (searchElement == document.body)
			{
				// Reached the body, so couldn't find any bothColumns div and it's best to use this element
				foundElement = 1;
			}
			else
			{
				// Keep searching through the parents
				searchElement = searchElement.parentNode;
			}
		}


		// === Attempt to add to placeholder ===
		placeholder = searchElement.querySelector("[data-plugin-attachment-placeholder]");
		if (placeholder != null)
		{
			//Add page break behavior based on config from the server
			pageBreakBehavior=placeholder.getAttribute("data-plugin-attachment-page-break-behavior");
			if (pageBreakBehavior == 1)
			{
				wrapper.classList.add("breakAvoid");
			}
			else if (pageBreakBehavior == 2)
			{
				wrapper.classList.add("breakBefore");
			}
			
			// Add to the placeholder 
			placeholder.appendChild(wrapper);

			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Adding attachment to placeholder.");
			}
			return;
		}


		// === Adding to the end of the document ===
		pgSections = searchElement.querySelectorAll(".pgSection[data-sectdepth='1']");

		// Don't do anything if there are no other pgSections to add to
		if (pgSections.length < 1)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Quitting out because there are no other sections to put the attachment underneath.");
			}
			return;
		}
		idx = pgSections.length - 1;


		// Ensure we're not inserting the element within a pgSection whose parent has display:none or something similar
		pgSections[idx].parentNode.appendChild(wrapper);

		if ($$layoutShared.canUsePDFReactor())
		{
			// PDFReactor - accurately detect non-visible parents
			boxes = ro.layout.getBoxDescriptions(wrapper);
			while (boxes.length == 0)
			{
				pgSections[idx].parentNode.removeChild(wrapper);
				idx--;
				if (idx < 0)
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Quitting out because there are no other sections to put the attachment underneath.");
					}
					return;
				} else
				{
					pgSections[idx].parentNode.appendChild(wrapper);
					boxes = ro.layout.getBoxDescriptions(wrapper);
				}
			}
		}
		else
		{
			// Hyperspace - only detects non-visible sections, not parents
			while (pgSections[idx].style.display == "none")
			{
				pgSections[idx].parentNode.removeChild(wrapper);
				idx--;
				if (idx < 0)
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Quitting out because there are no other sections to put the attachment underneath.");
					}
					return;
				} else
				{
					pgSections[idx].parentNode.appendChild(wrapper);
				}
			}
		}

		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Adding attachment to end of document.");
		}
	},

	__inchesToPx: function Epic$Common$ReportViewer$Plugins$ACAttachmentFeature$__inchesToPx(inches)
	{
		/// <summary>Converts from given inches to pixels</summary>
		// Use the PDFreactor default
		return (inches * 96);
	},

};

$$pluginFactory.register("ACAttachmentFeature", ACAttachmentFeature.prototype.createInstance);