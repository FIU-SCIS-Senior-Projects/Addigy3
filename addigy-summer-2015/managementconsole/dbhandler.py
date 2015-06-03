
import datetime
import calendar


def getHistory(db):
    table = db.loginAudits
    date = datetime.datetime(2015, 5, 24, 9)
    dateUnix = calendar.timegm(date.timetuple())
    result = table.find(({'orgId': '5678' }), {'activity': {'$elemMatch': {'login': {'$gte': 1433170500}}},'_id': False})
    try:
        result = table.aggregate([
            {'$match': {'orgId': '5678'}},
            {'$unwind': '$activity'},
            {'$match': {'activity.login': {'$gte': 1433215080}}},
            {'$group': {'_id': '$_id', 'orgId': {'$first': '$orgId'}, 'username': {'$first': '$username'}, 'connectorId': {'$first': '$connectorId'}, 'activity': {'$push': '$activity'}}},
            {'$project': {'_id': 0, 'connectorId': '$connectorId', 'orgId': '$orgId', 'username': '$username', 'activity': 1}}])

    except Exception as e:
        return []
    docList = []
    for doc in result:
        docList.append(doc)
    history = {'loginHistory': docList}
    return history
