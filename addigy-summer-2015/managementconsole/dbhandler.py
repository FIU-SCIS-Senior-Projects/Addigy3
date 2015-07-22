
import datetime
import calendar
import json
import ast
import types
# ORG_ID = "c7ea34d4-00ba-11e5-a061-3d81414d18d9"
from bson import ObjectId

ORG_ID = "Addigy"
volatileFacts = ["memoryfree", "memoryfree_mb", "sp_uptime", "system_uptime", "uptime_seconds"]

def getLoginHistory(db, request):
    body = request.body
    dic = ast.literal_eval(body.decode('utf'))
    login = dic['login']
    logout = dic['logout']
    table = db.loginAudits
    try:
        result = table.aggregate([
            {'$match':{'orgId':ORG_ID, 'connectorID':'1111'}},
            {'$unwind': '$activity'},
            {'$match': {'activity.login': {'$lte': logout}, 'activity.logout': {'$gte': login}}},
            {'$group': {'_id': '$_id', 'orgId': {'$first': '$orgId'}, 'username': {'$first': '$username'}, 'connectorId': {'$first': '$connectorId'}, 'activity': {'$push': '$activity'}}},
            {'$project': {'_id': 0, 'connectorId': '$connectorId', 'orgId': '$orgId', 'username': '$username', 'activity': 1}}])

    except Exception as e:
        return []
    docList = []
    for doc in result:
        docList.append(doc)
    history = {'loginHistory': docList}
    return history

def getFacter(db):
    try:
        query = db.facterAudits.find_one( {}, {"_id":0} )
        return query
    except Exception as e:
        return []

def getMemory(db, request):
    body = request.body
    dic = ast.literal_eval(body.decode('utf'))
    orgId = dic['orgId']
    tenant = dic['tenant']
    dateSelected = datetime.datetime.strptime(dic['date'], "%Y-%m-%dT%H:%M:%S.%fZ")
    beginDate = dateSelected.replace(hour=0,minute=0,second=0)
    table = db.availableMemory
    try:
        query = table.aggregate([
                   { '$match': { 'orgId': orgId, 'connectorId': tenant } },
                   {'$match': {'date': {'$gte': beginDate}}},
                   { '$sort': { 'date': 1 } },
                   { '$project': {'_id': 0, 'availMemory': '$availMemory', 'date': '$date'}}
        ])
    except Exception as e:
        return []
    docList = []
    for doc in query:
        t = doc['date']
        doc['date'] = t.strftime("%Y-%m-%d %H:%M:%S")
        docList.append(doc)
    history = {'history': docList}
    return history

def getMostVisistedDomains(db, request):
    try:
        result = db.browsingHistoryAudits.aggregate([
            {'$match': {'orgId': ORG_ID}},
            {'$unwind': "$visits"},
            {'$group': {'_id': "$domain", 'orgId': {'$first': '$orgId'}, 'connectorId': {'$first': '$connectorId'}, 'username' : {'$addToSet': '$username'}, 'domain': {'$first': '$domain'}, 'visits': {'$push':"$visits"}, 'size': {'$sum':1}}},
            {'$sort': {'size': -1}}, {'$limit': 5},
            {'$project': {'_id': 0, 'orgId': 1, 'connectorId': 1, 'username': 1, 'domain': 1, 'visits': 1, 'size': 1}}]) ;
    except Exception as e:
        return []
    docList = []
    for doc in result:
        docList.append(doc)
    mostVisited = {'mostVisited': docList}
    return mostVisited

def getAllDomains(db, request):
    try:
        result = db.browsingHistoryAudits.aggregate([
            {'$match': {'orgId': ORG_ID}},
            {'$group': {'_id': "org_id", 'orgId': {'$first': '$orgId'}, 'connectorId': {'$first': '$connectorId'}, 'username' : {'$addToSet': '$username'}, 'domain': {'$addToSet': '$domain'}, 'visits': {'$first': "$visits"}}},
            {'$project': {'_id': 0, 'domain': 1, 'username': 1}}]);
    except Exception as e:
        return []
    docList = []
    for doc in result:
        docList.append(doc)
    allDomains = {'allDomains': docList}
    return allDomains

