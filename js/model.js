/*globals sUTLevaluateDecl */

/*eslint-env meteor */

var gmodelTree = null;

var _modelObservers = {};

var RegisterModelObserver = function(aId, aHandlerF)
{
	_modelObservers[aId] = aHandlerF;
};

var UnregisterModelObserver = function(aId)
{
	delete _modelObservers[aId];
};

var _doNotify = function (aNotifyObj)
{
	_.map(_modelObservers, function(aObserverF){
		aObserverF(aNotifyObj);
	});
};
var _notifyTreeReplace = function()
{
	_doNotify({
		type: "treereplace"
	});
};

var InitialiseModelTree = function()
{
	gmodelTree = sUTLevaluateDecl(null, "constructroot");
	
	_notifyTreeReplace();
};
