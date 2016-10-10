from decl import Decl, Dist
from htmlhandler import HtmlHandler
import json
import webapp2
import logging
import urlparse

class TryHandler(HtmlHandler):
    def GetDeclId(self):
        return self.request.get("id")

    def getData(self):
        ldeclId = self.GetDeclId()

        ldecl = Decl.GetById(ldeclId)
        llib = Dist.GetLibDecls(ldecl.user_id, ldecl.key.id())

        if ldecl:
            retval = {
        		"decl": json.dumps(ldecl.to_decljson()),
                "source": json.dumps(ldecl.to_json()["source"]),
                "lib": json.dumps(llib),
                "url": self.request.url
        	}
        else:
            retval = {
        	}

        return retval

    @classmethod
    def GetAPIPath(cls):
        return "/(try)"
    
class OEmbedHandler(webapp2.RequestHandler):
    def get(self, *args): 
        self.process(*args)
            
    def process(self, *args):
        lresponseMessage = None
        
        logging.debug("In Class: %s" % self.__class__.__name__)
                
        try:
            lurl = self.request.get("url")
            logging.info(lurl)
            
            lurlParsed = urlparse.urlparse(lurl)
            logging.info(lurlParsed)

            ldecl = None
            if lurlParsed.path == "/try":
                lquery = lurlParsed.query
                lqdict = urlparse.parse_qs(lquery)
                lid = lqdict.get("id")[0] if lqdict.get("id") else None
                logging.debug(lid)
                ldecl = Decl.GetById(lid)
                
            if ldecl:
                lresult = \
                    {
                        "version": "1.0",
                        "type": "html",
                        "width": 300,
                        "height": 300,
                        "title": ldecl.GetFullName(),
                        "html": """
<html>
<body>
<pre>
%s
</pre>
</body>
</html>
                        """ % ldecl.transform
                    }                    
                lresponseMessage = json.dumps(lresult, indent=4)
            else:
                self.response.status = 404
                lresponseMessage = "not found"

        except Exception, ex:
            logging.exception("Error in %s.post" % self.__class__.__name__)
            self.response.status = 500
            lresponseMessage = unicode(ex)

        logging.debug("Leaving SrcGenBase.process (%s): %s" % (self.response.status, lresponseMessage))
        if lresponseMessage:
            self.response.out.write(lresponseMessage)

    @classmethod
    def GetAPIPath(cls):
        return "/oembed.json"
    

