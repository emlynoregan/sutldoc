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
	      "children": "^@.children"
	    }
	  },
	  "requires": ["addmaps"]
	},
	{
	  "name": "constructdist_model_studio_emlynoregan_com",
	  "transform-t": {
	    "name": "^@.name",
	    "id": "^@.id",
	    "type": "dist",
	    "published": "^@.published"
	  }
	},
	{
	  "name": "constructdecl_model_studio_emlynoregan_com",
	  "transform-t": {
	    "name": "^@.name",
	    "id": "^@.id",
	    "type": "decl",
	    "requiresdists": [],
	    "published": "^@.published"
	  }
	},
	{
	  "name": "adddecltodist_model_studio_emlynoregan_com",
	  "transform-t": {
	    "&": "addmaps",
	    "map1": "^@.dist",
	    "map2": {
	    	"!": {":": {
	    		"childdecls": "^@.childdecls",
	    		"children": [
	    			"&&",
	    			"^@.dist.childdists",
	    			"^@.childdecls"
	    		]
	    	}},
	    	"childdecls": [
		        "&&",
		        "^@.dist.childdecls",
		        [{
		          "&": "addmaps",
		          "map1": "^@.decl",
		          "map2": {
		            "parentid": "^@.dist.id"
		          }
		        }]
			]
		}
	  },
	  "requires": ["addmaps"]
	},
	{
	  "name": "adddisttodist_model_studio_emlynoregan_com",
	  "transform-t": {
	    "&": "addmaps",
	    "map1": "^@.dist1",
	    "map2": {
	      "childdists": [
	        "&&",
	        "^@.dist.childdists",
	        [{
	          "&": "addmaps",
	          "map1": "^@.dist2",
	          "map2": {
	            "parentid": "^@.dist1.id"
	          }
	        }]
	      ]
	    }
	  },
	  "requires": ["addmaps"]
	}
];
