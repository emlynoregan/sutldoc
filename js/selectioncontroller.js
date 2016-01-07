/*eslint-env jquery */

/*globals RegisterModelObserver */
var getCenterPanel = function()
{
  return $('#layoutMain').layout('panel', 'center');
};

var setCenterPanelTitle = function(aTitle, aUpdated)
{
  var lpanel = getCenterPanel();
  var ltitle = aTitle;
  if (aUpdated)
  {
  	ltitle = ltitle + " (saving...)";
  }
  lpanel.panel('setTitle', ltitle);
};

var updateRootDetail = function()
{
  $("#rootdetail").show();
  $("#distdetail").hide();
  $("#decldetail").hide();
  setCenterPanelTitle("Root");
};

var updateDistDetail = function(aNode)
{
  $("#rootdetail").hide();
  $("#distdetail").show();
  $("#decldetail").hide();
  setCenterPanelTitle("Distribution");

  dc_UpdateDistDetail(aNode);
};

var updateDeclDetail = function(aNode)
{
  $("#rootdetail").hide();
  $("#distdetail").hide();
  $("#decldetail").show();
  setCenterPanelTitle("Declaration");
};

var updateDetail = function(aNode)
{
  if (aNode)
  {
    if (aNode.type === "dist")
        updateDistDetail(aNode);
    else if (aNode.type === "decl")
        updateDeclDetail(aNode);
    else
        updateRootDetail(aNode);
  }
  else
  {
    updateRootDetail(aNode);
  }
};

RegisterModelObserver("selection", function(aNotifyObj)
{
	if (aNotifyObj)
	{
		if (aNotifyObj.type === "nodeselected")
		{
			updateDetail(aNotifyObj.node);
		}
	}
});


