var gdataDist = 
[
	{
	  "name": "combinelists_data_studio_emlynoregan_com",
	  "transform-t": 
	  {
	    "&": "removenulls",
  	  "list": [
  	    "&&",
  	    "^@.lists"
  	  ]
	  },
	  "requires": ["removenulls"]
	},
	{
	  "name": "addidstodata_data_studio_emlynoregan_com",
	  "language": "sUTL0",
	  "args": {
	  	"dict": "the dictionary to transform"
	  },
	  "transform-t": 
	  {
  	    "&": "makemap",
  	    "value": {
  	      "&": "map_core",
  	      "list": {"&": "keys", "map": "^@.dict"},
  	      "t": {":": [
  	        "^@.item",
  	        {
  	          "&": "addmaps",
  	          "map1": ["^%", "^@.dict", "^@.item"],
  	          "map2": {"id": "^@.item"}
  	        }
  	      ]}
  	    }
	  },
	  "requires": [
	    "map_core", "addmaps"
	  ]
	},
	{
	  "name": "distmodeltodata_data_studio_emlynoregan_com",
	  "transform-t": {
	    "name": {
	      "&": "coalesce",
	      "list": ["^@.model.name", "^@.data.name"]
	    },
	    "published": {
	      "&": "coalesce",
	      "list": ["^@.model.published", "^@.data.published"]
	    },
	    "parent": {
	    	"!": {":": {
		    	"&": "if",
		    	"cond": {":": ["&=", "^@.pval", "root"]},
		    	"true": null,
		    	"false": "^@.pval"
	    	}},
		    "pval": {
		      "&": "coalesce",
		      "list": ["^@.model.parent", "^@.data.parent"]
		    }
	    },
	    "id": {
	      "&": "coalesce",
	      "list": ["^@.model.id", "^@.data.id"]
	    },
	    "order": {
	      "&": "coalesce",
	      "list": ["^@.model.order", "^@.data.order"]
	    }
	  },
	  "requires": ["coalesce"]
	},
	{
	  "name": "declmodeltodata_data_studio_emlynoregan_com",
	  "transform-t": {
	    "name": {
	      "&": "coalesce",
	      "list": ["^@.model.name", "^@.data.name"]
	    },
	    "requires": {
	      "&": "coalesce",
	      "list": ["^@.model.requires", "^@.data.requires"]
	    },
	    "published": {
	      "&": "coalesce",
	      "list": ["^@.model.published", "^@.data.published"]
	    },
	    "parent": {
	      "&": "coalesce",
	      "list": ["^@.model.parent", "^@.data.parent"]
	    },
	    "source": {
	      "&": "coalesce",
	      "list": ["^@.model.source", "^@.data.source"]
	    },
	    "transform": {
	      "&": "coalesce",
	      "list": ["^@.model.transform", "^@.data.transform"]
	    },
	    "id": {
	      "&": "coalesce",
	      "list": ["^@.model.id", "^@.data.id"]
	    },
	    "order": {
	      "&": "coalesce",
	      "list": ["^@.model.order", "^@.data.order"]
	    }
	  },
	  "requires": ["coalesce"]
	},
  {
    "name": "getalldatanodesforparent_data_studio_emlynoregan_com",
    "language": "sUTL0",
    "args": {
      "dict": "the dictionary of datanodes by id",
      "parent": "id of the parent to use, or null for root",
      "item-t": "transform to apply to all result dists"
    },
    "transform-t": 
    {
        "&": "map_core",
        "list":
        {
          "&": "filter",
          "list": 
          {
            "&": "values",
            "map": {
              "&": "addidstodata"
            }
          },
          "filter-t": {":": {
            "&": "if",
            "cond": {":": "^@.parent"},
            "true": {":": 
              [
                "&=",
                "^@.item.parent",
                "^@.parent"
              ]
            },
            "false": {":": [
              "&!",
              "^@.item.parent"
            ]}
          }}
        },
        "t": {":": {
          "&": "if",
          "cond": {":": "^@.item-t"},
          "true": {":": {"!": {"!": "^@.item-t"}}},
          "false": {":": "Internal error: item-t not provided"}
        }}
    },
    "requires": [
      "map_core", "addmaps", "filter", "addidstodata"
    ]
  }
];
