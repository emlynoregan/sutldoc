import os
import jinja2
import webapp2

jinja_environment = jinja2.Environment(
    autoescape=True,
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'html')),
    extensions=['jinja2.ext.do']
    )

class HtmlHandler(webapp2.RequestHandler):
	def get(self, aName):
		ltemplate = self.getTemplate(aName)
		self.response.out.write(ltemplate.render({}))

	def getTemplate(self, aName):
		return jinja_environment.get_template("%s.html" % aName)