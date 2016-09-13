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
	  "name": "getnodefullnamebyid_model_studio_emlynoregan_com",
	  "transform-t": 
	  {
	  	"!": {
	  	  ":": {
		    "&": "if",
		    "cond": {":": 
		      [
		        "&=",
		        "^@.node.id",
		        "^@.id"
		      ]
		    },
		    "true": {":": {
		    	"&": "join",
		    	"list": ["&&", "^@.node.name", "^@.names"],
		    	"separator": "_"
			}},
		    "false": {
		      "&": "reduce",
		      "list": "^@.node.children",
		      "accum": null,
		      "t": {":": {
		        "&": "if",
		        "cond": {":": "^@.accum"},
		        "true": {":": "^@.accum"},
		        "false": {":": {
		          "&": "getnodefullnamebyid",
		          "node": "^@.item",
		          "names": {
		          	"&": "if",
		          	"cond": {":": ["&=", "^@.node.id", "root"]},
		          	"false": ["&&", "^@.node.name", "^@.names"]
	          	  }
		        }}
		      }}
		    }
	      }
	    },
	    "names": {
	    	"&": "coalesce",
	    	"list": ["^@.names", []]
	    }
	  },
	  "requires": ["getnodefullnamebyid", "join", "coalesce"]
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
	    "false": {":": {
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
	    }}
	  },
	  "requires": ["getmodelnodebyid"]
	},
	{
	  "name": "getpreviousmodelnodebyid_model_studio_emlynoregan_com",
	  "transform-t": 
	  {
	  	"!": {":": {
		  	"!": {":": {
		  		"&": "if",
		  		"cond": {":": "^@.parent"},
		  		"true": {":": 
		  			[
		  			  "^%",
		  		      {
			  			"&": "reduce",
			  			"list": "^@.parent.children",
			  			"accum": {
			  				"prev": null,
			  				"curr": null,
			  				"found": null
			  			},
			  			"t": {":": {
			  			  "prev": "^@.item",
			  			  "found": {
			  				"&": "coalesce",
			  				"list": [
			  					"^@.accum.found",
			  					{
			  						"&": "if",
			  						"cond": {":": ["&=", "^@.item.id", "^@.id"]},
			  						"true": {":": "^@.accum.prev"}
		  						}
		  					]
		  				  }
			  			}}
	  				  },
	  				  "found"
		  			]
		  		},
		  		"false": {
		  			"id": "^@.id",
		  			"this": "^@.this",
		  			"parent": "^@.parent"
		  		}
		  	}},
		  	"parent": {
		  		"&": "getmodelnodebyid",
		  		"id": "^@.this.parent"
		  	}
	  	}},
	  	"this": {
	  		"&": "getmodelnodebyid"
	  	}
	  },
	  "requires": ["getmodelnodebyid", "coalesce"]
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
	      	"&": "quicksort",
	      	"keypath": "order",
			"list": {
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
		                          "&": "coalesce",
		                          "list": [
									"^@.item.order",	                          
			                        {
			                        	"&": "max_model_studio_emlynoregan_com",
			                        	"list": ["^@.item.order", "^@.accum.order"]
		                        	}
	                        	  ]
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
	    }
	  },
	  "requires": [
	    "addmaps",
	    "map",
	    "removenulls",
	    "max_model_studio_emlynoregan_com",
	    "coalesce",
	    "quicksort"
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
	    	"list": ["^@.item.order", 1.0]
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
	    "order": {
	    	"&": "coalesce",
	    	"list": ["^@.item.order", 1.0]
	    }
	  }
	},
	{
	  "name": "copynode_model_studio_emlynoregan_com",
	  "args": {
	  	"from": "the item to copy"
	  },
	  "transform-t": 
	  {
	  	  "&": "addmaps",
	  	  "map1": {
		    "name": ["&+", "^@.from.name", "copy"],
		    "id": "^@.newid",
		    "type": "^@.from.type",
		    "published": false,
		    "order": [
		    	"&/", 
		    	[
		    		"&+", 
		    		{
		    			"&": "coalesce", 
		    			"list": [
		    				"^@.between.before", 
		    				"^@.between.after"
		    			]
		    		}, 
		    		"^@.between.after"
		    	], 
		    	2
		    ]
	  	  },
	  	  "map2": 
		  {
		  	"&": "switch",
		  	"value": "^@.from.type",
		  	"cases": [
		  		["decl", {
				    "source": "^@.from.source",
				    "transform": "^@.from.transform"
		  		}],
		  		{}
	  		]
  		  }
	  },
	  "requires": ["addmaps", "switch", "coalesce"]
	}
];
