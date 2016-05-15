
/*eslint-env jquery, node*/
/*globals RegisterModelObserver sUTLevaluateDecl NotifyExpandNode GetModelNodeById SetSelectedModelNode modelSetSelectedNode modelGetNodeById modelUnselectNode*/

var _treeLoadTree = function(aTreeId, aTree)
{
	if (aTree)
	{
		var ltreeViewJson = sUTLevaluateDecl({node: aTree}, "modeltotreeview");
	
		$('#' + aTreeId).tree('loadData', [ltreeViewJson]);
	}	
};

var updateTreeNodeChildren = function(aTreeId, aTreeNode, aModelNode)
{
	if (aTreeId && aTreeNode && aModelNode)
	{
		var ltreeViewJson = sUTLevaluateDecl({node: aModelNode}, "modeltotreeview");
		
		var lchildTreeNodes = $('#' + aTreeId).tree('getChildren', aTreeNode.target);
		
		for (var lix in lchildTreeNodes)
		{
			var lchildTreeNode = lchildTreeNodes[lix];
			
			$('#' + aTreeId).tree('remove', lchildTreeNode.target);
		}

	
		$('#' + aTreeId).tree('append', {
			parent: aTreeNode.target,
			data: ltreeViewJson.children
		});
		
		$('#' + aTreeId).tree('collapse', aTreeNode.target);
		$('#' + aTreeId).tree('expand', aTreeNode.target);
		
	}	
};

var updateTreeNode = function(aTreeId, aTreeNode, aModelNode)
{
	if (aTreeId && aTreeNode && aModelNode)
	{
//		var ltreeViewJson = sUTLevaluateDecl({node: aModelNode}, "modeltotreeview");
	
		$('#' + aTreeId).tree('update', {
			target: aTreeNode.target,
			text: aModelNode.name
		});
	}	
};

var deleteTreeNode = function(aTreeId, aTreeNode, aNodeId)
{
	if (aTreeId && aTreeNode && aNodeId)
	{
		$('#' + aTreeId).tree('remove', aTreeNode.target);
	}	
};

var GetTreeNodeById = function(aTreeId, aNodeId)
{
	return $('#' + aTreeId).tree('find', aNodeId);
};


var _treeNodeExpanded = function(aTreeId, aNode)
{
  if (aNode && aNode.id)
  {
  	var ltreeNode = GetTreeNodeById(aTreeId, aNode.id);
  	
  	if (ltreeNode)
  	{
  		updateTreeNodeChildren(aTreeId, ltreeNode, aNode);
  	}
  }
};

var _treeNodeUpdated = function(aTreeId, aNode)
{
  if (aNode && aNode.id)
  {
  	var ltreeNode = GetTreeNodeById(aTreeId, aNode.id);
  	
  	if (ltreeNode)
  	{
  		updateTreeNode(aTreeId, ltreeNode, aNode);
  	}
  }
};

var _treeNodeDeleted = function(aTreeId, aNodeId)
{
  if (aNodeId)
  {
  	var ltreeNode = GetTreeNodeById(aTreeId, aNodeId);
  	
  	if (ltreeNode)
  	{
  		deleteTreeNode(aTreeId, ltreeNode, aNodeId);
  	}
  }
};

var _treeNodeAdded = function(aTreeId, aNewModelNode)
{
  if (aNewModelNode)
  {
  	var ltreeParentNode = GetTreeNodeById(aTreeId, aNewModelNode.parent);
  	var lmodelParentNode = modelGetNodeById(aNewModelNode.parent);
  	
  	if (ltreeParentNode && lmodelParentNode)
  	{
		updateTreeNodeChildren(aTreeId, ltreeParentNode, lmodelParentNode);
  	}
  }
};

var treeExpandNode = function(aNode)
{
  if (aNode)
  {
  	  var lmodelNode = modelGetNodeById(aNode.attributes.node.id);

	  if (lmodelNode)
	  {
		  var lneedExpand = sUTLevaluateDecl({node: lmodelNode}, "needexpand");
		  
		  if (lneedExpand)
		  {
		  	NotifyExpandNode(aNode.attributes.node);
		  }
      }

  }
};

var treeClickNode = function(aNode)
{
  if (aNode)
  {
  	  modelSetSelectedNode(aNode.attributes.node.id);
  }
};

var treeBeforeSelectNode = function(aNode)
{
  if (aNode)
  {
  	  modelUnselectNode(aNode.attributes.node.id);
  }
  return true;
};

RegisterModelObserver("tree", function(aNotifyObj)
{
	if (aNotifyObj)
	{
		if (aNotifyObj.type === "treereplace")
		{
			_treeLoadTree("tvMain", aNotifyObj.tree);
		}
		else if (aNotifyObj.type === "nodeexpanded")
		{
			_treeNodeExpanded("tvMain", aNotifyObj.node);
		}
		else if (aNotifyObj.type === "nodeupdated")
		{
			_treeNodeUpdated("tvMain", aNotifyObj.node);
		}
		else if (aNotifyObj.type === "nodedeleted")
		{
			_treeNodeDeleted("tvMain", aNotifyObj.nodeid);
		}
		else if (aNotifyObj.type === "nodeadded")
		{
			_treeNodeAdded("tvMain", aNotifyObj.node);
		}
	}
});
