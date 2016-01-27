/*eslint-env jquery */

/*globals distNameIsAvailable modelUpdateNode RegisterModelObserver selSetCenterPanelTitle*/

var declUpdateDeclDetail = function(aNode)
{
  var SetTitle = function(aUpdated)
  {
  	selSetCenterPanelTitle("Declaration", aUpdated);
  };

  SetTitle(aNode.state);
  
  $('#sbDeclPublished').switchbutton({
      checked: aNode.published,
      onChange: function(checked){
        modelUpdateNode(aNode.id, {"published": checked, "state": "updated"});
      }
  });

  var IsValid = function(value)
  {
  	return value.length > 0;
  };

  $.extend(
      $.fn.validatebox.defaults.rules, {
      distname: {
          validator: function(value, params){
          	return IsValid(value);
          },
          message: 'Please provide a declaration name.'
      }
  });

  $('#vbDeclName').textbox({
      value: aNode.name,
  });

  $('#vbDeclName').textbox({
      onChange: function(value, params){
	    var lvalue = $('#vbDeclName').textbox('getValue');
      	if (IsValid(lvalue))
      	{
	        modelUpdateNode(aNode.id, {"name": lvalue, "state": "updated"});
        }
      }
  });
};

RegisterModelObserver("decldetail", function(aNotifyObj)
{
	if (aNotifyObj)
	{
		if (aNotifyObj.type === "nodeupdated")
		{
			if (aNotifyObj.node.type === "decl")
			{
				declUpdateDeclDetail(aNotifyObj.node);
			}
		}
	}
});
