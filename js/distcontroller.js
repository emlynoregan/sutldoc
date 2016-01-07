/*eslint-env jquery */

/*globals distNameIsAvailable UpdateNode RegisterModelObserver setCenterPanelTitle*/
var _lastSelectedNode = null;

var dc_UpdateDistDetail = function(aNode)
{
  var SetTitle = function(aUpdated)
  {
  	setCenterPanelTitle("Distribution", aUpdated);
  };

  SetTitle(aNode.state);
  
  $('#sbDistPublished').switchbutton({
      checked: aNode.published,
      onChange: function(checked){
        UpdateNode(aNode.id, {"published": checked, "state": "updated"});
      }
  });

  var IsValid = function(value)
  {
     return value === aNode.name || distNameIsAvailable(value, aNode.id);
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
	        UpdateNode(aNode.id, {"name": lvalue, "state": "updated"});
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
			dc_UpdateDistDetail(aNotifyObj.node);
		}
	}
});
