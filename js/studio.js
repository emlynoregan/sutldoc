
/*globals sUTL gcoreDist gstudioDist updateDetail expandNode updateTree InitialiseModelTree gmodelDist gtreeDist gdataDist clickNode*/

/*eslint-env jquery, browser*/


//var ltree = [
//  {"name": "thing"}
//]
//    


var setHeight = function(){
  var c = $('#layoutMain');
  c.layout('resize',{
      height: (window.innerHeight-20)
  });
};

var onClickHandler = function(node)
{
  clickNode(node);
};

var onExpandHandler = function(node)
{
  expandNode(node);
};
 
var lsUTLLibDists = [];

var loadsUTLDists = function()
{
	lsUTLLibDists.push(gcoreDist);
	lsUTLLibDists.push(gmodelDist);
	lsUTLLibDists.push(gtreeDist);
	lsUTLLibDists.push(gdataDist);
};

var sUTLevaluateDecl= function(aSource, aDeclName)
{
	var lresult = null;
	var ldecl = {
		"transform-t": {
		  "&": aDeclName
		}, 
		"requires": [aDeclName]}
	;
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
  	loadsUTLDists();
  	
	$(window).resize(function() {
	 	setHeight();    
	});
	
    setHeight();    
    
    $('#tvMain').tree(
      {
         onClick: onClickHandler,
         onBeforeExpand: onExpandHandler,
      }
    );    

	InitialiseModelTree();    
  }
);


