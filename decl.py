from google.appengine.ext import ndb
import logging
import json

class Decl(ndb.Model):
    user_id = ndb.StringProperty()
    name = ndb.StringProperty()
    requires = ndb.StringProperty()
    published = ndb.BooleanProperty()
    parent = ndb.KeyProperty()
    source = ndb.TextProperty()
    transform = ndb.TextProperty()
    order = ndb.FloatProperty()

    @classmethod
    def GetById(cls, aId, aUser = None):
        lid = aId if aId else "__root__"
        luserId = (aUser if isinstance(aUser, basestring) else aUser.user_id()) if aUser else None
        
        logging.debug("GetById: %s, %s" % (lid, aUser))
        retval = Decl.get_by_id(lid)
        logging.debug("retval: %s" % retval)
        retval = retval if retval and not (luserId and retval.user_id != luserId) else None
        logging.debug("retval: %s" % retval)
        return retval

    def GetFullName(self):
        lparent = self.parent.get() if self.parent else None
        logging.debug("Parent: %s" % lparent)
        lparentName = lparent.GetFullName() if lparent else None
        logging.debug("Parent Name: %s" % lparentName)
        retval = "%s_%s" % (self.name, lparentName) if lparentName else "%s" % self.name
        logging.debug("retval: %s" % retval)
        return retval

    def to_json(self):
        return {
        	"type": "decl",
        	"id": self.key.id(),
        	"name": self.name,
        	"fullname": self.GetFullName(),
        	"requires": self.requires,
        	"published": self.published,
        	"parent": self.parent.id() if self.parent and self.parent.id() != "__root__" else None,
        	"source": self.source,
        	"transform": self.transform,
        	"order": self.order,
        	"srcgen": "/srcgen/decl?id=%s&userid=%s" % (self.key.id(), self.user_id)
        }		

    def to_decljson(self):
        logging.debug("Enter to_decljson")
        try:
            lrequiresSplit = self.requires.split(" ") if self.requires else []
            lrequires = [lrequire for lrequire in lrequiresSplit if lrequire]
        except Exception, _:
            logging.exception("fail")
            lrequires = None
        
        try:
            ltransform = json.loads(unicode(self.transform))
        except Exception, _:
            logging.exception("fail")
            ltransform = None
        
        ldeclJson = {
        	"name": self.GetFullName(),
        	"language": "sUTL0"
        }
        
        #if ltransform:
        ldeclJson["transform-t"] = ltransform
        if lrequires:
            ldeclJson["requires"] = lrequires
        
        return ldeclJson

    def to_decljsonstr(self):
        logging.debug("Enter to_decljsonstr")
        try:
            lrequiresSplit = self.requires.split(" ") if self.requires else []
            lrequires = "[" + ", ".join(lrequiresSplit) + "]"
        except Exception, _:
            logging.exception("fail")
            lrequires = []
        
        ltransform = self.transform
        
        ldeclJsonStr = """
        {
            "name": "%s",
            "language": "sUTL0",
            "transform-t": %s,
            "requires": %s
        }
""" % (self.GetFullName(), ltransform, lrequires)
        
        return ldeclJsonStr

    @classmethod
    def from_json(self, aJson, aUser):
        ldecl = Decl.get_or_insert(aJson.get("id"))
        ldecl.user_id = aUser.user_id()
        ldecl.name = aJson.get("name")
        ldecl.requires = aJson.get("requires")
        ldecl.published = aJson.get("published")
        ldecl.parent = ndb.Key(Dist, aJson.get("parent")) if aJson.get("parent") else ndb.Key(Dist, "__root__")
        ldecl.source = aJson.get("source")
        ldecl.transform = aJson.get("transform")
        ldecl.order = aJson.get("order", 1.0)
        ldecl.put()
        
    @classmethod
    def GetAllForParent(cls, aParentId, aUser):
        lparentId = aParentId if aParentId else "__root__"
        lchildren = Decl.query(Decl.parent == ndb.Key(Dist, lparentId)).order(Decl.order)
        return [lchild for lchild in lchildren if lchild.user_id == aUser.user_id()]

    def GetLibDecls(self, aUser):
        lparent = self.parent.get() if self.parent else None
        if lparent:
            return lparent.GetLibDecls(aUser)
        else:
            return []
        
#     def _GetLibDecls(self, aStopKeyId):
#         retval = [
# 			self.to_decljson()
# 		] if self.published and self.key.id() != aStopKeyId else []
#         
#         return retval, self.key.id() == aStopKeyId