def getDomainInfo(db, request):
    body = request.body
    dic = ast.literal_eval(body.decode('utf'))
    matchClause = getMatchClause(dic)
    qtyToSelect = int(dic['qtyToSelect'])
    startDate = dic['startDate']
    endDate = dic['endDate']
    try:
        if qtyToSelect != 0:
            result = db.browsingHistoryAudits.aggregate([
                {'$match': matchClause},
                {'$unwind': "$visits"},
                {'$match': {'visits': {'$lte': endDate, '$gte': startDate}}},
                {'$group': {'_id': "$domain", 'orgId': {'$first': '$orgId'}, 'connectorId': {'$first': '$connectorId'}, 'username' : {'$addToSet': '$username'}, 'domain': {'$first': '$domain'}, 'visits': {'$push':"$visits"}, 'size': {'$sum':1}}},
                {'$sort': {'size': -1}}, {'$limit': qtyToSelect},
                {'$project': {'_id': 0, 'orgId': 1, 'connectorId': 1, 'username': 1, 'domain': 1, 'visits': 1, 'size': 1}}]) ;
        else:
            result = db.browsingHistoryAudits.aggregate([
                {'$match': matchClause},
                {'$unwind': "$visits"},
                {'$match': {'visits': {'$lte': endDate, '$gte': startDate}}},
                {'$group': {'_id': "$domain", 'orgId': {'$first': '$orgId'}, 'connectorId': {'$first': '$connectorId'}, 'username' : {'$addToSet': '$username'}, 'domain': {'$first': '$domain'}, 'visits': {'$push':"$visits"}, 'size': {'$sum':1}}},
                {'$sort': {'size': -1}},
                {'$project': {'_id': 0, 'orgId': 1, 'connectorId': 1, 'username': 1, 'domain': 1, 'visits': 1, 'size': 1}}]) ;
    except Exception as e:
            return []
    docList = []
    for doc in result:
        docList.append(doc)
    domainList = {'domainList': docList}
    return domainList

def getMatchClause(dic):
    matchClause={}
    domain = dic['domain']
    user = dic['user']
    startDate = dic['startDate']
    endDate = dic['endDate']
    type = dic['type']
    if domain != 'All':
        matchClause['domain'] = dic['domain']
    if user != 'All':
        matchClause['username'] = dic['user']
    if type != 'All':
        matchClause['type'] = dic['type']
    matchClause['orgId'] = ORG_ID
    dateRange={}
    dateRange['$lte'] = endDate
    dateRange['$gte'] = startDate
    matchClause['visits'] = dateRange
    return matchClause

def getUpdatesConnectorsCount(db, request):
    body = request.body
    # dic = ast.literal_eval(body.decode('utf'))
    # orgId = dic['orgId'];
    result = db.machineUpdates.aggregate([
        {'$match': {'orgId': ORG_ID}},
        {'$unwind': "$updates"},
        {'$group': {'_id': '$orgId', 'connectorId': {'$addToSet': '$connectorId'}, 'updates': {'$addToSet': "$updates"}}},
        {'$project': {'_id': 0, 'updates': 1, 'connectorId':1}}])
    docList = []
    for doc in result:
        docList.append(doc)
    if len(docList) == 0:
        return {}
    firstDoc = docList[0]
    connectorsCount = len(firstDoc['connectorId'])
    updatesCount = len(firstDoc['updates'])
    connUpdates = {'updatesCount': updatesCount, 'connectorsCount':connectorsCount}
    return connUpdates

