
/*eslint-env meteor, browser*/

/*globals RegisterModelObserver sUTLevaluateDecl modelGetNodeById modelAddChildrenToModelNode NotifyNodeExpanded modelReplaceNode*/

var _dists = sUTLevaluateDecl(
	{
		"dict": {
		  "eeeeeeeeee": {
		    "name": "emlynoregan_com",
		    "published": false
		  },
		  "cccccccccccccc": {
		    "name": "core",
		    "published": true,
		    "parent": "eeeeeeeeee"
		  },
		  "wwwwwwwwwwwww": {
		    "name": "working",
		    "published": false,
		    "parent": "eeeeeeeeee"
		  }
	  }
	},
	"addidstodata"
);

var _decls = sUTLevaluateDecl(
	{
		"dict": {
		  "mmmmmmmmmmmmm": {
		    "name": "map",
		    "published": true,
		    "decl": {
		      "language": "sUTL0",
		      "transform-t": "map code"
		    },
		    "parent": "cccccccccccccc",
		    "source": "{\n" +
		    "	\"xxx\": 4\n" +
		    "}"
		  },
		  "ffffffffffff": {
		    "name": "filter",
		    "published": true,
		    "decl": {
		      "language": "sUTL0",
		      "transform-t": "filter code"
		    },
		    "parent": "cccccccccccccc"
		  }
	  }
	},
	"addidstodata"
);

// simulated server calls
var GetDistById = function(aId)
{
  return _dists[aId];
};
//
//var GetDistByName = function(aName, aParentId)
//{
//  var retval = null;
//  
//  for (var lkey in _dists)
//  {
//  	var ldistNode = _dists[lkey];
//  	if (ldistNode.name === aName && ldistNode.parent === aParentId)
//  	{
//  		retval = ldistNode;
//  		break;
//  	}
//  }
//
//  return retval;
//};

var SetDistById = function(aId, aDist)
{
  _dists[aId] = aDist;
};

var GetAllDistsForParent = function(aParentId)
{
	return sUTLevaluateDecl(
		{
			"dict": _dists,
			"parent": aParentId,
			"item-t": "^*.constructdist"
		},
		"getalldatanodesforparent",
		["constructdist"]
	);
};

var GetDeclById = function(aId)
{
  return _decls[aId];
}

var SetDeclById = function(aId, aDecl)
{
  _decls[aId] = aDecl;
};

var GetAllDeclsForParent = function(aParentId)
{
	return sUTLevaluateDecl(
		{
			"dict": _decls,
			"parent": aParentId,
			"item-t": "^*.constructdecl"
		},
		"getalldatanodesforparent",
		["constructdecl"]
	);
};

var _dataGetAllChildrenForParent = function(aParentId)
{
	var lchildDists = GetAllDistsForParent(aParentId); 
	
	var lchildDecls = GetAllDeclsForParent(aParentId);
	
	var lchildren = sUTLevaluateDecl({"lists": [lchildDists, lchildDecls]}, "combinelists");
	
	return lchildren;
}

var _dataGetNodeById = function(aId)
{
	var retval = GetDeclById(aId);
	if (!retval)
	{
		retval = GetDistById(aId);
	}
	return retval;
}


//var fullDistName = function(aName, aParentId)
//{
//  var lparentNode = GetDistById(aParentId);
//  if (lparentNode) 
//    return aName + "_" + lparentNode.name;
//  else
//    return aName;
//};

///////////////////////
/// external api
///////////////////////

var dataLoadNodeChildren = function(aNodeId)
{
	if (aNodeId)
	{
		var lparentId = aNodeId;

		if (lparentId === "root")
			lparentId = null;
			
		var lchildren = _dataGetAllChildrenForParent(lparentId);
		
		modelAddChildrenToModelNode(modelGetNodeById(aNodeId), lchildren);
	}	
};

var dataUpdateNode = function (aModelNode)
{
	if (aModelNode && aModelNode.state === "updated")
	{
		var lnewNode = null;
		
		var ldistNode = GetDistById(aModelNode.id);

		if (ldistNode)
		{
			lnewNode = sUTLevaluateDecl({
					"model": aModelNode,
					"data": ldistNode
				},
				"distmodeltodata"
			);

			SetDistById(aModelNode.id, lnewNode);
		}
		else
		{
			var ldeclNode = GetDeclById(aModelNode.id);
			
			if (ldeclNode)
			{
				lnewNode = sUTLevaluateDecl({
						"model": aModelNode,
						"data": ldistNode
					},
					"declmodeltodata"
				);

				SetDeclById(aModelNode.id, lnewNode);
			}
		}			
		
		if (lnewNode)
		{
			delete aModelNode["state"];

			modelReplaceNode(aModelNode);
		}
	}
};

var dataDeleteNode = function (aNodeId)
{
	if (aNodeId)
	{
		var lnode = _dataGetNodeById(aNodeId);
		
		if (lnode)
		{
			var lchildren = _dataGetAllChildrenForParent(aNodeId);
	
			lchildren.push(lnode);
			
			for (var lix in lchildren)
			{
				var ldelNode = lchildren[lix];
				
				delete _dists[ldelNode.id];
				delete _decls[ldelNode.id];
			}
		}
	}
};

var dataAddNode = function (aModelNode)
{
	if (aModelNode && aModelNode.state === "added")
	{
		var lnewNode = null;
		
		if (aModelNode.type === "dist")
		{
			var ldistNode = GetDistById(aModelNode.id);
			
			if (!ldistNode)
			{
				lnewNode = sUTLevaluateDecl({
						"model": aModelNode
					},
					"distmodeltodata"
				);
	
				SetDistById(aModelNode.id, lnewNode);
	
				delete aModelNode["state"];
				
				modelReplaceNode(aModelNode);
			}
		}
		else if (aModelNode.type === "decl")
		{
			var ldeclNode = GetDeclById(aModelNode.id);
			
			if (!ldeclNode)
			{
				lnewNode = sUTLevaluateDecl({
						"model": aModelNode
					},
					"declmodeltodata"
				);
	
				SetDeclById(aModelNode.id, lnewNode);
	
			}
		}
		
		if (lnewNode)
		{
			delete aModelNode["state"];
			
			modelReplaceNode(aModelNode);
		}
	}
};

var dataGetUser = function(aHandler)
{
	$.ajax({
	  url: "/api/self",
	  type: "post",
	  dataType: 'json',
	  success: function(data){
		aHandler(data);
  	  }
	});
};

RegisterModelObserver("data", function(aNotifyObj)
{
	window.setTimeout(
		function ()
		{
			if (aNotifyObj)
			{
				if (aNotifyObj.type === "expandnode")
				{
					dataLoadNodeChildren(aNotifyObj.node.id);
				}
				else if (aNotifyObj.type === "nodeupdated")
				{
					dataUpdateNode(aNotifyObj.node);
				}
				else if (aNotifyObj.type === "nodedeleted")
				{
					dataDeleteNode(aNotifyObj.nodeid);
				}
				else if (aNotifyObj.type === "nodeadded")
				{
					dataAddNode(aNotifyObj.node);
				}
			}
		}, 
		1000
	);
});
