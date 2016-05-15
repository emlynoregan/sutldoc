var gmodelDist = 
[
	{
	  "name": "constructroot_model_studio_emlynoregan_com",
	  "transform-t": {
	    "name": "/",
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
	    "language": "sUTL0", 
	    "name": "max_model_studio_emlynoregan_com", 
	    "transform-t": {
	        "&": "reduce", 
	        "accum": "^@.list.0", 
	        "list": "^@.list", 
	        "t": {
	            ":": {
	                "&": "if", 
	                "cond": {
	                    ":": [
	                        "&<", 
	                        "^@.accum", 
	                        "^@.item"
	                    ]
	                }, 
	                "false": {
	                    ":": "^@.accum"
	                }, 
	                "true": {
	                    ":": "^@.item"
	                }
	            }
	        }
	    }
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
	  "transform-t": {
	    "&": "addmaps",
	    "map1": "^@.node",
	    "map2": {
	      "children": {
	        "&": "removenulls",
	        "list": [
	          "&&",
	          "^@.node.children",
	          [
	            "^%",
	            {
	              "&": "reduce",
	              "list": "^@.children",
	              "accum": {
	                "result": [],
	                "order": [
	                  "&+",
	                  {
	                    "&": "max_model_studio_emlynoregan_com",
	                    "list": "&@.node.children.*.order"
	                  },
	                  1.0
	                ]
	              },
	              "t": {
	                ":": {
	                  "result": [
	                    "&&",
	                    "^@.accum.result",
	                    {
	                      "&": "addmaps",
	                      "map1": "^@.item",
	                      "map2": {
	                        "parent": "^@.node.id",
	                        "order": {
	                        	"&": "max_model_studio_emlynoregan_com",
	                        	"list": ["^@.item.order", "^@.accum.order"]
                        	}
	                      }
	                    }
	                  ],
	                  "order": [
	                    "&+",
	                    "^@.accum.order",
	                    1.0
	                  ]
	                }
	              }
	            },
	            "result"
	          ]
	        ]
	      }
	    }
	  },
	  "requires": [
	    "addmaps",
	    "map",
	    "removenulls",
	    "max_model_studio_emlynoregan_com"
	  ]
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
	    "published": "^@.item.published",
	    "order": {
	    	"&": "coalesce",
	    	"list": ["^@.item.order", 1]
	    }
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
	    "published": "^@.item.published",
	    "source": "^@.item.source",
	    "transform": "^@.item.transform",
	    "result": "^@.item.result",
	    "order": {
	    	"&": "coalesce",
	    	"list": ["^@.item.order", 1.0]
	    }
	  }
	}
];
