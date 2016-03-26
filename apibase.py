import webapp2
from google.appengine.api import users

import logging

from loader import loadJsonSchema

import json
import jsonschema
    
class APIBase(webapp2.RequestHandler):
    @classmethod
    def GetJsonSchema(cls):
        lschema = loadJsonSchema(cls.__name__, "handlers")
        if lschema is None and cls.JsonSchemaRequired():
            raise Exception("No schema found for API %s" % cls.__name__)
        return lschema

    @classmethod
    def JsonSchemaRequired(cls):
        return True

    @classmethod
    def UserRequired(cls, aQuery):
        return True

    def ProcessAPICall(self, aQueryJson, aUser):
        raise Exception("ProcessAPICall Not Overridden")

    @classmethod
    def CanPost(cls):
        return True
    
    @classmethod
    def CanGet(cls):
        return False
    
    def post(self, *args): 
        if self.CanPost():
            self.process(*args)
        else:
            self.response.status = 405
            self.response.out.write("POST not allowed")
            
    def get(self, *args): 
        if self.CanGet():
            self.process(*args)
        else:
            self.response.status = 405
            self.response.out.write("GET not allowed")
            
    def process(self, *args):
        lresponseMessage = None
        
        logging.debug("In Class: %s" % self.__class__.__name__)
        
        logging.debug("body: %s" % self.request.body)

        try:
            try:
                lquery = json.loads(self.request.body) if self.request.body else {}
            except ValueError, _:
                lquery = {"body": self.request.body}
            
            if not lquery:
                if self.request.method == "GET":
                    logging.debug("THIS IS GET")
                    lquery = dict(self.request.GET.items())
                elif self.request.method == "POST":
                    logging.debug("THIS IS POST")
                    lquery = dict(self.request.POST.items())

            logging.debug("query: %s" % json.dumps(lquery))

            ljsonSchema = self.GetJsonSchema()
            if ljsonSchema:
                jsonschema.validate(lquery, ljsonSchema)

            lgoogleUser = users.get_current_user()
            
            if not lgoogleUser and self.UserRequired():
                self.response.status = 401
                lresponseMessage = "User required"
            else:
                logging.debug("User: %s" % lgoogleUser)
                lstatus, lresponseMessage = self.ProcessAPICall(lquery, lgoogleUser)
                
                if lstatus:
                    self.response.status = lstatus
                else:
                    return # everything already done in self.ProcessAPICall
                
        except jsonschema.ValidationError, vex:
            logging.exception("validation error")
            self.response.status = 400
            lresponseMessage = str(vex)
        except Exception, ex:
            logging.exception("Error in %s.post" % self.__class__.__name__)
            self.response.status = 500
            lresponseMessage = unicode(ex)

        logging.debug("Leaving APIHandler (%s): %s" % (self.response.status, lresponseMessage))
        lresponseMessage = "%s\n" % lresponseMessage if lresponseMessage else ""
        self.response.out.write(lresponseMessage)

    @classmethod
    def GetAPIPath(cls):
        raise Exception("Not Implemented")
        