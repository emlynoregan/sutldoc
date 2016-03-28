from google.appengine.ext import ndb
import logging

class Decl(ndb.Model):
	user_id = ndb.StringProperty()
	name = ndb.StringProperty()
	requires = ndb.StringProperty()
	published = ndb.BooleanProperty()
	parent = ndb.KeyProperty()
	source = ndb.TextProperty()
	transform = ndb.TextProperty()
	
	@classmethod
	def GetById(cls, aId, aUser):
		logging.debug("GetById: %s, %s" % (aId, aUser))
		retval = Decl.get_by_id(aId)
		logging.debug("retval: %s" % retval)
		retval = retval if retval and retval.user_id == aUser.user_id() else None
		logging.debug("retval: %s" % retval)
		return retval

	def to_json(self):
		return {
			"type": "decl",
			"id": self.key.id(),
			"name": self.name,
			"requires": self.requires,
			"published": self.published,
			"parent": self.parent.id() if self.parent and self.parent.id() != "__root__" else None,
			"source": self.source,
			"transform": self.transform
		}		
		
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
		ldecl.put()
		
	@classmethod
	def GetAllForParent(cls, aParentId, aUser):
		lparentId = aParentId if aParentId else "__root__"
		lchildren = Decl.query(Decl.parent == ndb.Key(Dist, lparentId))
		return [lchild for lchild in lchildren if lchild.user_id == aUser.user_id()]

class Dist(ndb.Model):
	user_id = ndb.StringProperty()
	name = ndb.StringProperty()
	published = ndb.BooleanProperty()
	parent = ndb.KeyProperty()

	@classmethod
	def GetById(cls, aId, aUser):
		retval = Dist.get_by_id(aId)
		retval = retval if retval and retval.user_id == aUser.user_id() else None
		return retval

	def to_json(self):
		return {
			"type": "dist",
			"id": self.key.id(),
			"name": self.name,
			"published": self.published,
			"parent": self.parent.id() if self.parent and self.parent.id() != "__root__" else None
		}		

	@classmethod
	def from_json(self, aJson, aUser):
		ldist = Dist.get_or_insert(aJson.get("id"))
		ldist.user_id = aUser.user_id()
		ldist.name = aJson.get("name")
		ldist.published = aJson.get("published")
		ldist.parent = ndb.Key(Dist, aJson.get("parent")) if aJson.get("parent") else ndb.Key(Dist, "__root__")
		ldist.put()

	@classmethod
	def GetAllForParent(cls, aParentId, aUser):
		logging.debug("Enter GetAllForParent")
		lparentId = aParentId if aParentId else "__root__"
		logging.debug("lparentId: %s" % lparentId)
		lchildren = Dist.query(Dist.parent == ndb.Key(Dist, lparentId))
		logging.debug("lchildren: %s" % lchildren)
		return [lchild for lchild in lchildren if lchild.user_id == aUser.user_id()]
		
	def DeleteChildren(self):
		ldistChildren = Dist.query(Dist.parent == self.key)
		for lchild in ldistChildren:
			lchild.DeleteChildren()
		ndb.delete_multi([lchild.key for lchild in ldistChildren])

		ldeclChildrenKeys = Decl.query(Dist.parent == self.key)
		ndb.delete_multi(list(ldeclChildrenKeys.iter(keys_only=True)))
