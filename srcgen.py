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

# 	def GetUserId(self):
# 		return self.request.get("userid")
		
	def GetDecl(self):
		lid = self.GetDeclId()
		#luserId = self.GetUserId()
		ldecl = Decl.GetById(lid)
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

class SrcGenDist(SrcGenBase):
    def GetDistId(self):
        return self.request.get("id")

    def GetPublishedOnly(self):
        return self.request.get("publishedonly")

    def GetDist(self):
        lid = self.GetDistId()
        #luserId = self.GetUserId()
        ldist = Dist.GetById(lid)
        return ldist
        
    def RequiredUser(self):
        ldist = self.GetDist()
        return ldist.user_id if ldist and not ldist.published else None
    
    def ProcessSrcGen(self, aUser):
        ldist = self.GetDist()
        if not ldist:
            self.response.status = 404
            return "Dist not found"
        else:
            self.response.headers['Content-Type'] = 'application/json'
            luserId = (aUser if isinstance(aUser, basestring) else aUser.user_id()) if aUser else None
            ldecls = ldist.GetAllDeclsForAncestorTransitive(aUser, self.GetPublishedOnly() or not luserId or (ldist.user_id != luserId))        
            ldeclsSource = [ldecl.to_decljson() for ldecl in ldecls]
            return json.dumps(ldeclsSource, indent=2)

    @classmethod
    def GetAPIPath(cls):
        return "/srcgen/dist"
    
class SrcGenDistLib(SrcGenBase):
    def GetDistId(self):
        return self.request.get("id")

    def GetLibOnly(self):
        return self.request.get("libonly")

    def GetDist(self):
        lid = self.GetDistId()
        #luserId = self.GetUserId()
        ldist = Dist.GetById(lid)
        return ldist
        
    def RequiredUser(self):
        ldist = self.GetDist()
        return ldist.user_id if ldist and not ldist.published else None
    
    def ProcessSrcGen(self, aUser):
        ldist = self.GetDist()
        if not ldist:
            self.response.status = 404
            return "Dist not found"
        else:
            self.response.headers['Content-Type'] = 'application/json'
            
            llibdecls = ldist.GetLibDecls(aUser, self.GetLibOnly())
            #ldeclsSource = [ldecl.to_decljson() for ldecl in llibdecls]
            return json.dumps(llibdecls, indent=2)

    @classmethod
    def GetAPIPath(cls):
        return "/srcgen/distlib"
