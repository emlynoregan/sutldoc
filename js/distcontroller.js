/*eslint-env jquery */

/*globals distNameIsAvailable modelUpdateNode RegisterModelObserver selSetCenterPanelTitle ace NotifyErrorMessage*/
var _lastSelectedNode = null;


var distUpdateDistDetail = function(aNode)
{
	if (aNode && !(_lastSelectedNode && aNode.id == _lastSelectedNode.id))
	{
	  if (aNode)
	  {
		  $('#lbsrcgendist').attr('href', '/srcgen/dist?id=' + aNode.id);
		  $('#lbsrcgendistpublished').attr('href', '/srcgen/dist?publishedonly=true&id=' + aNode.id);
		  $('#lbsrcgendistlib').attr('href', '/srcgen/distlib?id=' + aNode.id);
		  $('#lbsrcgendistlibonly').attr('href', '/srcgen/distlib?libonly=true&id=' + aNode.id);
	  }

	  _lastSelectedNode = aNode;
	
	  NotifyErrorMessage("");
	  
	  var SetTitle = function(aUpdated)
	  {
	  	selSetCenterPanelTitle("Distribution", aUpdated);
	  };
	
	  SetTitle(aNode.state);
	  
	  $('#sbDistPublished').switchbutton({
	      checked: aNode.published,
	      onChange: function(checked){
	        modelUpdateNode(aNode.id, {"published": checked, "state": "updated"});
	      }
	  });
	
//	  var IsValid = function(value)
//	  {
//	  	return true;
//	  };
	
//	  $.extend(
//	      $.fn.validatebox.defaults.rules, {
//	      distname: {
//	          validator: function(value, params){
//	          	return IsValid(value);
//	          },
//	          message: 'This distribution name is already taken. Please try another.'
//	      }
//	  });
	
	  $('#vbDistName').textbox({
	      value: aNode.name,
	  });
	
	  $('#vbDistName').textbox({
	      onChange: function(value, params){
		    var lvalue = $('#vbDistName').textbox('getValue');
	        modelUpdateNode(aNode.id, {"name": lvalue, "state": "updated"});
//	      	if (IsValid(lvalue))
//	      	{
//		        modelUpdateNode(aNode.id, {"name": lvalue, "state": "updated"});
//	        }
	      }
	  });
	
	  $('#tbDistId').textbox({
	      value: aNode.id
	  });
	
	  $('#tbDistRequires').textbox({
	      value: aNode.requires
	  });
	
	  $('#tbDistRequires').textbox({
	      onChange: function(value, params){
		    var lvalue = $('#tbDistRequires').textbox('getValue');
		    modelUpdateNode(aNode.id, {"requires": lvalue, "state": "updated"});
	      }
	  });
	}
	
	if (!aNode)
	{
	  $('#lbsrcgendist').attr('href', null);
	  $('#lbsrcgendistpublished').attr('href', null);
	  $('#lbsrcgendistlib').attr('href', null);
	  $('#lbsrcgendistlibonly').attr('href', null);
	}
};

RegisterModelObserver("distdetail", function(aNotifyObj)
{
	if (aNotifyObj)
	{
		if (aNotifyObj.type === "nodeupdated")
		{
			if (aNotifyObj.node.type === "dist")
			{
				distUpdateDistDetail(aNotifyObj.node);
			}
		}
	}
});
