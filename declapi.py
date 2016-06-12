from apibase import APIBase
import json
from decl import Decl, Dist
from google.appengine.ext import ndb

class GetDistById(APIBase):
	@classmethod
	def JsonSchemaRequired(cls):
		return False

	def ProcessAPICall(self, aQueryJson, aUser):
		lkeyId = aQueryJson.get("id")
		lresult = Dist.GetById(lkeyId, aUser)

		if lresult:
			return 200, json.dumps(lresult.to_json())
		else:
			return 404, "Dist not found"

	@classmethod
	def GetAPIPath(cls):
		return "/api/getdist"

class SetDistById(APIBase):

	@classmethod
	def JsonSchemaRequired(cls):
		return False

	def ProcessAPICall(self, aQueryJson, aUser):
		Dist.from_json(aQueryJson, aUser)
    
		return 200, "ok"

	@classmethod
	def GetAPIPath(cls):
		return "/api/setdist"

class DelDistById(APIBase):

	@classmethod
	def JsonSchemaRequired(cls):
		return False

	def ProcessAPICall(self, aQueryJson, aUser):
		lkeyId = aQueryJson.get("id")
		lresult = Dist.GetById(lkeyId, aUser)
		if lresult:
			lresult.DeleteChildren()
			lresult.key.delete()
			return 200, "ok"
		else:
			return 404, "dist not found"

	@classmethod
	def GetAPIPath(cls):
		return "/api/deldist"
        
class GetAllDistsForParent(APIBase):

	@classmethod
	def JsonSchemaRequired(cls):
		return False
		
	def ProcessAPICall(self, aQueryJson, aUser):
		lkeyId = aQueryJson.get("id")
		if lkeyId:
			lresult = Dist.GetById(lkeyId, aUser)

		if not (lkeyId and not lresult):
			lchildren = Dist.GetAllForParent(lkeyId, aUser)    	
	    
			return 200, json.dumps({"children": [lchild.to_json() for lchild in lchildren]})
		else:
			return 404, "dist not found"

	@classmethod
	def GetAPIPath(cls):
		return "/api/getchilddists"

class GetDeclById(APIBase):

	@classmethod
	def JsonSchemaRequired(cls):
		return False

	def ProcessAPICall(self, aQueryJson, aUser):
		lkeyId = aQueryJson.get("id")
		lresult = Decl.GetById(lkeyId, aUser)
    
		if lresult:
			return 200, json.dumps(lresult.to_json())
		else:
			return 404, "Decl not found"

	@classmethod
	def GetAPIPath(cls):
		return "/api/getdecl"

class SetDeclById(APIBase):

	@classmethod
	def JsonSchemaRequired(cls):
		return False

	def ProcessAPICall(self, aQueryJson, aUser):
		Decl.from_json(aQueryJson, aUser)
    
		return 200, json.dumps({"ok": True})

	@classmethod
	def GetAPIPath(cls):
		return "/api/setdecl"

class DelDeclById(APIBase):

	@classmethod
	def JsonSchemaRequired(cls):
		return False

	def ProcessAPICall(self, aQueryJson, aUser):
		lkeyId = aQueryJson.get("id")
		lresult = Decl.GetById(lkeyId, aUser)
		if lresult:
			lresult.key.delete()
			return 200, "ok"
		else:
			return 404, "Decl not found"

	@classmethod
	def GetAPIPath(cls):
		return "/api/deldecl"

class GetAllDeclsForParent(APIBase):

	@classmethod
	def JsonSchemaRequired(cls):
		return False

	def ProcessAPICall(self, aQueryJson, aUser):
		lkeyId = aQueryJson.get("id")
		if lkeyId:
			lresult = Dist.GetById(lkeyId, aUser)

		if not (lkeyId and not lresult):
			lchildren = Decl.GetAllForParent(lkeyId, aUser)    	
	    
			return 200, json.dumps({"children": [lchild.to_json() for lchild in lchildren]})
		else:
			return 404, "Decl not found"

	@classmethod
	def GetAPIPath(cls):
		return "/api/getchilddecls"

class GetLibDecls(APIBase):

	@classmethod
	def JsonSchemaRequired(cls):
		return False

	def ProcessAPICall(self, aQueryJson, aUser):
		lkeyId = aQueryJson.get("id")
		
		if lkeyId:
			retval = []

			lchildren = Dist.GetAllForParent(None, aUser)
			for lchild in lchildren:
				lresults, lfound = lchild.GetLibDecls(lkeyId)
				if lresults:
					retval.extend(lresults)
				if lfound:
					break

			return 200, json.dumps(retval)
		else:
			return 400, "id required"

	@classmethod
	def GetAPIPath(cls):
		return "/api/getlibdecls"
