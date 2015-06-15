
import datetime
import calendar
import json
import ast

def getLoginHistory(db, request):
    body = request.body
    dic = ast.literal_eval(body.decode('utf'))
    login = dic['login']
    logout = dic['logout']
    table = db.loginAudits
    try:
        result = table.aggregate([
            {'$match': {'orgId': 'addigy'}},
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

def getMostVisistedDomains(db, request):
    table = db.browsingHistoryAudits
    try:
        result = db.browsingHistoryAudits.aggregate([
            {'$unwind': "$visits"},
            {'$group': {'_id': "$domain", 'orgId': {'$first': '$orgId'}, 'connectorId': {'$first': '$connectorId'}, 'username' : {'$addToSet': '$username'}, 'domain': {'$first': '$domain'}, 'visits': {'$push':"$visits"}, 'size': {'$sum':1}}},
            {'$sort': {'size': -1}}, {'$limit': 10},
            {'$project': {'_id': 0, 'orgId': 1, 'connectorId': 1, 'username': 1, 'domain': 1, 'visits': 1, 'size': 1}}]) ;
    except Exception as e:
        return []
    docList = []
    for doc in result:
        docList.append(doc)
    mostVisited = {'mostVisited': docList}
    return mostVisited

def getAllDomains(db, request):
    table = db.browsingHistoryAudits
    try:
        result = db.browsingHistoryAudits.aggregate([
            {'$match': {'orgId': 'addigy'}},
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
    domain = dic['domain']
    try:
        result = db.browsingHistoryAudits.find({'domain': domain}, {'_id':0});
    except Exception as e:
        return []
    docList = []
    for doc in result:
        docList.append(doc)
    domainList = {'domainList': docList}
    return domainList