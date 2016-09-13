/*eslint-env jquery, browser*/

/*globals RegisterModelObserver distUpdateDistDetail modelGetNodeById modelDeleteNode modelAddDistNode modelInitialiseTree modelAddDeclNode modelGetUser*/

var _user = null;
var _mcclipboard = null;
var _bound = {};
var _mcselectedNode = null;

var menuUpdate = function(aSelectedNode)
{
	_mcselectedNode = aSelectedNode;
	
	var UpdateMenuItem = function(aItemId, aMenuId, aEnabled, aOnClickF)
	{
		var litem = $('#' + aItemId);
		var lmenu = $('#' + aMenuId);

		var itemEl = litem[0];
		
		if (aEnabled)
		{
			if (!_bound[aMenuId + "_" + aItemId])
			{
			    litem.bind('click', aOnClickF);
			    _bound[aMenuId + "_" + aItemId] = true;
		    }
		    
			lmenu.menu('enableItem', itemEl);
		}
		else
		{
			lmenu.menu('disableItem', itemEl);
		}
	};

	UpdateMenuItem(
		"menuRefresh", "mm1",
		true,
		function() {
			modelInitialiseTree(); 
	    }		
	);

	UpdateMenuItem(
		"menuAddDist", "mm1",
		_mcselectedNode && (_mcselectedNode.type === "root" || _mcselectedNode.type ===  "dist"),
		function() {
	    	var lmodelNode = modelGetNodeById(_mcselectedNode.id);
	    	
	    	if (lmodelNode)
	    	{
				modelAddDistNode(_mcselectedNode.id);
    		}	
	    }		
	);

	UpdateMenuItem(
		"menuAddDecl", "mm1",
		_mcselectedNode && (_mcselectedNode.type ===  "dist"),
		function() {
	    	var lmodelNode = modelGetNodeById(_mcselectedNode.id);
	    	
	    	if (lmodelNode)
	    	{
				modelAddDeclNode(_mcselectedNode.id);
    		}	
	    }		
	);

	UpdateMenuItem(
		"menuCopy", "mm1",
		_mcselectedNode && (_mcselectedNode.type === "dist" || _mcselectedNode.type ===  "decl"),
		function() {
			_mcclipboard = _mcselectedNode;
			var lmnuClipboard = $('#menuClipboard');
			var lmenu = $("#mm1");
			lmenu.menu("setText", {
				target: lmnuClipboard,
				text: "Clipboard: " + _mcselectedNode.name
			});
		}
	);

	UpdateMenuItem(
		"menuPaste", "mm1",
		_mcselectedNode && 
		_mcclipboard &&
		(
			_mcselectedNode.type === "dist" || 
			_mcselectedNode.type ===  "decl" 
		),
		function() {
	    	var lmodelNode = modelGetNodeById(_mcselectedNode.id);
	    	
	    	if (lmodelNode)
	    	{
				modelCopyNode(_mcclipboard.id, _mcselectedNode.id);
    		}	
		}
	);

	UpdateMenuItem(
		"menuDelete", "mm1",
		_mcselectedNode && (_mcselectedNode.type === "dist" || _mcselectedNode.type ===  "decl"),
		function() {
	    	var lmodelNode = modelGetNodeById(_mcselectedNode.id);
	    	
	    	if (lmodelNode)
	    	{
				$.messager.confirm(
					'Confirm Delete',
					'Are you sure you want to delete ' + _mcselectedNode.name + '?',
					function(r){
					    if (r){
					        modelDeleteNode(_mcselectedNode.id);
					    }
				    }
				);
    		}	
	    }		
	);

	UpdateMenuItem(
		"menuLogout", "mm3",
		true,
		function() {
			$.messager.confirm(
				'Confirm Logout',
				'Are you sure you wish to logout?',
				function(r){
				    if (r){
				        window.location.replace("/logout");
				    }
			    }
			);
	    }		
	);
	
	if (!_user)
	{
		modelGetUser(function(aUser){
			_user = aUser;
			
			var lmbLogin = $('#menuLoginname');
			
			lmbLogin.text(aUser.name);
		});
	}
};

RegisterModelObserver("menu", function(aNotifyObj)
{
	if (aNotifyObj)
	{
		if (aNotifyObj.type === "nodeselected")
		{
			menuUpdate(aNotifyObj.node);
		}
		else if (aNotifyObj.type === "treereplace")
		{
			menuUpdate(null);
		}
	}
});


