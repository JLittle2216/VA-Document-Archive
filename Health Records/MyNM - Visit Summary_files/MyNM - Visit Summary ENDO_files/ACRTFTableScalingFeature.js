/*global document, ACDynamicFeature */
//***************************
// Copyright 2016-2021 Epic Systems Corporation
// Title: ACRTFTableScalingFeature.js
// Purpose: Report RTF Table Scaling Feature
//			
//			This functionality relies on PDFReactor:
//			http://www.pdfreactor.com/
// Author: Danny Smith
// Revision History:
//   *DS  07/16 T20455 - Created
//   *SDS 06/19 618848 - Check embedded tables themselves to see if they're too wide
//   *SDS 02/20 668550 - Switch to querySelectorAll
//   *SDS 11/21 835047 - PDFreactor workaround
//***************************

ACRTFTableScalingFeature: function ACRTFTableScalingFeature()
{
	///<summary>RTF Table Scaling feature class. Derived from ACDynamicFeature object</summary>

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

ACRTFTableScalingFeature.prototype = {

	__overrideClassName: "fmtConvDisableOverrides",

	createInstance: function Epic$Common$ReportViewer$Plugins$ACRTFTableScalingFeature$createInstance()
	{
		/// <summary>Creates an instance of ACRTFTableScalingFeature. This is called by the $$pluginFactory</summary>
		/// <returns type="ACRTFTableScalingFeature">An instance of ACRTFTableScalingFeature</returns>

		return new ACRTFTableScalingFeature();
	},

	needsToBeInitialized: function Epic$Common$ReportViewer$Plugins$ACRTFTableScalingFeature$needsToBeInitialized()
	{
		/// <summary>Returns true as this feature needs to be initialized</summary>
		/// <returns type="boolean">returns true</returns>
		return false;
	},

	needsToBeRun: function Epic$Common$ReportViewer$Plugins$ACRTFTableScalingFeature$needsToBeRun()
	{
		/// <summary>Returns whether DoWork should be run</summary>
		/// <returns type="boolean">Always returns true since this feature implements doWork</returns>
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Returning true since this feature needs to doWork.");
		}
		return true;
	},

	doWork: function Epic$Common$ReportViewer$Plugins$ACRTFTableScalingFeature$doWork()
	{   /// <summary>Initializes scaled RTF tables and sets a class on tables that should not be overridden by CSS since they are too large for a page</summary>
		var fmtConvTables, curTable, nestedTables;

		fmtConvTables = document.querySelectorAll(".fmtConvTable");
		if (this.__debugMode)
		{
			$$layoutShared.startDebugLevel("In initialize - " + fmtConvTables.length + " scaled RTF tables found.");
		}

		for (var i = 0; i < fmtConvTables.length; i++)
		{
			curTable = fmtConvTables[i];

			//If this element is already overridden (meaning it is a nested table), skip it
			if ((" " + curTable.className + " ").indexOf(" " + this.__overrideClassName + " ") > -1)
			{
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Table " + i + " was previously overridden (nested table)")
				}
				continue;
			}

			if (this.__isTableTooWide(curTable))
			{
				this.__allowTableTextWrapping(curTable);

				nestedTables = curTable.querySelectorAll(".fmtConvTable");
				for (var j = 0; j < nestedTables.length; j++)
				{
					this.__allowTableTextWrapping(nestedTables[j]);
				}

				// Mini-reflow to work around a PDFreactor failure (QAN 6620003)
				var bgColor = curTable.style.backgroundColor;
				curTable.style.backgroundColor = "white";
				curTable.style.backgroundColor = bgColor;

				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Table " + i + " is too wide so disabling styling overrides. New width = " + $$layoutShared.getElementWidth(curTable, 3));
				}
			}
		}

		if (this.__debugMode)
		{
			$$layoutShared.endDebugLevel();
		}
	},
	
	__isTableTooWide: function Epic$Common$ReportViewer$Plugins$ACRTFTableScalingFeature$__isTableTooWide(element)
	{
		/// <summary>Checks whether a table is able to fit within the boundaries of a page. This function will 
		//           also check any embedded tables.</summary>
		/// <param name="element" type="HTMLElement">Table to check</param>
		/// <returns type="boolean">Returns true if the table is too wide, false otherwise.</returns>
		var curRow, curCell, curTable;
		var pageIndex = $$layoutShared.getElementFirstPageIndex(element);
		var pageWidth = $$layoutShared.getPageContentWidth(pageIndex);
		var tableWidth = $$layoutShared.getElementWidth(element, 3);

		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Page width: " + pageWidth + ", Table width: " + tableWidth);
		}

		// First, check if the table actually fits on the page
		if (tableWidth > pageWidth) {
			return true;
		}
		
		// Even if the table fits on the page, we also want to also check if any cell's content
		// is wider than that cell, both for this table and all embedded tables.  See QAN 3631499
		// for more details on this issue (RealObjects issue #6467)
		if ($$layoutShared.canUsePDFReactor())
		{
			if (this.__areTableContentsTooWide(element))
			{
				return true;
			}

			var nestedTables = element.querySelectorAll(".fmtConvTable");
			for (var i = 0; i < nestedTables.length; i++)
			{
				curTable = nestedTables[i];
				if (this.__areTableContentsTooWide(curTable))
				{
					return true;
				}
			}
		}
		
		// Whoo hoo - we made it!
		return false;
	},

	__areTableContentsTooWide: function Epic$Common$ReportViewer$Plugins$ACRTFTableScalingFeature$__areTableContentsTooWide(curTable)
	{
		/// <summary>Checks whether any of the content within any of a table's cells is wider than that cell itself.</summary>
		/// <param name="curTable" type="HTMLElement">Table to check</param>
		/// <returns type="boolean">Returns true if the content of any cell is too wide, false otherwise.</returns>
		var curRow, curCell;

		for (var j = 0; j < curTable.rows.length; j++)
		{
			curRow = curTable.rows[j];
			for (var i = 0; i < curRow.cells.length; i++)
			{
				curCell = curRow.cells[i];
				if (this.__areCellContentsTooWide(curCell))
				{
					return true;
				}
			}
		}

		return false;
	},
	
	__areCellContentsTooWide: function Epic$Common$ReportViewer$Plugins$ACRTFTableScalingFeature$__areCellContentsTooWide(curCell)
	{
		/// <summary>Checks whether any of the content within a cell is wider than the cell itself.</summary>
		/// <param name="curCell" type="HTMLElement">Cell to check</param>
		/// <returns type="boolean">Returns true if the content is too wide, false otherwise.</returns>
		var fmtConvWidthDiv, curChild, childRight, hasFmtConvWidth, hasFmtConvTable;
		var cellRight = curCell.getBoundingClientRect().right;

		for (var i = 0; i < curCell.children.length; i++)
		{
			fmtConvWidthDiv = curCell.children[i];
			hasFmtConvWidth = ((" " + fmtConvWidthDiv.className + " ").indexOf(" " + "fmtConvWidth" + " ") > -1);
			hasFmtConvTable = ((" " + fmtConvWidthDiv.className + " ").indexOf(" " + "fmtConvTable" + " ") > -1);	// Check embedded tables themselves too (QAN 5263066)

			if (hasFmtConvWidth || hasFmtConvTable)
			{
				for (var j = 0; j < fmtConvWidthDiv.children.length; j++)
				{
					childRight = fmtConvWidthDiv.children[j].getBoundingClientRect().right;

					if (childRight > cellRight)
					{
						if (this.__debugMode)
						{
							$$layoutShared.addDebugStatement("Content didn't fit, blame this cell: " + curCell.innerHTML);
						}
						return true;
					}
				}
			}
		}

		return false;
	},

	__allowTableTextWrapping: function Epic$Common$ReportViewer$Plugins$ACRTFTableScalingFeature$__allowTableTextWrapping(element)
	{
		/// <summary>Applies the fmtConvDisableOverrides class to the element</summary>
		/// <param name="element" type="HTMLElement">New element added to the sidebar</param>
		element.className = (" " + element.className + " ").replace(" " + this.__overrideClassName + " ", " ").trim();
		element.className += " " + this.__overrideClassName;
	},
};

$$pluginFactory.register("ACRTFTableScalingFeature", ACRTFTableScalingFeature.prototype.createInstance);
