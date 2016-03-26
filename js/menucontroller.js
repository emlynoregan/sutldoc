/*eslint-env jquery, browser*/

/*globals RegisterModelObserver distUpdateDistDetail modelGetNodeById modelDeleteNode modelAddDistNode modelInitialiseTree modelAddDeclNode modelGetUser*/

var _user = null;

var menuUpdate = function(aSelectedNode)
{
	var UpdateMenuItem = function(aItemId, aMenuId, aEnabled, aOnClickF)
	{
		var litem = $('#' + aItemId);
		var lmenu = $('#' + aMenuId);

		litem.unbind();
		var itemEl = litem[0];
		
		if (aEnabled)
		{
		    litem.bind('click', aOnClickF);
		    
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
		aSelectedNode && (aSelectedNode.type === "root" || aSelectedNode.type ===  "dist"),
		function() {
	    	var lmodelNode = modelGetNodeById(aSelectedNode.id);
	    	
	    	if (lmodelNode)
	    	{
				modelAddDistNode(aSelectedNode.id);
    		}	
	    }		
	);

	UpdateMenuItem(
		"menuAddDecl", "mm1",
		aSelectedNode && (aSelectedNode.type ===  "dist"),
		function() {
	    	var lmodelNode = modelGetNodeById(aSelectedNode.id);
	    	
	    	if (lmodelNode)
	    	{
				modelAddDeclNode(aSelectedNode.id);
    		}	
	    }		
	);

	UpdateMenuItem(
		"menuDelete", "mm1",
		aSelectedNode && (aSelectedNode.type === "dist" || aSelectedNode.type ===  "decl"),
		function() {
	    	var lmodelNode = modelGetNodeById(aSelectedNode.id);
	    	
	    	if (lmodelNode)
	    	{
				$.messager.confirm(
					'Confirm Delete',
					'Are you sure you want to delete ' + aSelectedNode.name + '?',
					function(r){
					    if (r){
					        modelDeleteNode(aSelectedNode.id);
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


