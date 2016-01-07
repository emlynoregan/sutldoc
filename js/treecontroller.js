
/*eslint-env jquery, node*/
/*globals RegisterModelObserver sUTLevaluateDecl NotifyExpandNode GetModelNodeById SetSelectedModelNode*/

var loadTree = function(aTreeId, aTree)
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
	
		$('#' + aTreeId).tree('append', {
			parent: aTreeNode.target,
			data: ltreeViewJson.children
		});
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

var GetTreeNodeById = function(aTreeId, aNodeId)
{
	return $('#' + aTreeId).tree('find', aNodeId);
};


var nodeExpanded = function(aTreeId, aNode)
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

var nodeUpdated = function(aTreeId, aNode)
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


RegisterModelObserver("tree", function(aNotifyObj)
{
	if (aNotifyObj)
	{
		if (aNotifyObj.type === "treereplace")
		{
			loadTree("tvMain", aNotifyObj.tree);
		}
		else if (aNotifyObj.type === "nodeexpanded")
		{
			nodeExpanded("tvMain", aNotifyObj.node);
		}
		else if (aNotifyObj.type === "nodeupdated")
		{
			nodeUpdated("tvMain", aNotifyObj.node);
		}
	}
});

var expandNode = function(aNode)
{
  if (aNode)
  {
  	  var lmodelNode = GetModelNodeById(aNode.attributes.node.id);

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

var clickNode = function(aNode)
{
  if (aNode)
  {
  	  SetSelectedModelNode(aNode.attributes.node.id);
  }
};

