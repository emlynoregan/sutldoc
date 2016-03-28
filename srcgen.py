import json
from decl import Decl, Dist
from google.appengine.ext import ndb
import webapp2
from google.appengine.api import users
import logging

class SrcGenBase(webapp2.RequestHandler):
	def RequiredUser(self):
		return None

	def ProcessSrcGen(self, aUser):
		raise Exception("ProcessSrcGen Not Overridden")

	def get(self, *args): 
		self.process(*args)
            
	def process(self, *args):
		lresponseMessage = None
        
		logging.debug("In Class: %s" % self.__class__.__name__)
        
		try:
			lgoogleUser = users.get_current_user()
            
			lrequiredUserId = self.RequiredUser()
            
			if not lgoogleUser and lrequiredUserId:
				self.response.status = 401
				lresponseMessage = "User required"
			elif lrequiredUserId and (lgoogleUser.user_id() != lrequiredUserId):
				self.response.status = 304
				lresponseMessage = "User not authorised (%s,%s)" % (lgoogleUser.user_id(), lrequiredUserId)
			else:
				logging.debug("User: %s" % lgoogleUser)
				lresponseMessage = self.ProcessSrcGen(lgoogleUser)
                
		except Exception, ex:
			logging.exception("Error in %s.post" % self.__class__.__name__)
			self.response.status = 500
			lresponseMessage = unicode(ex)

		logging.debug("Leaving SrcGenBase.process (%s): %s" % (self.response.status, lresponseMessage))
		if lresponseMessage:
			self.response.out.write(lresponseMessage)

	@classmethod
	def GetAPIPath(cls):
		raise Exception("Not Implemented")
        
        
class SrcGenDecl(SrcGenBase):
	def GetDeclId(self):
		return self.request.get("id")

	def GetUserId(self):
		return self.request.get("userid")
		
	def GetDecl(self):
		lid = self.GetDeclId()
		luserId = self.GetUserId()
		ldecl = Decl.GetById(lid, luserId)
		return ldecl
		
	def RequiredUser(self):
		ldecl = self.GetDecl()
		return ldecl.user_id if ldecl and not ldecl.published else None

	def ProcessSrcGen(self, aUser):
		ldecl = self.GetDecl()
		if not ldecl:
			self.response.status = 404
			return "Decl not found"
		else:
			self.response.headers['Content-Type'] = 'application/json'
			return json.dumps(ldecl.to_decljson(), indent=4, sort_keys=True)

	@classmethod
	def GetAPIPath(cls):
		return "/srcgen/decl"
