from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
import ast
import datetime
from pymongo import MongoClient
import managementconsole.collectors as collectors
import calendar


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
def getHistory(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb
    table = db.audits
    date = datetime.datetime(2015, 5, 24, 9)
    dateUnix = calendar.timegm(date.timetuple())
    # result = table.find_one({},{"loginHistory":True})
    result = table.find_one({"loginHistory.activity.start":{"$gt": dateUnix}},{"loginHistory":True})
    if(result):
        del result['_id']
    else:
        result = {}
    jsonstr = json.dumps(result, cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def storeCollectedData(request):
    client = MongoClient()
    valid = client.addigydb.authenticate(settings.MONGO_USER, settings.MONGO_PASSWORD, mechanism='SCRAM-SHA-1')
    db = client.addigydb #get the database ("addigydb")
    table = db.audits #get the collection("audits")
    str=request.body.decode('utf-8')
    data = ast.literal_eval(str)
    # collectors.storeLoginActivity(table,data["loginHistory"])
    collectors.storeActivity(table,data)
    jsonstr = json.dumps(str, cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')

@csrf_exempt
def dummyEndpoint(request,option):
    jsonstr = json.dumps("Hello World: "+option, cls=ResponseEncoder)
    return HttpResponse(jsonstr, content_type='application/json')


class ResponseEncoder(json.JSONEncoder):
    def default(self, obj):
        return obj.__dict__