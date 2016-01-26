var gtreeDist = 
[
	{
	  "name": "modeltotreeview_treeview_studio_emlynoregan_com",
	  "transform-t": 
	  {
	      "&": "addmaps",
	  	  "map1": {
	  		  "id": "^@.node.id",
	  		  "text": "^@.node.name",
	  		  "state": {
	  		  	"&": "switch",
	  		  	"value": "^@.node.type",
	  		  	"cases": [
	  		  	  [["root", "decl", "dist"], 
	  		  	  {
	  		  	    "&": "if",
	  		  	    "cond": {":": {
	  		  	      "&": "isinlist",
	  		  	      "item": "children",
	  		  	      "list": {
	  		  	        "&": "keys",
	  		  	        "map": "^@.node"
	  		  	      }
	  		  	    }},
	  		  	    "true": "open",
	  		  	    "false": "closed"
	  		  	  }],
	  		  	  "open"
	  		  	]
	  		  },
	  		  "attributes": {
	  		    "node": "^@.node"
	  	    }
	  	  },
	  	  "map2": {
	  	    "&": "if",
	  	    "cond": {":": "^@.node.children"},
	  	    "true": {":": {
	    	    "&": "removenullattribs",
	    	    "map": {
	    	      "children": {
	    	        "&": "map_core",
	    	        "list": "^@.node.children",
	    	        "t": {":": {
	    	          "&": "modeltotreeview",
	    	          "node": "^@.item"
	    	        }}
	    	      }
	    	    }
	  	    }},
	  	    "false": {}
	  	  }
	  },
	  "requires": ["modeltotreeview", "switch", "addmaps", "removenullattribs","map_core"]
	},
	{
	  "name": "needexpand_treeview_studio_emlynoregan_com",
	  "transform-t": 
	  {
	  	"&": "switch",
	  	"value": "^@.node.type",
	  	"cases": [
	  	  [
	  	    ["root", "decl", "dist"], 
  	  	  [
  	  	    "&!",
            {
      	      "&": "isinlist",
      	      "item": "children",
      	      "list": {
      	        "&": "keys",
      	        "map": "^@.node"
      	      }
    	  	  }
    	  	]
    	  ],
	  	  false
	  	]
	  },
	  "requires": ["switch"]
	}
];
