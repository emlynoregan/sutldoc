import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'jsonschema'))

import webapp2
from htmlhandler import HtmlHandler
from selfapi import SelfApiHandler
from logoutapi import LogoutApiHandler
from declapi import GetDeclById, SetDeclById, GetDistById, SetDistById, GetAllDeclsForParent, GetAllDistsForParent, DelDeclById, DelDistById

class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write('''
        <html>
		<body>
	        <a href="/doc/sutldoc">sUTL doc</a>
	    </body>
	    </html>
        ''')

_routes = [
    ('/(studio)', HtmlHandler),
    ('/', HtmlHandler)
]

def AddRoute(aApiHandler):
	_routes.append((aApiHandler.GetAPIPath(), aApiHandler))
	
AddRoute(SelfApiHandler)
AddRoute(LogoutApiHandler)	
AddRoute(GetDeclById) 
AddRoute(SetDeclById) 
AddRoute(DelDeclById) 
AddRoute(GetDistById) 
AddRoute(SetDistById) 
AddRoute(DelDistById) 
AddRoute(GetAllDeclsForParent) 
AddRoute(GetAllDistsForParent)

app = webapp2.WSGIApplication(_routes, debug=True)

    