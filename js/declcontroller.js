/*eslint-env jquery, node*/

/*globals distNameIsAvailable modelUpdateNode RegisterModelObserver selSetCenterPanelTitle ace sUTL lsUTLLibDists NotifyErrorMessage*/

var setupEditor = function(aId)
{
    var editor = ace.edit(aId);
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/json");
    editor.getSession().setTabSize(2);
    editor.getSession().setUseSoftTabs(true);
    editor.setFontSize(14);
    return editor;
};

var EditorIsInvalid = function(aEditor, aPrefix)
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

	if (retval)
		NotifyErrorMessage(aPrefix + ": " + retval);
		
    return retval;
};

var GetRequires = function(aStrRequires)
{
	var retval = null;
	
	if (aStrRequires)
	{
	    try
	    {
	    	retval = aStrRequires.split(" ");
	    }
	    catch (err)
	    {
	    	console.log(err);
	    }
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
  	  NotifyErrorMessage("");
  	  
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
	  	if (aNode.id === _selectedNode.id)
	  	{
		    if (!(EditorIsInvalid(_edTransform, "Transform") || EditorIsInvalid(_edSource, "Source")))
		    {
		        var lsourceJson = JSON.parse(_edSource.getValue());
		        var ltransform = JSON.parse(_edTransform.getValue());
		        var lrequires = GetRequires($('#vbDeclRequires').textbox('getValue'));
		
		        try
		        {
		            var lresult = null;
	
		            var ldecl = {
		            	"transform-t": ltransform
		            };
		            
		            if (lrequires)
		            {
		            	ldecl["requires"] = lrequires;
		            }
		
		            var clresult = sUTL.compilelib([ldecl], [], true);
		
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
	    }
	  };

	  _edResult.setValue("");
	  UpdateResult();
	  _dontUpdate = false;

	  var lsourceTimeout = null;
	  _edSource.getSession().on('change', function() 
	  {
	  	if (!_dontUpdate)
	  	{
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
	      checked: _selectedNode.published,
	      onChange: function(checked){
	        modelUpdateNode(_selectedNode.id, {"published": checked, "state": "updated"});
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
	      value: _selectedNode.name,
	  });
	
	  $('#vbDeclName').textbox({
	      onChange: function(value, params){
		    var lvalue = $('#vbDeclName').textbox('getValue');
	      	if (IsValid(lvalue))
	      	{
		        modelUpdateNode(_selectedNode.id, {"name": lvalue, "state": "updated"});
	        }
	      }
	  });

	  $('#vbDeclRequires').textbox({
	      value: _selectedNode.requires,
	  });
	
	  $('#vbDeclRequires').textbox({
	      onChange: function(value, params){
		    var lvalue = $('#vbDeclRequires').textbox('getValue');
		    modelUpdateNode(_selectedNode.id, {"requires": lvalue, "state": "updated"});
		    UpdateResult();
	      }
	  });
  }

  $('#lbsrcgen').attr('href', aNode.srcgen);
	  
  var SetTitle = function(aNode)
  {
  	selSetCenterPanelTitle(aNode.name, aNode.state);
  };

  SetTitle(aNode);
};

RegisterModelObserver("decldetail", function(aNotifyObj)
{
	if (aNotifyObj)
	{
		if (aNotifyObj.type === "treereplace")
		{
			_selectedNode = null;
			_edSource = null;
			_edTransform = null;
			_edResult = null;
			_dontUpdate = false;
		}
//		else if (aNotifyObj.type === "nodeupdated")
//		{
//			if (aNotifyObj.node.type === "decl")
//			{
//				declUpdateDeclDetail(aNotifyObj.node);
//			}
//		}
	}
});
