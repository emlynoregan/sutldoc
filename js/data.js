
/*eslint-env meteor */

/*globals RegisterModelObserver sUTLevaluateDecl GetModelNodeById AddChildrenToModelNode NotifyNodeExpanded ReplaceNode*/

var _dists = {
  "emlynoregan_com": {
    "name": "emlynoregan_com",
    "published": false
  },
  "core_emlynoregan_com": {
    "name": "core",
    "published": true,
    "parent": "emlynoregan_com"
  },
  "working_emlynoregan_com": {
    "name": "working",
    "published": false,
    "parent": "emlynoregan_com"
  }
};

var _decls = {
  "map_core_emlynoregan_com": {
    "name": "map",
    "published": true,
    "decl": {
      "language": "sUTL0",
      "transform-t": "map code"
    },
    "parent": "core_emlynoregan_com"
  },
  "filter_core_emlynoregan_com": {
    "name": "filter",
    "published": true,
    "decl": {
      "language": "sUTL0",
      "transform-t": "filter code"
    },
    "parent": "core_emlynoregan_com"
  }
};


var GetDistByName = function(aName)
{
  return _dists[aName];
}

var SetDistByName = function(aName, aDist)
{
  _dists[aName] = aDist;
};

var DeleteDistByName = function(aName)
{
  _dists[aName] = null;
};

var GetAllDistsForParent = function(aParentName)
{
  return _.map(
	  _.filter(
	    _dists, 
	    function(aDist) {
	      if (aParentName)
	      {
		   	 return aDist.parent === aParentName;
	      }
	      else
	      {
	         return !aDist.parent;
	      }
	    }
	  ),
	  function(aDataDist) {
	  	return sUTLevaluateDecl(sUTLevaluateDecl(aDataDist, "addidtodatum"), "constructdist");
      }
  );
};

var GetDecl = function(aFullName)
{
  return _decls[aFullName];
}

var SetDecl = function(aFullName, aDecl)
{
  _decls[aFullName] = aDecl;
};

var DeleteDecl = function(aName)
{
  _decls[aName] = null;
};

var GetAllDeclsForParent = function(aParentName)
{
  return _.map(
	  _.filter(
	    _decls, 
	    function(aDist) {
	      if (aParentName)
	      {
		   	 return aDist.parent === aParentName;
	      }
	      else
	      {
	         return !aDist.parent;
	      }
	    }
	  ),
	  function(aDataDist) {
	  	return sUTLevaluateDecl(sUTLevaluateDecl(aDataDist, "addidtodatum"), "constructdecl");
      }
  );
};

var fullDistName = function(aName, aParentName)
{
  if (aParentName)
    return aName + "_" + aParentName;
  else
    return aName;
};

var distNameIsAvailable = function(aDistName, aNodeId)
{
  var ldistNode = _dists[aNodeId];
  
  if (ldistNode)
  {
	  return !_dists[fullDistName(aDistName, ldistNode.parent)];
  }
  else
  {
	  return !_dists[aDistName];
  }
};

var distNameChange = function(aOldDistName, aNewDistName, aParentName)
{
  if (!_dists[fullDistName(aNewDistName, aParentName)])
  {
    var ldist = _dists[fullDistName(aOldDistName, aParentName)];
    delete _dists[fullDistName(aOldDistName, aParentName)];
    _dists[fullDistName(aNewDistName, aParentName)] = ldist;
  }
};

var loadNodeChildren = function(aNode)
{
	if (aNode)
	{
		var lmodelNode = GetModelNodeById(aNode.id);
		
		if (lmodelNode)
		{
			var lparentId = aNode.id;
			if (lparentId === "root")
				lparentId = null;
				
			var lchildDists = GetAllDistsForParent(lparentId); 
			
			var lchildDecls = GetAllDeclsForParent(lparentId);
			
			var lchildren = sUTLevaluateDecl({"lists": [lchildDists, lchildDecls]}, "combinelists");
			
			AddChildrenToModelNode(lmodelNode, lchildren);
		}
	}	
};

var dataUpdateNode = function (aModelNode)
{
	if (aModelNode && aModelNode.state === "updated")
	{
		var ldistNode = GetDistByName(aModelNode.id);
		
		if (ldistNode)
		{
			var lnewDistNode = sUTLevaluateDecl({
					"model": aModelNode,
					"data": ldistNode
				},
				"distmodeltodata"
			);

			SetDistByName(lnewDistNode);
//			if (ldistNode.name !== lnewDistNode.name)
//			{
//				distNameChange(ldistNode.name, lnewDistNode.name, lnewDistNode.parent);
//			}

			delete aModelNode["state"];
//			aModelNode.id = fullDistName(lnewDistNode.name, lnewDistNode.parent);
			
			ReplaceNode(aModelNode);
		}
	}
};

RegisterModelObserver("data", function(aNotifyObj)
{
	if (aNotifyObj)
	{
		if (aNotifyObj.type === "expandnode")
		{
			loadNodeChildren(aNotifyObj.node);
		}
		else if (aNotifyObj.type === "nodeupdated")
		{
			dataUpdateNode(aNotifyObj.node);
		}
	}
});
