import webapp2
from htmlhandler import HtmlHandler

class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write('<a href="/doc/sutldoc">sUTL doc</a>')

app = webapp2.WSGIApplication([
    ('/doc/(.*)', HtmlHandler),
    ('/', MainHandler)
], debug=True)