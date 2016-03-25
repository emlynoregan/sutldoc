var gmodelDist = 
[
	{
	  "name": "constructroot_model_studio_emlynoregan_com",
	  "transform-t": {
	    "name": "Root",
	    "id": "root",
	    "type": "root"
	  }
	},
	{
	  "name": "getmodelnodebyid_model_studio_emlynoregan_com",
	  "transform-t": 
	  {
	    "&": "if",
	    "cond": {":": 
	      [
	        "&=",
	        "^@.node.id",
	        "^@.id"
	      ]
	    },
	    "true": {":": "^@.node"},
	    "false": {
	      "&": "reduce",
	      "list": "^@.node.children",
	      "accum": null,
	      "t": {":": {
	        "&": "if",
	        "cond": {":": "^@.accum"},
	        "true": {":": "^@.accum"},
	        "false": {":": {
	          "&": "getmodelnodebyid",
	          "node": "^@.item"
	        }}
	      }}
	    }
	  },
	  "requires": ["getmodelnodebyid"]
	},
	{
	  "name": "setmodelnodebyid_data_studio_emlynoregan_com",
	  "transform-t": {
	    "&": "if",
	    "cond": {":": 
	      [
	        "&=",
	        "^@.tree.id",
	        "^@.newnode.id"
	      ]
	    },
	    "true": {":": "^@.newnode"},
	    "false": {":": {
	      "!": {":": {
	      	"&": "if",
	      	"cond": {":": "^@.children"},
	      	"true": {":": {
	      	  "&": "addmaps",
		      "map1": "^@.tree",
		      "map2": {
		        "children": "^@.children" 
		      }
	      	}},
	      	"false": {":": "^@.tree"}
	      }},
	      "children": {
	          "&": "map_core",
	          "list": "^@.tree.children",
	          "t": {":": {
	            "&": "setmodelnodebyid",
	            "tree": "^@.item"
	          }}
	      }
	    }}
	  },
	  "requires": ["setmodelnodebyid", "addmaps", "map_core"]
	},
	{
	  "name": "addchildrentomodelnode_model_studio_emlynoregan_com",
	  "transform-t": 
	  {
	    "&": "addmaps",
	    "map1": "^@.node",
	    "map2": {
	      "children": 
	      {
	      	"&": "removenulls",
	      	"list": [
	      	  "&&",
	      	  "^@.node.children",
		      {
		      	"&": "map",
		      	"list": "^@.children",
		      	"t": {":": {
		      		"&": "addmaps",
		      		"map1": "^@.item",
		      		"map2": {
		      			"parent": "^@.node.id"
		      		}
		      	}}
	      	  }
      	    ]
  	      }
	    }
	  },
	  "requires": ["addmaps", "map", "removenulls"]
	},
	{
	  "name": "constructdist_model_studio_emlynoregan_com",
	  "args": {
	  	"item": "the item to transform"
	  },
	  "transform-t": {
	    "name": "^@.item.name",
	    "id": "^@.item.id",
	    "type": "dist",
	    "published": "^@.item.published"
	  }
	},
	{
	  "name": "constructdecl_model_studio_emlynoregan_com",
	  "args": {
	  	"item": "the item to transform"
	  },
	  "transform-t": {
	    "name": "^@.item.name",
	    "id": "^@.item.id",
	    "type": "decl",
	    "requiresdists": [],
	    "published": "^@.item.published",
	    "source": "^@.item.source",
	    "transform": "^@.item.transform",
	    "result": "^@.item.result"
	  }
	}
];
