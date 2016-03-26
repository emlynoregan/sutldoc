import os
import json
# import urllib2
import logging
import jsonschema

_loadedfiles = {}
def loadFile(aFolderName, aFileName):
    retval = None
    if aFolderName and aFileName:
        lcombinedName = "%s/%s" % (aFolderName, aFileName)
        if not lcombinedName in _loadedfiles:
            lbasePath = os.path.join(os.path.dirname(__file__), aFolderName)
            lfilePath = os.path.join(lbasePath, aFileName)
            lfileContent = None
            try:
                f = open(lfilePath)
                lfileContent = f.read()
            except IOError, _:
                pass
            _loadedfiles[lcombinedName] = lfileContent
        retval = _loadedfiles[lcombinedName]
    return retval

def loadJsonSchema(aSchemaName, aSubFolder = None):
    lfolder = "schema/%s" % aSubFolder if aSubFolder else "schema"
    lfilename = "%s.jsonschema" % aSchemaName
    
    retval = loadFile(lfolder, lfilename)
    if retval:
        logging.debug(retval)
        ljson = json.loads(retval)
        
        def loadJsonIncludes(aJson):
            retval = None
            
            if isinstance(aJson, dict):
                if len(aJson.keys()) == 1 and "_include_" in aJson:
                    retval = loadJsonSchema(aJson["_include_"], "include")
                else:
                    retval = {lkey: loadJsonIncludes(lvalue) for lkey, lvalue in aJson.iteritems()}
            elif isinstance(aJson, list):
                retval = [loadJsonIncludes(lvalue) for lvalue in aJson]
            else:
                retval = aJson
            
            return retval
    
        ljson = loadJsonIncludes(ljson)
        
        return ljson
    else:
        return None

def validateByName(aObject, aSchemaName):
    lschema = loadJsonSchema(aSchemaName)
    jsonschema.validate(aObject, lschema)

def loadsUTLDeclaration(aDeclarationName):
    retval = loadFile("transform", "%s.decl.json" % aDeclarationName)
    jsonretval = json.loads(retval)
    return jsonretval

