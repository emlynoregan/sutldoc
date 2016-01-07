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
	  "name": "addidtodatum_data_studio_emlynoregan_com",
	  "transform-t": {
	  	"&": "addmaps",
	  	"map1": "^@",
	  	"map2": {
	  	  "id": {
	  	  	"&": "join",
	  	  	"list": {
	  	  	  "&": "removenulls",
	  	  	  "list": [
	  	  	    "^@.name",
	  	  	    "^@.parent"
	  	  	  ]
	  	  	},
	  	  	"separator": "_"
	  	  }
	  	}
	  },
	  "requires": ["addmaps", "join", "removenulls"]
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
	    "parent": "^@.data.parent"
	  },
	  "requires": ["coalesce"]
	}
];
