from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
import ast
from pymongo import MongoClient
import managementconsole.collectors as collectors
import managementconsole.dbhandler as dbhandler

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def listTables(request):
    client = MongoClient()
    db = client.test
    tables=db.collection_names()
    jsonstr = json.dumps(str(tables), cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def getLoginHistory(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb
    jsonstr = json.dumps(dbhandler.getLoginHistory(db, request), cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def getMostVisistedDomains(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb
    jsonstr = json.dumps(dbhandler.getMostVisistedDomains(db, request), cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def getAllDomains(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb
    jsonstr = json.dumps(dbhandler.getAllDomains(db, request), cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def getDomainInfo(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb
    jsonstr = json.dumps(dbhandler.getDomainInfo(db, request), cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def getFacter(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb
    jsonstr = json.dumps(dbhandler.getFacter(db), cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def getMemory(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb
    jsonstr = json.dumps(dbhandler.getMemory(db, request), cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def getTenants(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb
    jsonstr = json.dumps(dbhandler.getTenants(db, request), cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def storeCollectedData(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb #get the database ("addigydb")
    str=request.body.decode('utf-8')
    data = json.loads(str)
    collectors.verifyCollectorId(db,data)
    collectors.storeLoginActivity(db,data)
    collectors.storeFacterReport(db,data)
    collectors.storeAvailableMemory(db,data)
    collectors.storeBrowsingHistory(db,data)
    collectors.storeSoftwareUpdates(db,data)
    jsonstr = json.dumps(str, cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def getUpdatesConnectorsCount(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb
    jsonstr = json.dumps(dbhandler.getUpdatesConnectorsCount(db, request), cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def getAvailableUpdates(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb
    str=request.body.decode('utf-8')
    data = ast.literal_eval(str)
    jsonstr = json.dumps(dbhandler.getAvailableUpdates(db, data), cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def dummyEndpoint(request,option):
    jsonstr = json.dumps("Hello World: "+option, cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def getVolatileFacts(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb
    jsonstr = json.dumps(dbhandler.getVolatileFacts(db, request), cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')


class ResponseEncoder(json.JSONEncoder):
    def default(self, obj):
        return obj.__dict__
