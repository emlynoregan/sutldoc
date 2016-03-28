/*eslint-env jquery, browser*/

/*globals RegisterModelObserver distUpdateDistDetail modelGetNodeById modelDeleteNode modelAddDistNode modelInitialiseTree modelAddDeclNode modelGetUser*/

var errorMessageUpdate = function(aNotifyObj)
{
	$('#errormessage').text(aNotifyObj.errormessage);
};


RegisterModelObserver("bottom", function(aNotifyObj)
{
	if (aNotifyObj)
	{
		if (aNotifyObj.type === "errormessage")
		{
			errorMessageUpdate(aNotifyObj);
		}
	}
});


