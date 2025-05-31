/*global document, window */
//---------------------------------------------
// Copyright 2016-2022 Epic Systems Corporation
// Title: ACLayoutEngine.js
// Purpose: Allow dynamic layouts in the AVS. Adds
//			external scripts for features requested
//			by the report, initializes them, and runs
//			their functionality.
// Author: Danny Smith
// Revision History:
//   *DS  02/16 T15558 - Created
//   *JRM 05/16 T19560 - Add individual feature debugging
//                      and stop page by page plugins from
//                      running on pages with just debug info
//   *JRM 06/16 T19868 - Add timing info and don't run plugins if
//                      there are no plugins to run
//   *NEM 01/16 461474 - Don't run plugins when in a VB
//                      Navigator Section
//   *JRM 05/17 475925 - Add server printing class to bothColumns
//   *ZRW 04/17 475153 - Don't create resize listener when in MyChart.
//                       Otherwise an infinte loop in Data Tiles will be created.
//   *MBM 03/17 454064 - Create HSWeb file and add logic to check css and make work in HSWeb due to different JS loading structure
//   *JRM 10/17 507902 - Add finalize function call
//   *SDS 02/20 668550 - Switch to querySelectorAll
//   *SDS 04/21 775397 - Fix finding the bothColumns element
//   *SDS 06/22 888549 - Guard against hasAttribute script error
//---------------------------------------------

var $$pluginFactory = {
	typeDictionary: {},

	register: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$register(mnemonic, instantiationFunction)
	{
		/// <summary>Maps a type mnemonic to the function to instantiate that type</summary>
		/// <param name="mnemonic" type="String">Mnemonic for the type</param>
		/// <param name="instantiationFunction" type="Function">Function to instantiate an object of that type</param>

		this.typeDictionary[mnemonic] = instantiationFunction;
	},

	createInstance: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$createInstance(mnemonic)
	{
		/// <summary>Creates an instance of the type associated with the given mnemonic</summary>
		/// <param name="mnemonic" type="String">Mnemonic for the type</param>
		/// <returns type="Object">Instance of the requested type</returns>

		var instantiationFunction;

		if (this.typeDictionary.hasOwnProperty(mnemonic))
		{
			instantiationFunction = this.typeDictionary[mnemonic];
			if (instantiationFunction)
			{
				return instantiationFunction()
			}
		}

		return null;
	}
}

