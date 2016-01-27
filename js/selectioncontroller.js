/*eslint-env jquery */

/*globals RegisterModelObserver distUpdateDistDetail declUpdateDeclDetail*/

var selGetCenterPanel = function()
{
  return $('#layoutMain').layout('panel', 'center');
};

var selSetCenterPanelTitle = function(aTitle, aUpdated)
{
  var lpanel = selGetCenterPanel();
  var ltitle = aTitle;
  if (aUpdated)
  {
  	ltitle = ltitle + " (saving...)";
  }
  lpanel.panel('setTitle', ltitle);
};

var selUpdateRootDetail = function()
{
  $("#rootdetail").show();
  $("#distdetail").hide();
  $("#decldetail").hide();
  selSetCenterPanelTitle("Root");
};

var selUpdateDistDetail = function(aNode)
{
  $("#rootdetail").hide();
  $("#distdetail").show();
  $("#decldetail").hide();
  selSetCenterPanelTitle("Distribution");

  distUpdateDistDetail(aNode);
};

var selUpdateDeclDetail = function(aNode)
{
  $("#rootdetail").hide();
  $("#distdetail").hide();
  $("#decldetail").show();
  selSetCenterPanelTitle("Declaration");

  declUpdateDeclDetail(aNode);
};

var selUpdateDetail = function(aNode)
{
  if (aNode)
  {
    if (aNode.type === "dist")
        selUpdateDistDetail(aNode);
    else if (aNode.type === "decl")
        selUpdateDeclDetail(aNode);
    else
        selUpdateRootDetail(aNode);
  }
  else
  {
    selUpdateRootDetail(aNode);
  }
};

RegisterModelObserver("selection", function(aNotifyObj)
{
	if (aNotifyObj)
	{
		if (aNotifyObj.type === "nodeselected")
		{
			selUpdateDetail(aNotifyObj.node);
		}
	}
});


