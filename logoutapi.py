from apibase import APIBase
import json
from google.appengine.api import users


class LogoutApiHandler(APIBase):
    @classmethod
    def JsonSchemaRequired(cls):
        return False

    @classmethod
    def CanGet(cls):
        return True

    def ProcessAPICall(self, aQueryJson, aUser):
    	self.redirect(users.create_logout_url('/'))
    	return None, None

    @classmethod
    def GetAPIPath(cls):
        return "/logout"
        