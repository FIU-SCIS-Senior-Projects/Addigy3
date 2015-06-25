
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
    try:
        result = db.browsingHistoryAudits.aggregate([
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
    dateRange={}
    dateRange['$lte'] = endDate
    dateRange['$gte'] = startDate
    matchClause['visits'] = dateRange
    return matchClause
