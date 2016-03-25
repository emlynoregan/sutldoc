/*eslint-env jquery, node*/

/*globals distNameIsAvailable modelUpdateNode RegisterModelObserver selSetCenterPanelTitle ace sUTL lsUTLLibDists*/

var setupEditor = function(aId)
{
    var editor = ace.edit(aId);
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/json");
    editor.getSession().setTabSize(2);
    editor.getSession().setUseSoftTabs(true);
    editor.setFontSize(12);
    return editor;
};

var EditorIsInvalid = function(aEditor)
{
    var retval = null;

    var ljsonString = aEditor.getValue();
    try
    {
        JSON.parse(ljsonString);
    }
    catch (err)
    {
        retval = err.message;
    }

    return retval;
};

var ValidateJson = function(aEditor, aMessageSelector)
{
    $(aMessageSelector).text(EditorIsInvalid(aEditor));
};

var declUpdateDeclDetail = function(aNode)
{
  var edSource = setupEditor("edSource");
  var edTransform = setupEditor("edTransform");
  var edResult = setupEditor("edResult");
  
  edSource.getSession().removeAllListeners('change');
  edTransform.getSession().removeAllListeners('change');

  if (edSource.getValue() !== aNode.source)
  {
  	if (aNode.source)
	  edSource.setValue(aNode.source);
	else
	  edSource.setValue("");
	edSource.gotoLine(0);
  }
  if (edTransform.getValue() !== aNode.transform)
  {
  	if (aNode.transform)
	  edTransform.setValue(aNode.transform);
	else
	  edTransform.setValue("");
	edTransform.gotoLine(0);
  }
	
  var UpdateResult = function()
  {
    if (!(EditorIsInvalid(edSource) || EditorIsInvalid(edTransform)))
    {
        var lsourceJson = JSON.parse(edSource.getValue());
        var ltransformJson = JSON.parse(edTransform.getValue());

        try
        {
            var lresult = null;

            var ltransform = "transform-t" in ltransformJson ? ltransformJson["transform-t"] : null;

            var clresult = sUTL.compilelib([ltransformJson], lsUTLLibDists, true);

            if (!clresult)
            {
              lresult = "** Can't load libs **";
            }
            else if ("fail" in clresult)
            {
              lresult = clresult["fail"];
            }
            else
            {
              lresult = sUTL.evaluate(lsourceJson, ltransform, clresult["lib"] || {}, 0);
            }

            edResult.setValue(JSON.stringify(lresult, null, 2));
            edResult.gotoLine(0);
        }
        catch (e)
        {
            console.log(e);
            edResult.setValue("Exception: " + e.message);
            edResult.gotoLine(0);
        }
    }
  };

  edSource.getSession().on('change', function() {
    ValidateJson(edSource, "#sourcemsg");
	modelUpdateNode(aNode.id, {"source": edSource.getValue(), "state": "updated"});
    UpdateResult();
  });

  edTransform.getSession().on('change', function() {
    ValidateJson(edTransform, "#transformmsg");
	modelUpdateNode(aNode.id, {"transform": edTransform.getValue(), "state": "updated"});
    UpdateResult();
  });

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