def getAvailableUpdates(db, data):
    updatesMap={}
    orgId = data['orgId']
    machines=[]
    result = db.machineUpdates.find({'orgId': ORG_ID})
    for machine in result:
        connectorId = machine['connectorId']
        policyId = getMachinePolicy(db, connectorId)
        machineUpdates = machine['updates']
        for updateId in machineUpdates:
            if not updateId in updatesMap:
                updatesMap[updateId]=getUpdateName(db,updateId)
        currMachine = {'orgId': machine['orgId'], 'connectorId':connectorId, 'policyId': policyId, 'updates': machineUpdates}
        machines.append(currMachine)
    policies = getOrgPolicies(db,orgId)
    return {'machinesUpdates': machines, 'updates': updatesMap, 'policies': policies}

def getOrgPolicies(db,orgId):
    result = db.policies.find({'orgId': ORG_ID}, {'_id':0})
    docList = []
    for doc in result:
        docList.append(doc)
    return docList

def getMachinePolicy(db, connectorId):
    result = db.machinePolicies.find({'connectorId': connectorId})
    if result.count() == 0:
        return "none"
    else:
        doc = result[0]
        return doc['policyId']

def getUpdateName(db, updateId):
    result = db.updates.find({'updateId': updateId})
    if result.count() == 0:
        return "none"
    else:
        doc = result[0]
        return doc['updateName']

def getTenants(db, request):
    body = request.body
    dic = ast.literal_eval(body.decode('utf'))
    orgId = dic['orgId']
    table = db.tenants
    try:
        query = table.aggregate([
                   { '$match': { 'orgId': orgId } },
                   { '$sort': {'connectorId': 1}},
                   { '$project': {'_id': 0, 'connectorId': 1}}
        ])
    except Exception as e:
        return []
    docList = []
    for doc in query:
        docList.append(doc['connectorId'])
    tenants = {'Tenants': docList}
    return tenants

def getVolatileFacts(db, request):
    body = request.body
    dic = ast.literal_eval(body.decode('utf'))
    startDate = datetime.datetime.strptime(dic['startDate'], "%Y-%m-%dT%H:%M:%S.%fZ")
    endDate = datetime.datetime.strptime(dic['endDate'], "%Y-%m-%dT%H:%M:%S.%fZ")
    start_id = ObjectId.from_datetime(startDate)
    end_id = ObjectId.from_datetime(endDate)

    table = db.facterAudits
    try:
        query = table.aggregate([
                   { '$match': { 'orgId': ORG_ID } },
                   {'$match': {'_id': {'$lte': end_id, '$gte': start_id}} },
                   { '$sort': { '_id': 1 } },
                   { '$project': {'_id': 1, 'facterReport': 1, 'connectorId': 1}}
        ])
    except Exception as e:
        return []
    docList = []
    for doc in query:
        facter = doc['facterReport']
        timestamp = doc['_id'].generation_time.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        connectorId = doc['connectorId']
        obj = {'facter': facter, 'timestamp': timestamp, 'connectorId': connectorId};
        docList.append(obj)
    data = {'volatileData': docList}
    return data

def getNonvolatileTimeline(db, request):
    body = request.body
    dic = ast.literal_eval(body.decode('utf'))
    startDate = datetime.datetime.strptime(dic['startDate'], "%Y-%m-%dT%H:%M:%S.%fZ")
    endDate = datetime.datetime.strptime(dic['endDate'], "%Y-%m-%dT%H:%M:%S.%fZ")
    start_id = ObjectId.from_datetime(startDate)
    end_id = ObjectId.from_datetime(endDate)

    table = db.facterAudits
    try:
        query = table.aggregate([
                   { '$match': { 'orgId': 'Addigy' } },
                   {'$match': {'_id': {'$lte': end_id, '$gte': start_id}} },
                   { '$sort': { '_id': 1 } },
                   { '$project': {'_id': 1, 'facterReport': 1, 'orgId': 1, 'connectorId': 1}}
        ])
    except Exception as e:
        return []
    docList = []
    for doc in query:
        facter = doc['facterReport']
        timestamp = doc['_id'].generation_time.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        obj = {'facter': facter, 'timestamp': timestamp, 'orgId': doc['orgId'], 'connectorId': doc['connectorId']}
        docList.append(obj)
    data = {'timelineData': docList}
    return data
