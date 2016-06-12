
/*eslint-env meteor, browser*/

/*globals RegisterModelObserver sUTLevaluateDecl modelGetNodeById modelAddChildrenToModelNode NotifyNodeExpanded modelReplaceNode modelSetLibDist*/

var _postRequest = function(aUrl, aBodyJson, aResponseHandler)
{
	var lrequest = {
	  url: aUrl,
	  type: "post",
	  dataType: 'json',
	  success: function(data){
		aResponseHandler(data);
  	  },
	  statusCode: {
	    404: function() {
			aResponseHandler(null);
	    }
	  }
	};
	
	if (aBodyJson)
		lrequest["data"] = JSON.stringify(aBodyJson);
		
	$.ajax(lrequest);
}

var dataGetUser = function(aHandler)
{
	_postRequest(
	  "/api/self",
	  null,
	  aHandler
	);
};


var _delay = function(aF){
	window.setTimeout(
		aF,
		1000
	);
};

var GetDistById = function(aId, aHandler)
{
	_postRequest(
	  "/api/getdist",
	  {"id": aId},
	  aHandler
	);
};

//// simulated server calls
//var GetDistById = function(aId, aHandler)
//{
//	_delay(
//		function(){
//			aHandler(_dists[aId]);
//		}
//	);
//};

var SetDistById = function(aId, aDist)
{
	_postRequest(
	  "/api/setdist",
	  aDist,
	  function()
	  {
	  }
	);
};

//var SetDistById = function(aId, aDist)
//{
//	_delay(
//		function(){
//		  _dists[aId] = aDist;
//		}
//	);
//};
//

var DeleteDistById = function(aId)
{
	_postRequest(
	  "/api/deldist",
	  {"id": aId},
	  function()
	  {
	  }
	);
};

var GetAllDistsForParent = function(aParentId, aHandler)
{
	_postRequest(
	  "/api/getchilddists",
	  {"id": aParentId},
	  function(data)
	  {
	  	if (data)
			aHandler(data["children"]);
		else
			aHandler(null);
	  }
	);
};

//var GetAllDistsForParent = function(aParentId, aHandler)
//{
//	_delay(
//		function(){
//			var lresult = sUTLevaluateDecl(
//				{
//					"dict": _dists,
//					"parent": aParentId,
//					"item-t": "^*.constructdist"
//				},
//				"getalldatanodesforparent",
//				["constructdist"]
//			);
//			
//			aHandler(lresult);
//		}
//	);
//};

var GetDeclById = function(aId, aHandler)
{
	_postRequest(
	  "/api/getdecl",
	  {"id": aId},
	  aHandler
	);
};

//var GetDeclById = function(aId, aHandler)
//{
//	_delay(
//		function(){
//		  	aHandler(_decls[aId]);
//		}
//	);
//};
//

var dataGetLibDist = function(aId)
{
  _postRequest(
    "/api/getlibdecls",
	{
	  "id": aId
	},
	function(data)
	{
	  modelSetLibDist(aId, data);
	}
  );
};

var SetDeclById = function(aId, aDecl)
{
	_postRequest(
	  "/api/setdecl",
	  aDecl,
	  function()
	  {
	  	dataGetLibDist(aId);
	  }
	);
};

var DeleteDeclById = function(aId)
{
	_postRequest(
	  "/api/deldecl",
	  {"id": aId},
	  function()
	  {
	  }
	);
};

//var SetDeclById = function(aId, aDecl)
//{
//	_delay(
//		function(){
//		  _decls[aId] = aDecl;
//		}
//	);
//};
//
var GetAllDeclsForParent = function(aParentId, aHandler)
{
	_postRequest(
	  "/api/getchilddecls",
	  {"id": aParentId},
	  function(data)
	  {
	  	if (data)
			aHandler(data["children"]);
		else 
			aHandler(null);
	  }
	);
};

//var GetAllDeclsForParent = function(aParentId, aHandler)
//{
//	_delay(
//		function(){
//			var lresult = sUTLevaluateDecl(
//				{
//					"dict": _decls,
//					"parent": aParentId,
//					"item-t": "^*.constructdecl"
//				},
//				"getalldatanodesforparent",
//				["constructdecl"]
//			);
//		
//			aHandler(lresult);
//		}
//	);
//};

var _dataGetAllChildrenForParent = function(aParentId, aHandler)
{
	GetAllDistsForParent(aParentId, function(aChildDists){
		GetAllDeclsForParent(aParentId, function(aChildDecls ){
			var lchildren = sUTLevaluateDecl({"lists": [aChildDists, aChildDecls]}, "combinelists");
			
			aHandler(lchildren);
		});
		
	}); 
};

var _dataGetNodeById = function(aId, aHandler)
{
	var retval = GetDeclById(aId);
	if (!retval)
	{
		retval = GetDistById(aId);
	}
	aHandler(retval);
};


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
			
		_dataGetAllChildrenForParent(lparentId, function(aChildren){
			modelAddChildrenToModelNode(modelGetNodeById(aNodeId), aChildren);
		});
	}	
};

var dataUpdateNode = function (aModelNode)
{
	if (aModelNode && aModelNode.state === "updated")
	{
		GetDistById(aModelNode.id, function(aDistNode){
			if (aDistNode)
			{
				var lnewNode = sUTLevaluateDecl({
						"model": aModelNode,
						"data": aDistNode
					},
					"distmodeltodata"
				);
	
				SetDistById(aModelNode.id, lnewNode);

				delete aModelNode["state"];
	
				modelReplaceNode(aModelNode);
			}
			else
			{
				GetDeclById(aModelNode.id, function(aDeclNode)
				{
					if (aDeclNode)
					{
						var lnewNode2 = sUTLevaluateDecl({
								"model": aModelNode,
								"data": aDeclNode
							},
							"declmodeltodata"
						);
		
						SetDeclById(aModelNode.id, lnewNode2);

						delete aModelNode["state"];
			
						modelReplaceNode(aModelNode);
					}
				});
			}			
		});
	}
};

var dataDeleteNode = function (aNodeId)
{
	DeleteDistById(aNodeId);
	DeleteDeclById(aNodeId);
};

var dataAddNode = function (aModelNode)
{
	if (aModelNode && aModelNode.state === "added")
	{
		var lnewNode = null;
		
		if (aModelNode.type === "dist")
		{
			GetDistById(aModelNode.id, function(aDistNode)
			{
				if (!aDistNode)
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
			});
		}
		else if (aModelNode.type === "decl")
		{
			GetDeclById(aModelNode.id, function(aDeclNode)
			{
				if (!aDeclNode)
				{
					lnewNode = sUTLevaluateDecl({
							"model": aModelNode
						},
						"declmodeltodata"
					);
		
					SetDeclById(aModelNode.id, lnewNode);

					delete aModelNode["state"];
					
					modelReplaceNode(aModelNode);
				}
			});
		}
	}
};

RegisterModelObserver("data", function(aNotifyObj)
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
});
