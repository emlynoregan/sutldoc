import webapp2
from htmlhandler import HtmlHandler

class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write('''
        <html>
        <head>
			<meta name="google-site-verification" content="DhdoNAtPo7oPymcpVrrMTHlYrvvtYgvmjw1cnR3cJ3U" />
		</head>
		<body>
	        <a href="/doc/sutldoc">sUTL doc</a>
	    </body>
	    </html>
        ''')

app = webapp2.WSGIApplication([
#     ('/doc/(.*)/', RedirectHandler),
    ('/doc/(.*)', HtmlHandler),
    ('/(studio)', HtmlHandler),
    ('/', HtmlHandler)
], debug=True)