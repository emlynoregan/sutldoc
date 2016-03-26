/*eslint-env jquery, node*/

/*globals distNameIsAvailable modelUpdateNode RegisterModelObserver selSetCenterPanelTitle ace sUTL lsUTLLibDists*/

var setupEditor = function(aId)
{
    var editor = ace.edit(aId);
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/json");
    editor.getSession().setTabSize(2);
    editor.getSession().setUseSoftTabs(true);
    editor.setFontSize(20);
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

var _selectedNode = null;
var _edSource = null;
var _edTransform = null;
var _edResult = null;
var _dontUpdate = false;

var declUpdateDeclDetail = function(aNode)
{
  if (!(_selectedNode && (aNode.id === _selectedNode.id)))
  {
	  _selectedNode = aNode;
  	
  	  if (!_edSource )
  	  {
		  _edSource = setupEditor("edSource");
		  _edTransform = setupEditor("edTransform");
		  _edResult = setupEditor("edResult");
	  }
	  
	  //_edSource.getSession().removeAllListeners('change');
	  //_edTransform.getSession().removeAllListeners('change');

	  _dontUpdate = true;
	  if (_edSource.getValue() !== aNode.source)
	  {
	  	if (aNode.source)
		  _edSource.setValue(aNode.source);
		else
		  _edSource.setValue("");
		_edSource.gotoLine(0);
	  }
	  if (_edTransform.getValue() !== aNode.transform)
	  {
	  	if (aNode.transform)
		  _edTransform.setValue(aNode.transform);
		else
		  _edTransform.setValue("");
		_edTransform.gotoLine(0);
	  }
	
	  var UpdateResult = function()
	  {
	    if (!(EditorIsInvalid(_edSource) || EditorIsInvalid(_edTransform)))
	    {
	        var lsourceJson = JSON.parse(_edSource.getValue());
	        var ltransformJson = JSON.parse(_edTransform.getValue());
	
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
	
	            _edResult.setValue(JSON.stringify(lresult, null, 2));
	            _edResult.gotoLine(0);
	        }
	        catch (e)
	        {
	            console.log(e);
	            _edResult.setValue("Exception: " + e.message);
	            _edResult.gotoLine(0);
	        }
	    }
	  };

	  _edResult.setValue("");
	  UpdateResult();
	  _dontUpdate = false;

	  var lsourceTimeout = null;
	  _edSource.getSession().on('change', function() {
	  	if (!_dontUpdate)
	  	{
		    //ValidateJson(_edSource, "#sourcemsg");

			if (lsourceTimeout)
				clearTimeout(lsourceTimeout);
		    lsourceTimeout = setTimeout(
		    	function() {
		    		modelUpdateNode(_selectedNode.id, {"source": _edSource.getValue(), "state": "updated"});
		    	}, 
		    	1000
		    );

		    UpdateResult();
	    }
	  });

	  var ltransformTimeout = null;
	  _edTransform.getSession().on('change', function() {
	  	if (!_dontUpdate)
	  	{
		    //ValidateJson(_edTransform, "#transformmsg");
			if (ltransformTimeout)
				clearTimeout(ltransformTimeout);
		    ltransformTimeout = setTimeout(
		    	function() {
					modelUpdateNode(_selectedNode.id, {"transform": _edTransform.getValue(), "state": "updated"});
		    	}, 
		    	1000
		    );
		    UpdateResult();
	    }
	  });
	  
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
  }
  var SetTitle = function(aUpdated)
  {
  	selSetCenterPanelTitle("Declaration", aUpdated);
  };

  SetTitle(aNode.state);
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
