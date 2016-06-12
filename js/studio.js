
/*globals sUTL gcoreDist gstudioDist updateDetail treeExpandNode updateTree gmodelDist gtreeDist gdataDist treeClickNode modelInitialiseTree NotifyLoaded treeBeforeSelectNode*/

/*eslint-env jquery, browser*/


//var ltree = [
//  {"name": "thing"}
//]
//    

var crapguid = function () {
  var s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var setHeight = function(){
  var c = $('#layoutMain');
  c.layout('resize',{
      height: (window.innerHeight-30)
  });
};

var lsUTLLibDists = [];

var loadsUTLDists = function()
{
	lsUTLLibDists.push(gcoreDist);
	lsUTLLibDists.push(gmodelDist);
	lsUTLLibDists.push(gtreeDist);
	lsUTLLibDists.push(gdataDist);
};

loadsUTLDists();

var sUTLevaluateDecl= function(aSource, aDeclName, aRequiresDeclNames)
{
	var lresult = null;
	
	var lrequires = [aDeclName];
	if (aRequiresDeclNames)
	{
		lrequires = lrequires.concat(aRequiresDeclNames);
	}
	var ldecl = {
		"transform-t": {
		  "&": aDeclName
		}, 
		"requires": lrequires
	};

    var clresult = sUTL.compilelib([ldecl], lsUTLLibDists, false);

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
      var ltransform = ldecl["transform-t"];
      lresult = sUTL.evaluate(aSource, ltransform, clresult["lib"] || {}, 0);
    }

	return lresult;
};

$(
  function(){
	$(window).resize(function() {
	 	setHeight();    
	});
	
    setHeight();    
    
    $('#tvMain').tree(
      {
        onClick: function(node)
		{
		  treeClickNode(node);
		},
        onBeforeExpand: function(node)
		{
		  treeExpandNode(node);
		},
        onBeforeSelect: function(node)
		{
		  return treeBeforeSelectNode(node);
		}
      }
    );    

    $('#menuAbout').bind('click', function(){
		$('#windowAbout').window('open');  // open a window
    });

	modelInitialiseTree();    
  }
);