class Dist(ndb.Model):
    user_id = ndb.StringProperty()
    name = ndb.StringProperty()
    published = ndb.BooleanProperty()
    parent = ndb.KeyProperty()
    requires = ndb.StringProperty()
    order = ndb.FloatProperty()
    
    @classmethod
    def GetById(cls, aId, aUser):
        lid = aId if aId else "__root__"
        luserId = aUser if isinstance(aUser, basestring) else aUser.user_id()
        
        retval = Dist.get_by_id(lid)
        retval = retval if retval and retval.user_id == luserId else None
        return retval

    @classmethod
    def GetByIdForRead(cls, aId, aUser):
        lid = aId if aId else "__root__"
        luserId = aUser if isinstance(aUser, basestring) else aUser.user_id()
        
        retval = Dist.get_by_id(lid)
        retval = retval if retval and ((retval.user_id == luserId) or (retval.published)) else None
        return retval
    
    def GetFullName(self):
        lparent = self.parent.get() if self.parent else None
        lparentName = lparent.GetFullName() if lparent else None
        retval = "%s_%s" % (self.name, lparentName) if lparentName else self.name
        return retval

    def to_json(self):
        return {
            "type": "dist",
            "id": self.key.id(),
            "name": self.name,
            "fullname": self.GetFullName(),
            "published": self.published,
            "requires": self.requires,
            "parent": self.parent.id() if self.parent and self.parent.id() != "__root__" else None,
            "order": self.order
        }

    @classmethod
    def from_json(self, aJson, aUser):
        ldist = Dist.get_or_insert(aJson.get("id"))
        ldist.user_id = aUser.user_id()
        ldist.name = aJson.get("name")
        ldist.published = aJson.get("published")
        ldist.requires = aJson.get("requires")
        ldist.parent = ndb.Key(Dist, aJson.get("parent")) if aJson.get("parent") else ndb.Key(Dist, "__root__")
        ldist.order = aJson.get("order", 1.0)
        ldist.put()

    @classmethod
    def GetAllForParent(cls, aParentId, aUser):
        logging.debug("Enter GetAllForParent")
        lparentId = aParentId if aParentId else "__root__"
        logging.debug("lparentId: %s" % lparentId)
        lchildren = Dist.query(Dist.parent == ndb.Key(Dist, lparentId)).order(Dist.order)
        logging.debug("lchildren: %s" % lchildren)
        luserId = (aUser if isinstance(aUser, basestring) else aUser.user_id()) if aUser else None
        return [lchild for lchild in lchildren if lchild.user_id == luserId]

    def DeleteChildren(self):
        ldistChildren = Dist.query(Dist.parent == self.key)
        for lchild in ldistChildren:
            lchild.DeleteChildren()
        ndb.delete_multi([lchild.key for lchild in ldistChildren])
        
        ldeclChildrenKeys = Decl.query(Dist.parent == self.key)
        ndb.delete_multi(list(ldeclChildrenKeys.iter(keys_only=True)))

    def GetAllChildren(self):
        logging.debug("Enter GetAllDistChildren")
        lcdists = Dist.query(Dist.parent == self.key, Dist.user_id == self.user_id)
        lcdecls = Decl.query(Decl.parent == self.key, Decl.user_id == self.user_id)
        
        lchildren = list(lcdists)
        lchildren.extend(lcdecls)
        
        def getKey(child):
            return child.order
            
        lchildren = sorted(lchildren, key=getKey)
        
        logging.debug("lchildren: %s" % lchildren)
        return lchildren

#     def _GetLibDecls(self, aStopKeyId):
#         logging.info("Enter GetLibDecls (%s)" % (self.name))				
#         retval = []
#         
#         lfound = False
#         
#         lchildren = self.GetAllChildren()
#         
#         for lchild in lchildren:
#             lresults, lfound = lchild._GetLibDecls(aStopKeyId)
#             if lresults:
#                 retval.extend(lresults)
#             if lfound:
#                 break
#         
#         logging.info("Leave GetLibDecls (%s, %s)" % (len(retval), lfound))				
#         return retval, lfound
    
    def GetRequiresList(self):
        try:
            lrequiresSplit = self.requires.split(" ") if self.requires else []
            lrequires = [lrequire for lrequire in lrequiresSplit if lrequire]
        except Exception, _:
            logging.exception("fail")
            lrequires = None    
        return lrequires

    def GetAllRequires(self, aUserId):
        retval = []
        
        lparent = self.parent.get() if self.parent else None
        if lparent:
            retval = lparent.GetAllRequires(aUserId)

        lrequiresList = self.GetRequiresList()
        retval.extend(lrequiresList)

        return retval

    def GetLocalExpansion(self):
        retval = []
        lchildren = self.GetAllChildren()
        for lchild in lchildren:
            if lchild.published:
                if isinstance(lchild, Decl):
                    retval.append(lchild.to_decljson())
                else:
                    retval.extend(lchild.GetLocalExpansion())
        return retval
    
    def GetLibDecls(self, aUser):
        retval = []

        luserId = aUser if isinstance(aUser, basestring) else aUser.user_id()

        #1: Get combined requires list for all parent dists
        lallRequires = self.GetAllRequires(luserId)
        lallRequires.append(self.key.id())
        lallRequires = set(lallRequires)

        for ldeclKeyId in lallRequires:
            ldecl = Dist.GetByIdForRead(ldeclKeyId, aUser)
            
            if ldecl:
                llocalExpansion = ldecl.GetLocalExpansion()
                retval.extend(llocalExpansion)
        
#         lchildren = cls.GetAllForParent(None, luserId)
#         for lchild in lchildren:
#             lresults, lfound = lchild._GetLibDecls(aStopKeyId)
#             if lresults:
#                 retval.extend(lresults)
#             if lfound:
#                 break
                
        return retval
