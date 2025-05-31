/*global document, ACDynamicFeature */
//***************************
// Copyright 2016-2020 Epic Systems Corporation
// Title: ACColumnFoldingFeature.js
// Purpose: Report Columnization Feature
//
//			This functionality relies on PDFReactor:
//			http://www.pdfreactor.com/
// Author: Jordan Mauk
// Revision History:
//   *JRM 05/16 T18686 - Created
//   *JRM 06/16 T19868 - Add some null checking on element.classList
//   *SDS 02/20 668550 - Switch to querySelectorAll
//***************************

ACColumnFoldingFeature: function ACColumnFoldingFeature()
{
	///<summary>Page-cross feature class. Derived from ACDynamicFeature object</summary>

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

ACColumnFoldingFeature.prototype = {

	createInstance: function Epic$Common$ReportViewer$Plugins$ACColumnFoldingFeature$createInstance()
	{
		/// <summary>Creates an instance of ACColumnFoldingFeature. This is called by the $$pluginFactory</summary>
		/// <returns type="ACColumnFoldingFeature">An instance of ACColumnFoldingFeature</returns>

		return new ACColumnFoldingFeature();
	},

	needsToBeInitialized: function Epic$Common$ReportViewer$Plugins$ACColumnFoldingFeature$needsToBeInitialized()
	{
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Returning false since this feature doesn't need to be initialized.");
		}
		return false;
	},

	needsToBeRun: function Epic$Common$ReportViewer$Plugins$ACColumnFoldingFeature$needsToBeRun()
	{
		/// <summary>Returns whether DoWork should be run</summary>
		// Always return false since this feature only does page level work, not normal doWork
		return false;
	},

	initialize: function Epic$Common$ReportViewer$Plugins$ACColumnFoldingFeature$initialize()
	{   /// <summary>We don't need to do any initialization for the columnization feature.</summary>
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("In initialize - doing nothing since this feature doesn't need initialization.");
		}
		return;
	},

	doPageLevelWork: function Epic$Common$ReportViewer$Plugins$ACColumnFoldingFeature$doPageLevelWork(pgIdx)
	{
		/// <summary>Does all columnization functionality for the given page index</summary>
		var moveToColumn, removableColumn, columnizableTable, containerDiv, rowElement;
		columnizableTables = document.querySelectorAll("[data-plugin-columnizable]");
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Found " + columnizableTables.length + " tables to columnize.");
		}
		for (var idx = 0; idx < columnizableTables.length; idx++)
		{
			columnizableTable = columnizableTables[idx];
			if ($$layoutShared.canUsePDFReactor())
			{
				boxes = ro.layout.getBoxDescriptions(columnizableTable);
				if (!boxes || boxes.length==0)
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Skipping a table since its display is likely none (it has no boxes).");
					}
					continue;
				}

				//Skip this table if it is on a page before the page we're working on
				else if (boxes[0].pageIndex < pgIdx)
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Skipping a table because it is on a page we already worked on.");
					}
					continue;
				}

				//Quit out if we are past the page we're supposed to be working on
				else if (boxes[0].pageIndex > pgIdx)
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Quitting out because this table is past the page we're working on.");
					}
					break;
				}
			}

			if (this.__shouldColumnize(columnizableTable))
			{
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("This table should have its columns folded.");
				}

				//If it has already been columnized, then we're done
				if (columnizableTable.classList && columnizableTable.classList.contains("hasBeenColumnized"))
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("It already did, so moving on.");
					}
					continue;
				}

				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Performing table folding.");
				}

				for (var rowIdx = 0; rowIdx < columnizableTable.getElementsByTagName("tr").length; rowIdx++)
				{
					rowElement = columnizableTable.getElementsByTagName("tr")[rowIdx];

					removableColumn = rowElement.querySelectorAll("[data-plugin-removableColumn]");
					if (!removableColumn || removableColumn.length != 1)
					{
						continue;
					} else
					{
						removableColumn = removableColumn[0];
					}

					//The move to column is the column to the immediate left of the removable column
					moveToColumn = removableColumn.previousElementSibling;
					if (!moveToColumn)
					{
						continue;
					}

					containerDiv = document.createElement("div");
					containerDiv.className += " otherCellContentContainerDiv";
					for (var childIdx = 0; childIdx < removableColumn.childNodes.length; childIdx++)
					{
						containerDiv.appendChild(removableColumn.childNodes[childIdx].cloneNode(true));
					}
					moveToColumn.appendChild(containerDiv);
					moveToColumn.colSpan = moveToColumn.colSpan + removableColumn.colSpan;
					moveToColumn.className += " collapsedCell";
					removableColumn.style.display = "none";
					removableColumn.style.width = "0";
				}

				//Note that the table has been columnized
				columnizableTable.className += " hasBeenColumnized";

			}
			else
			{
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("This table shouldn't be folded.");
				}

				//If it shouldn't be folded and we previously folded it, then unfold it.
				if (columnizableTable.classList && columnizableTable.classList.contains("hasBeenColumnized"))
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Unfolding the table.");
					}

					for (var rowIdx = 0; rowIdx < columnizableTable.getElementsByTagName("tr").length; rowIdx++)
					{
						rowElement = columnizableTable.getElementsByTagName("tr")[rowIdx];
						removableColumn = rowElement.querySelectorAll("[data-plugin-removableColumn]");

						if (!removableColumn || removableColumn.length != 1)
						{
							continue;
						}
						else
						{
							removableColumn = removableColumn[0];
						}

						//The move to column is the column to the immediate left of the removable column
						moveToColumn = removableColumn.previousElementSibling;
						if (!moveToColumn)
						{
							continue;
						}

						//Delete the container div
						containerDiv = moveToColumn.querySelectorAll(".otherCellContentContainerDiv")
						if (containerDiv && containerDiv.length > 0)
						{
							containerDiv = containerDiv[0];
							containerDiv.parentNode.removeChild(containerDiv);
						}

						//Make the removable cell display normally again
						removableColumn.style.display = "";

						//Reset the moveToColumn's colSpan to its original value and remove the collapsed class
						moveToColumn.colSpan = moveToColumn.colSpan - removableColumn.colSpan;
						moveToColumn.classList.remove("collapsedCell");
					}
					columnizableTable.classList.remove("hasBeenColumnized");

				}
				//If it doesn't need to be columnized, and it hasn't been, then we're done
				else
				{
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("It isn't, so moving to the next table.");
					}
					continue;
				}
			}
		}
	},

	__shouldColumnize: function Epic$Common$ReportViewer$Plugins$ACColumnFoldingFeature$__shouldColumnize(columnizableElement)
	{
		//Currently we just columnize if we're next to the sidebar
		//Find the parent pgSection
		var done, parent;
		parent = columnizableElement;

		while (!done && parent != null)
		{
			if (parent.classList && parent.classList.contains("pgSection"))
			{
				done = 1;
			}
			else
			{
				parent = parent.parentNode;
			}
		}

		//Columnize if we found the parent pgSection and we're next to the sidebar
		if (parent && parent.classList && parent.classList.contains("nextToSidebar"))
		{
			return true;
		}
		else
		{
			return false;
		}
	}

};

$$pluginFactory.register("ACColumnFoldingFeature", ACColumnFoldingFeature.prototype.createInstance);