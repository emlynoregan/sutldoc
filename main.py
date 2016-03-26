import webapp2
from htmlhandler import HtmlHandler
from selfapi import SelfApiHandler
from logoutapi import LogoutApiHandler

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

app = webapp2.WSGIApplication(_routes, debug=True)