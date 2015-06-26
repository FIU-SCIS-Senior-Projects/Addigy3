
import datetime
import calendar
import json
import ast

def getHistory(db, request):
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

def getMemory(db, request):
    body = request.body
    dic = ast.literal_eval(body.decode('utf'))
    dateSelected = datetime.datetime.strptime(dic['date'], "%Y-%m-%dT%H:%M:%S.%fZ")
    beginDate = dateSelected.replace(hour=0,minute=0,second=0)
    endDate = beginDate + datetime.timedelta(1)
    table = db.availableMemory
    try:
        query = table.aggregate([
                   { '$match': { 'orgId': 'addigy', 'connectorId': '9876' } },
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