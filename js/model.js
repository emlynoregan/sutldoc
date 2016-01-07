/*globals sUTLevaluateDecl */

/*eslint-env meteor */

var gmodelTree = null;
var gselectedNode = null;


////////////// Observers
var _modelObservers = {};

var RegisterModelObserver = function(aId, aHandlerF)
{
	_modelObservers[aId] = aHandlerF;
};

var UnregisterModelObserver = function(aId)
{
	delete _modelObservers[aId];
};


////////////// Notify
var _doNotify = function (aNotifyObj)
{
	_.map(_modelObservers, function(aObserverF){
		aObserverF(aNotifyObj);
	});
};
var NotifyTreeReplace = function()
{
	_doNotify({
		type: "treereplace",
		tree: gmodelTree
	});
};

var NotifyExpandNode = function(aNode)
{
	_doNotify({
		type: "expandnode",
		node: aNode
	});
};

var NotifyNodeSelected = function(aNode)
{
	_doNotify({
		type: "nodeselected",
		node: aNode
	});
};

var NotifyNodeExpanded = function(aNode)
{
	_doNotify({
		type: "nodeexpanded",
		node: aNode
	});
};

var NotifyNodeUpdated = function(aNode)
{
	_doNotify({
		type: "nodeupdated",
		node: aNode
	});
};

////////////// Model manipulation
var GetModelNodeById = function(aNodeId)
{
	return sUTLevaluateDecl({
		id: aNodeId,
		node: gmodelTree
	}, 
	"getmodelnodebyid");
};

var SetModelNode = function(aNode)
{
	gmodelTree = sUTLevaluateDecl({
		"newnode": aNode,
		"tree": gmodelTree
		},
		"setmodelnodebyid");
};

var AddChildrenToModelNode = function(aModelNode, aChildList)
{
	var lnewModelNode = sUTLevaluateDecl({
			"node": aModelNode,
			"children": aChildList
		}, 
		"addchildrentomodelnode");

	SetModelNode(lnewModelNode);
		
	NotifyNodeExpanded(lnewModelNode);
};

var SetSelectedModelNode = function(aNodeId)
{
	var lnode = GetModelNodeById(aNodeId);
	
	gselectedNode = lnode;
	
	NotifyNodeSelected(lnode);
};

var InitialiseModelTree = function()
{
	gmodelTree = sUTLevaluateDecl(null, "constructroot");
	
	NotifyTreeReplace();
	SetSelectedModelNode(gmodelTree);
};

var UpdateNode = function(aNodeId, aNodeDiff)
{
	var lnode = GetModelNodeById(aNodeId);
	
	if (lnode)
	{
		var lnewModelNode = sUTLevaluateDecl({
				"old": lnode,
				"diff": aNodeDiff
			},
			"applynewdiff"
		);
		
		SetModelNode(lnewModelNode);
			
		NotifyNodeUpdated(lnewModelNode);
	}
};

var ReplaceNode = function(aNode)
{
	SetModelNode(aNode);
			
	NotifyNodeUpdated(aNode);
};