var $$dynamicReportLayout = {
	__countOfReportsLoaded: 0,
	__scriptElementsLoaded: 0,
	__cssElementsLoaded: 0,
	__totalScriptElements: 0,
	__totalCSSElements: 0,
	__pluginAry: null,
	__scriptsToBeLoadedObject: {},
	__cssToBeLoaded: [],
	__isRunningPlugins: false,
	__scriptObjectAry: [],
	__debugMode: false,
	__debugInfo: null,
	__alreadyRun: false,
	__isVBSection: null,

	// Timing
	__perPluginTime: [],

	__initializePlugins: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__initializePlugins()
	{
		/// <summary>Initializes plugin features and runs them</summary>
		var startDate, startTime;

		//If we are already running the plugins, quit to avoid multiple intializes occuring simultaneously
		if (this.__isRunningPlugins)
		{
			return;
		}

		// Check if report is being displayed in a VB Navigator section and disable plugins
		if (this.__isVBSection === null)
		{
			this.__isVBSection = this.__checkIfInVBNavigator();
		}
		if (this.__isVBSection)
		{
			return;
		}

		// Run plugins
		this.__isRunningPlugins = true;
		if (typeof (this.__pluginAry) !== 'undefined' && this.__pluginAry)
		{
			//Loop through plugins, add them to the script object array and initialize them (if needed)
			for (var idx = 0; idx < this.__pluginAry.length; idx++)
			{
				if (this.__debugMode)
				{
					this.__perPluginTime[idx] = 0;
				}

				var showDebugInfo = this.__showFeatureDebugInfo(this.__pluginAry[idx]);

				//If the type is invalid, continue executing for valid features
				if (this.__scriptObjectAry[idx] == null)
				{
					this.__scriptObjectAry[idx] = $$pluginFactory.createInstance(this.__pluginAry[idx]);
				}

				if (this.__scriptObjectAry[idx])
				{
					if (showDebugInfo)
					{
						this.__scriptObjectAry[idx].setDebugMode(1);

						// Get start time
						startDate = new Date();
						startTime = startDate.getTime();
					}
					if (this.__scriptObjectAry[idx].needsToBeInitialized())
					{
						if (showDebugInfo)
						{
							$$layoutShared.startDebugLevel("Initializing " + this.__pluginAry[idx]);
						}

						this.__scriptObjectAry[idx].initialize();
						if (showDebugInfo)
						{
							if (startTime != null)
							{
								$$layoutShared.addDebugStatement("Initialization time for " + this.__pluginAry[idx] + " = " + this.__getElapsedTime(startTime) + " seconds");
								this.__perPluginTime[idx] += this.__getElapsedTime(startTime);
							}
							$$layoutShared.endDebugLevel();
						}
					}
				}
				else if (showDebugInfo)
				{
					$$layoutShared.addDebugStatement("Failed to create an object of type " + this.__pluginAry[idx]);
				}
			}

			// Add plugin stylesheets
			if (this.__checkIfInHSWeb())
			{
				var stylesToAdd = [];
				for (var idx = 0; idx < this.__pluginAry.length; idx++)
				{
					if (this.__scriptObjectAry[idx])
					{
						var styleSheet = this.__scriptObjectAry[idx].styleSheetNeeded();
						if (styleSheet != "")
						{
							stylesToAdd.push(styleSheet);
							this.__totalCSSElements++;
						}
					}
				}
				//add plugin specific files
				for (var idx = 0; idx < stylesToAdd.length; idx++)
				{
					this.__addCSSfile(stylesToAdd[idx]);
					this.__cssToBeLoaded.push(stylesToAdd[idx]);
				}
			}
		}

		//Check that css files are already loaded for report
		if (this.__checkIfInHSWeb())
		{
			this.__checkReadyStateCSS(this.__countOfReportsLoaded);
		}
		else
		{
			this.__runPlugins();
		}

	},

	__runPlugins: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__runPlugins()
	{
		//Runs plugins (if needed)
		for (var idx = 0; idx < this.__scriptObjectAry.length; idx++)
		{
			var showDebugInfo = this.__showFeatureDebugInfo(this.__pluginAry[idx]);
			if (this.__scriptObjectAry[idx])
			{
				if (this.__scriptObjectAry[idx].needsToBeRun())
				{
					if (showDebugInfo)
					{
						$$layoutShared.startDebugLevel("Running " + this.__pluginAry[idx]);

						// Get start time
						startDate = new Date();
						startTime = startDate.getTime();
					}

					this.__scriptObjectAry[idx].doWork();

					if (showDebugInfo)
					{
						// Display elapsed time
						if (startTime != null)
						{
							$$layoutShared.addDebugStatement(this.__pluginAry[idx] + " took " + this.__getElapsedTime(startTime) + " seconds.");
							this.__perPluginTime[idx] += this.__getElapsedTime(startTime);
						}

						$$layoutShared.endDebugLevel();
					}
				}
			}
		}

		//Run the page level plugin handling
		var pgCount, pgStartIdx;

		if ($$layoutShared.canUsePDFReactor())
		{
			pgCount = this.__getNumberPages();
			pgStartIdx = 0;
		}
		else
		{
			pgStartIdx = -1;
			pgCount = 0;
		}

		for (var pgIdx = pgStartIdx; pgIdx < pgCount; pgIdx++)
		{
			for (var idx = 0; idx < this.__scriptObjectAry.length; idx++)
			{
				var showDebugInfo = this.__showFeatureDebugInfo(this.__pluginAry[idx]);
				if (this.__scriptObjectAry[idx])
				{
					// Get start time
					startDate = new Date();
					startTime = startDate.getTime();

					if (showDebugInfo)
					{
						$$layoutShared.startDebugLevel("Running page level work on page " + (pgIdx + 1) + " in " + this.__pluginAry[idx]);
					}

					this.__scriptObjectAry[idx].doPageLevelWork(pgIdx);

					if ($$layoutShared.canUsePDFReactor())
					{
						//Update the pgCount in case it was changed due to one of the scripts that was run.
						pgCount = this.__getNumberPages();
					}

					if (showDebugInfo)
					{
						$$layoutShared.endDebugLevel();
					}

					// Display elapsed time
					if (showDebugInfo && startTime != null)
					{
						$$layoutShared.addDebugStatement("Page " + (pgIdx + 1) + " work for " + this.__pluginAry[idx] + " took " + this.__getElapsedTime(startTime) + " seconds");
						this.__perPluginTime[idx] += this.__getElapsedTime(startTime);
					}
				}
			}
		}

		//Run finalize function
		for (var idx = 0; idx < this.__scriptObjectAry.length; idx++)
		{
			var showDebugInfo = this.__showFeatureDebugInfo(this.__pluginAry[idx]);
			if (this.__scriptObjectAry[idx])
			{
				// Get start time
				startDate = new Date();
				startTime = startDate.getTime();

				if (showDebugInfo)
				{
					$$layoutShared.startDebugLevel("Running finalize in " + this.__pluginAry[idx]);
				}

				this.__scriptObjectAry[idx].finalize();

				if (showDebugInfo)
				{
					$$layoutShared.endDebugLevel();
				}

				// Display elapsed time
				if (showDebugInfo && startTime != null)
				{
					$$layoutShared.addDebugStatement("Finalize for " + this.__pluginAry[idx] + " took " + this.__getElapsedTime(startTime) + " seconds");
					this.__perPluginTime[idx] += this.__getElapsedTime(startTime);
				}
			}
		}

		//Output summary debug timing info
		if (this.__debugMode)
		{
			var combinedFeatTime = 0;
			for (var idx = 0; idx < this.__scriptObjectAry.length; idx++)
			{
				$$layoutShared.addDebugStatement("Total " + this.__pluginAry[idx] + " time = " + this.__perPluginTime[idx] + " seconds");
				combinedFeatTime += this.__perPluginTime[idx];
			}

			$$layoutShared.addDebugStatement("Total Feature Time = " + combinedFeatTime + " seconds");

			var curDate = new Date();
			$$layoutShared.addDebugStatement("End Time = " + curDate.toString());
		}

		//MyChart
		if (window.$$WP)
		{
			setTimeout(function ()
			{
				var event;
				if (typeof window.CustomEvent === 'function')
				{
					event = new CustomEvent('matchColumnHeights');
				}
				else if (document.createEvent)
				{
					event = document.createEvent('Event');
					event.initEvent('matchColumnHeights', true, false);
				}
				window.dispatchEvent(event);
			}, 10);
		}

		this.__isRunningPlugins = false;
	},

	__checkReadyState: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__checkReadyState(scriptElement)
	{
		/// <summary>Determines whether a script element has been loaded and is ready for use</summary>
		/// <param name="scriptElement" type="HTMLScriptElement"></param>
		if (this.__checkIfInHSWeb())
		{
			if (this.__countOfReportsLoaded != scriptElement.reportNumber)
			{
				return;
			}
		}

		if (scriptElement)
		{
			if (!scriptElement.readyState || scriptElement.readyState == "loaded" || scriptElement.readyState == "complete")
			{
				//Exit if we've already loaded this one
				if (!this.__scriptsToBeLoadedObject.hasOwnProperty(scriptElement.id))
				{
					return;
				}

				//Update our count of how many scripts have been loaded and remove the marker 
				//for this element in our collection so we know it has been loaded
				this.__scriptElementsLoaded++;
				delete this.__scriptsToBeLoadedObject[scriptElement.id];

				//If all scripts have been loaded, run all plugins
				this.__runPluginsIfLoaded();
			}
		}
	},

	__runPluginsIfLoaded: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__runPluginsIfLoaded()
	{
		/// <summary>Runs plugins if all scripts have been loaded</summary>
		if (this.__scriptElementsLoaded === this.__totalScriptElements && this.__totalScriptElements != 0)
		{
			this.__initializePlugins();
		}
	},

	__layoutReport: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__layoutReport()
	{
		var jsLayoutLibraryFunctions, bothColumns, startDate, bothColumnsIdx;

		bothColumns = document.querySelectorAll(".bothColumns");
		if (bothColumns && bothColumns.length > 0)
		{
			//Add server printing class if we're using PDF reactor so CSS can react intelligently
			if ($$layoutShared.canUsePDFReactor())
			{
				//Need the loop for the secondary lang + primary lang case
				for (bothColumnsIdx = 0; bothColumnsIdx < bothColumns.length; bothColumnsIdx++)
				{
					bothColumns[bothColumnsIdx].className += " serverPrinting";
				}
			}
		}

		//From here on out we'll just look at the main instance of the bothColumns div for things like data-plugin properties.
		bothColumns = $$layoutShared.getBothColumns();

		if (!bothColumns)
		{
			return;		//Expected container div does not exist so quit
		}


		//Determine if we are in debug mode
		if (bothColumns.hasAttribute("data-plugin-debug-info"))
		{
			$$dynamicReportLayout.__debugMode = true;
			$$dynamicReportLayout.__debugInfo = JSON.parse(bothColumns.getAttribute("data-plugin-debug-info"));
		}

		if ($$dynamicReportLayout.__debugMode)
		{
			$$layoutShared.createDebugDiv();
			startDate = new Date();
			$$layoutShared.addDebugStatement("Overall start time: " + startDate.toString());
		}

		//If plugins are already loaded, we can just run them and quit
		$$dynamicReportLayout.__runPluginsIfLoaded();

		//We don't want to add a bunch of duplicative scripts
		if ($$dynamicReportLayout.__alreadyRun)
		{
			return;
		}
		else
		{
			$$dynamicReportLayout.__alreadyRun = true;	//Set flag so we don't run this again
		}

		//Get plugin features from the report's data attributes
		if (bothColumns)
		{
			if (bothColumns.hasAttribute("data-plugins"))
			{
				dataPlugInsString = bothColumns.getAttribute("data-plugins");
				$$dynamicReportLayout.__pluginAry = dataPlugInsString.split("^");
				$$dynamicReportLayout.__totalScriptElements = $$dynamicReportLayout.__pluginAry.length;
			}
		}

		//Add feature specific scripts
		if (typeof ($$dynamicReportLayout.__pluginAry) !== 'undefined' && $$dynamicReportLayout.__pluginAry)
		{
			for (var idx = 0; idx < $$dynamicReportLayout.__pluginAry.length; idx++)
			{
				$$dynamicReportLayout.__addScript($$dynamicReportLayout.__pluginAry[idx]);
			}
		}
	},

	__addScript: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__addScript(scriptName)
	{
		/// <summary>Adds a script element to the head</summary>
		/// <param name="scriptName" type="String">The script file name (excluding the .js extension)</param>
		var scriptElement;

		if (document.getElementById(scriptName) == null)
		{
			if (this.__showFeatureDebugInfo(scriptName))
			{
				$$layoutShared.addDebugStatement("Adding " + scriptName + ".js to DOM");
			}

			scriptElement = document.createElement("script");
			scriptElement.type = "text/javascript";
			scriptElement.id = scriptName;
			scriptElement.src = $$layoutShared.getScriptPath() + scriptName + ".js";

			if (this.__checkIfInHSWeb())
			{
				scriptElement.reportNumber = $$dynamicReportLayout.__countOfReportsLoaded;
				scriptElement.setAttribute("data-keepLoaded", "1"); // MBM T20391 set flag so javascript only loaded once 
			}

			scriptElement.onreadystatechange = function () { $$dynamicReportLayout.__checkReadyState(this); };
			scriptElement.onload = function () { $$dynamicReportLayout.__checkReadyState(this); };
			this.__scriptsToBeLoadedObject[scriptElement.id] = "";
			document.head.appendChild(scriptElement);
		}
		else
		{
			if (this.__showFeatureDebugInfo(scriptName))
			{
				$$layoutShared.addDebugStatement(scriptName + ".js already exists in DOM");
			}
			this.__scriptElementsLoaded++;
			this.__runPluginsIfLoaded();
		}
	},

	__getNumberPages: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__getNumberPages()
	{
		/// <summary>Returns number of pages of content (not counting debug statements).</summary>
		var pageCount, debugDiv, boxes;

		// PDF reactor only
		if ($$layoutShared.canUsePDFReactor() == false)
		{
			return -1;
		}

		// See if there's a debug div in the document
		debugDiv = document.getElementById("PluginDebugDiv");
		if (debugDiv)
		{
			// Found debug div, so try to get its regions
			boxes = ro.layout.getBoxDescriptions(debugDiv);

			if (boxes && boxes.length > 0)
			{
				// Found the regions, so return the page debug statements start on
				pageCount = boxes[0].pageIndex + 1;		// Add +1 to include this page as well
			}
		}

		// If no page count from looking for the debug div, get the page count normally
		if (pageCount == null)
		{
			pageCount = ro.layout.numberOfPages;
		}

		return pageCount;
	},

	__showFeatureDebugInfo: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__showFeatureDebugInfo(featureName)
	{
		return (this.__debugMode && (this.__debugInfo[featureName] || this.__debugInfo["all"]))
	},

	__getElapsedTime: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__getElapsedTime(start)
	{
		/// <summary>Returns # seconds that have elapsed since the given start time</summary>
		var curDate, curTime, seconds;

		if (start != null)
		{
			curDate = new Date();
			curTime = curDate.getTime();
			seconds = ((curTime - start) / 1000);

			return seconds;
		}

		// Fall back to 0
		return 0;
	},

	__resetVariables: function Epic$Common$ReportViewer$Plugin$ACLayoutEnginte$__resetVariables()
	{
		/// <summary>Resets variables to their default values</summary>
		this.__scriptElementsLoaded = 0;
		this.__totalScriptElements = 0;
		this.__cssElementsLoaded = 0;
		this.__totalCSSElements = 0;
		this.__pluginAry = null;
		this.__scriptsToBeLoadedObject = {};
		this.__isRunningPlugins = false;
		this.__scriptObjectAry = [];
		this.__debugMode = false;
		this.__debugInfo = null;
		this.__perPluginTime = [];
		this.__alreadyRun = false;
		this.__newLoadEvent = false;
		this.__cssToBeLoaded = [];

	},

	__reportLoadedHandler: function Epic$Common$ReportViewer$Plugin$ACLayoutEngine$__reportLoadedHandler()
	{
		/// <summary>resets variables and reruns report.  Meant to be used if changing or refreshing reports</summary>
		$$dynamicReportLayout.__countOfReportsLoaded++;

		// Reset Engine to default state
		$$dynamicReportLayout.__resetVariables();
		var pluginsInReport = $$dynamicReportLayout.__checkPluginAttributes();

		//If there are no plugins or css in the report quit
		if (pluginsInReport == -1)
		{
			return;
		}
		$$dynamicReportLayout.__layoutReport();
	},

	__checkPluginAttributes: function Epic$Common$ReportViewer$Plugin$ACLayoutEnine$__checkPluginAttributes()
	{
		/// <summary>Gathers the css files that should already be loaded before scripts run </summary>
		bothColumns = $$layoutShared.getBothColumns();

		if (!bothColumns)
		{
			return -1;		//Expected container div does not exist so quit
		}

		// Gather needed css files
		var hasCSSFilesAttributes = $$dynamicReportLayout.__gatherRequiredCSSfiles(bothColumns);
		if (hasCSSFilesAttributes)
		{
			return 1;
		}
		else if (bothColumns.hasAttribute("data-plugins"))
		{
			return 1; // Still want to keep running
		}
		else
		{
			return -1; // If no plugins we don't want to keep running
		}
	},

	__gatherRequiredCSSfiles: function Epic$Common$ReportViewer$Plugin$ACLayoutEnine$__gatherRequiredCSSfiles(bothColumns)
	{
		/// <summary>Gathers the css files that should already be loaded before scripts run </summary>
		/// <param name="bothColumns" type="Dom element">Reference to both columns div</param>
		if (bothColumns.hasAttribute("PreloadCSS"))
		{
			dataPlugInsString = bothColumns.getAttribute("PreloadCSS");
			$$dynamicReportLayout.__cssToBeLoaded = dataPlugInsString.split("^");
			$$dynamicReportLayout.__totalCSSElements = $$dynamicReportLayout.__cssToBeLoaded.length;
			return 1;
		}
		return 0;
	},

	__addCSSfile: function Epic$Common$ReportViewer$Plugin$ACLayoutEnine$__addCSSfile(cssFileName)
	{
		/// <summary>Adds a CSS file to head and adds a callback function for when loaded</summary>
		/// <param name="cssFileName" type="string"></param>
		if (document.getElementById(cssFileName) == null)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("Adding " + cssFileName);
			}
			css = document.createElement("link");
			css.rel = "stylesheet";
			css.type = "text/css";
			css.id = cssFileName;
			css.href = $$layoutShared.getStylesheetPath() + cssFileName;
			document.head.appendChild(css);
		}
	},

	__checkReadyStateCSS: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__checkReadyStateCSS(reportNumber)
	{
		/// <summary>Determines whether a css element has been loaded and is ready for use</summary>
		if (this.__countOfReportsLoaded != reportNumber)
		{
			return;
		}

		for (var idx = this.__cssToBeLoaded.length - 1; idx >= 0; idx--)
		{
			var cssFileName = this.__cssToBeLoaded[idx];
			if (cssFileName)
			{
				if (this.__checkIfCSSFileLoaded(cssFileName))
				{
					//Update our count of how many css have been loaded and remove the marker 
					//for this element in our collection so we know it has been loaded
					this.__cssElementsLoaded++;
					this.__cssToBeLoaded.splice(idx, 1);
					if (this.__debugMode)
					{
						$$layoutShared.addDebugStatement("Loaded css file " + cssFileName + "; " + this.__cssElementsLoaded + " files loaded out of " + this.__totalCSSElements);
					}
				}
			}
		}

		//Determine if all plugins are loaded
		if (this.__debugMode)
		{
			$$layoutShared.addDebugStatement("Checking total css files loaded" + this.__cssElementsLoaded + " out of " + this.__totalCSSElements);
		}

		if (this.__cssToBeLoaded.length === 0)
		{
			if (this.__debugMode)
			{
				$$layoutShared.addDebugStatement("CSS files loaded running plugins");
			}
			this.__runPlugins();
		}
		else
		{
			for (var idx = this.__cssToBeLoaded.length - 1; idx >= 0; idx--)
			{
				var cssFileName = this.__cssToBeLoaded[idx];
				if (this.__debugMode)
				{
					$$layoutShared.addDebugStatement("Failed to load " + cssFileName + "; check again in .1 secs");
				}
			}
			setTimeout(function () { $$dynamicReportLayout.__checkReadyStateCSS(reportNumber); }, 100);
		}
	},

	__checkIfCSSFileLoaded: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__checkIfCSSFileLoaded(filename)
	{
		/// <summary>Determines if css file is present in the doucment and has content</summary>
		/// <param name="filename" type="String">filename of the css file</param>
		var styles = document.styleSheets;
		for (var i = 0; i < styles.length; i++)
		{
			if (styles[i].href != null && styles[i].href.match(filename))
			{
				if (styles[i].cssText != "")
				{
					return true;
				}
			}
		}
		return false;
	},

	__checkIfInVBNavigator: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__checkIfInVBNavigator()
	{
		/// <summary>Returns true if report is being displayed in a VB Navigator Section, otherwise returns false</summary>
		/// <returns type="boolean"> Whether or not we are in a VB navigator </returns>
		//Loop through all elements with the "rpt" class
		var rptElements, element, classes;

		rptElements = document.querySelectorAll(".rpt");
		for (var i = 0; i < rptElements.length; i++)
		{
			element = rptElements[i];
			//If a parent element has the "vbSec" or "_vbSec" class, we are in a navigator and should not run plugins
			while (element.parentNode !== null)
			{
				element = element.parentNode;
				classes = element.classList;
				if (classes === undefined || classes.length == 0)
				{
					continue;
				}
				if (classes.contains("vbSec") || classes.contains("_vbSec"))
				{
					return true;
				}
			}
		}
		return false;
	},

	__checkIfInHSWeb: function Epic$Common$ReportViewer$Plugins$ACLayoutEngine$__checkIfInHSWeb()
	{
		/// <summary>Returns true if report is being displayed in a VB Navigator Section, otherwise returns false</summary>
		/// <returns type="boolean"> Whether or not we are in an HSWeb report viewer </returns>
		return typeof ($$rf) !== 'undefined';
	},

};

//#region Attach to Events
//Don't create resize listener when in MyChart. Otherwise an infinte loop will be created when in Data Tiles
if (!window.$$WP) //MyChart
{
	if (typeof ($$rf) === 'undefined')
	{
		window.addEventListener('resize', $$dynamicReportLayout.__layoutReport, false);
	}
}
//#region Attach to Events - need to add this functionality smartly.  See QAN 3642241
if (typeof ($$rf) !== 'undefined')
{
	// Check if report is already loaded.  If so run layout report because finished loading event below will
	// not fire and plugins will not be run otherwise.  
	if ($$rf.__reportDisplay._isLoadComplete)
	{
		$$dynamicReportLayout.__reportLoadedHandler();
	}
	$$rf.subscribeToEvent($$rf.ReportFrameEvents.finishedReportSetup, $$dynamicReportLayout.__reportLoadedHandler);
}
else
{
	window.addEventListener('load', $$dynamicReportLayout.__layoutReport, false);
}
//#endregion