//***************************
//  Copyright 2016-2017 Epic Systems Corporation
//	Name:		 ACDynamicFeature.js
//	Assembly:	 Epic.Clinical.Ambulatory.Web.Assets
//	Description: Base class for all AVS Dynamic Features
//	Revision History:
//	 *DS  1/16 T15558 - Created
//	 *MBM 03/17 454064 - Create HSWeb file and add function to return stylesheets
//   *JRM 10/17 507902 - Add handling for finalize function
//***************************

function ACDynamicFeature()
{

}

ACDynamicFeature.prototype = {
	//#region Public Methods
	createInstance: function Epic$Common$ReportViewer$Plugins$ACDynamicFeature$createInstance()
	{
		return null;
	},

	needsToBeInitialized: function Epic$Common$ReportViewer$Plugins$ACDynamicFeature$needsToBeInitialized()
	{
		return true;
	},

	initialize: function Epic$Common$ReportViewer$Plugins$ACDynamicFeature$initialize()
	{
		return true;
	},

	needsToBeRun: function Epic$Common$ReportViewer$Plugins$ACDynamicFeature$needsToBeRun()
	{
		return true;
	},

	doWork: function Epic$Common$ReportViewer$Plugins$ACDynamicFeature$doWork()
	{
		return true;
	},

	doPageLevelWork: function Epic$Common$ReportViewer$Plugins$ACDynamicFeature$doPageLevelWork(pgIndex)
	{
		return true;
	},
	
	finalize: function Epic$Common$ReportViewer$Plugins$ACDynamicFeature$finalize()
	{
		return true;
	},
	
	__debugMode: false,

	setDebugMode: function Epic$Common$ReportViewer$Plugins$ACDynamicFeature$setDebugMode(value)
	{
		this.__debugMode = value;
	},
	styleSheetNeeded: function Epic$Common$ReportViewer$Plugins$ACDynamicFeature$styleSheetNeeded()
	{
		return "";
	}

	//#endregion
};