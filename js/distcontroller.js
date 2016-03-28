/*eslint-env jquery */

/*globals distNameIsAvailable modelUpdateNode RegisterModelObserver selSetCenterPanelTitle ace NotifyErrorMessage*/
var _lastSelectedNode = null;

var distUpdateDistDetail = function(aNode)
{
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

  var IsValid = function(value)
  {
  	return true;
//     return value === aNode.name || distNameIsAvailable(value, aNode.id);
  };

  $.extend(
      $.fn.validatebox.defaults.rules, {
      distname: {
          validator: function(value, params){
          	return IsValid(value);
          },
          message: 'This distribution name is already taken. Please try another.'
      }
  });

  $('#vbDistName').textbox({
      value: aNode.name,
  });

  $('#vbDistName').textbox({
      onChange: function(value, params){
	    var lvalue = $('#vbDistName').textbox('getValue');
      	if (IsValid(lvalue))
      	{
	        modelUpdateNode(aNode.id, {"name": lvalue, "state": "updated"});
        }
      }
  });
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
