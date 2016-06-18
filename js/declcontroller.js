/*eslint-env jquery, node*/

/*globals distNameIsAvailable modelUpdateNode RegisterModelObserver selSetCenterPanelTitle ace sUTL lsUTLLibDists NotifyErrorMessage modelGetLibDist modelGetNodeFullNameById modelGetLib modelSetLib*/

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

//var ValidateJson = function(aEditor, aMessageSelector)
//{
//    $(aMessageSelector).text(EditorIsInvalid(aEditor));
//};
//
var _selectedNode = null;
var _edSource = null;
var _edTransform = null;
var _edResult = null;
var _dontUpdate = false;

var _sourceTimeout = null;
var _transformTimeout = null;

var declUpdateDeclDetail = function(aNode)
{
  var lsrcgen = null;
  if (aNode && aNode.srcgen)
  	lsrcgen = aNode.srcgen;
  $('#lbsrcgen').attr('href', lsrcgen);
	  
  var SetTitle = function(aNode)
  {
  	selSetCenterPanelTitle(aNode.name, aNode.state);
  };

  if (aNode)
	SetTitle(aNode);
};


var declUpdateResult = function(aNode)
{
    if (!(EditorIsInvalid(_edTransform, "Transform") || EditorIsInvalid(_edSource, "Source")))
    {
		NotifyErrorMessage("");

        var lsourceJson = JSON.parse(_edSource.getValue());
        var ltransform = JSON.parse(_edTransform.getValue());
        var lrequires = GetRequires($('#vbDeclRequires').textbox('getValue'));
        var ldists = modelGetLibDist(_selectedNode.id);
		var lfullname = modelGetNodeFullNameById(_selectedNode.id);
		
        try
        {
            var lresult = null;

            var ldecl = {
            	"transform-t": ltransform,
            	"name": lfullname
            };
            
            if (lrequires)
            {
            	ldecl["requires"] = lrequires;
            }
            
            var llib = modelGetLib(_selectedNode.id);
            
            var clresult;
            if (llib)
            {
            	clresult = {"lib": llib, "noset": true};
        	}
            else
            {
	            clresult = sUTL.compilelib([ldecl], [ldists], false);
            }

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
            	if (!clresult["noset"])
	            	modelSetLib(_selectedNode.id, clresult["lib"]);
                lresult = sUTL.evaluate(lsourceJson, ltransform, clresult["lib"] || {}, 0);
            }

            _edResult.setValue(JSON.stringify(lresult, null, 2));
            _edResult.gotoLine(0);

			NotifyErrorMessage("");
        }
        catch (e)
        {
            console.log(e);
            var lerrorMessage = "Result Exception: " + e.message;
			NotifyErrorMessage(lerrorMessage);
            _edResult.setValue(lerrorMessage);
            _edResult.gotoLine(0);
        }
    }
};

var declSetSelected = function(aNode)
{
  if (aNode && !(_selectedNode && (aNode.id === _selectedNode.id)))
  {
	  _selectedNode = aNode;

  	  NotifyErrorMessage("");
  	  
  	  if (!_edSource )
  	  {
		  _edSource = setupEditor("edSource");
		  _edTransform = setupEditor("edTransform");
		  _edResult = setupEditor("edResult");
	  }
	  
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
	

	  _edResult.setValue("");
	  declUpdateResult();
	  _dontUpdate = false;

	  _edSource.getSession().on('change', function() 
	  {
	  	if (!_dontUpdate)
	  	{
			if (_sourceTimeout)
				clearTimeout(_sourceTimeout);

		    _sourceTimeout = setTimeout(
		    	function() {
		    		modelUpdateNode(_selectedNode.id, {"source": _edSource.getValue(), "state": "updated"});
		    		_sourceTimeout = null;
				    declUpdateResult();
		    	}, 
		    	1000
		    );
	    }
	  });

	  _edTransform.getSession().on('change', function() {
	  	if (!_dontUpdate)
	  	{
		    //ValidateJson(_edTransform, "#transformmsg");
			if (_transformTimeout)
				clearTimeout(_transformTimeout);
				
		    _transformTimeout = setTimeout(
		    	function() {
					modelUpdateNode(_selectedNode.id, {"transform": _edTransform.getValue(), "state": "updated"});
					_transformTimeout = null;
				    declUpdateResult();
		    	}, 
		    	500
		    );
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
		    modelSetLib(_selectedNode.id, null);
		    var lvalue = $('#vbDeclName').textbox('getValue');
	      	if (IsValid(lvalue))
	      	{
		        modelUpdateNode(_selectedNode.id, {"name": lvalue, "state": "updated"});
	        }
	      }
	  });

	  var lrequires = _selectedNode.requires;
	  if (!lrequires)
	  	lrequires = null;
	  $('#vbDeclRequires').textbox({
	      value: lrequires,
	  });
	
	  $('#vbDeclRequires').textbox({
	      onChange: function(value, params){
		    modelSetLib(_selectedNode.id, null);
		    var lvalue = $('#vbDeclRequires').textbox('getValue');
		    modelUpdateNode(_selectedNode.id, {"requires": lvalue, "state": "updated"});
		    declUpdateResult();
	      }
	  });

	  $('#accBody').accordion("resize");

	  _dontUpdate = true;
	  declUpdateResult();
	  _dontUpdate = false;
  }
  else
  {
	  _selectedNode = aNode;
  }

  declUpdateDeclDetail(aNode);
};

var declSetUnselected = function(aNode)
{
  if (aNode && _selectedNode && aNode.id !== _selectedNode.id)
  {
  	if (_sourceTimeout)
  	{
		modelUpdateNode(_selectedNode.id, {"source": _edSource.getValue(), "state": "updated"});
		_sourceTimeout = null;
  	}

  	if (_transformTimeout)
  	{
		modelUpdateNode(_selectedNode.id, {"transform": _edTransform.getValue(), "state": "updated"});
		_transformTimeout = null;
  	}
  }
}

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
		else if (aNotifyObj.type === "nodeupdated")
		{
			if (aNotifyObj.node.type === "decl")
			{
				declUpdateDeclDetail(aNotifyObj.node);
			}
		}
		else if (aNotifyObj.type === "nodeselected")
		{
			if (aNotifyObj.node.type === "decl")
			{
				declSetSelected(aNotifyObj.node);
			}
			else
			{
				declSetSelected(null);
			}
		}
		else if (aNotifyObj.type === "nodeunselected")
		{
			if (aNotifyObj.node.type === "decl")
			{
				declSetUnselected(aNotifyObj.node);
			}
		}
		else if (aNotifyObj.type === "libupdated")
		{
			if (aNotifyObj.node.type === "decl" && aNotifyObj.node.id === _selectedNode.id) 
			{
				declUpdateResult();
			}
		}
	}
});
