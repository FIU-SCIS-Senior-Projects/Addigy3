
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