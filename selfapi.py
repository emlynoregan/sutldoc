from apibase import APIBase
import json

class SelfApiHandler(APIBase):
    @classmethod
    def JsonSchemaRequired(cls):
        return False

    def ProcessAPICall(self, aQueryJson, aUser):
    	return 200, json.dumps({"name": aUser.nickname(), "email": aUser.email()})

    @classmethod
    def GetAPIPath(cls):
        return "/api/self"
        