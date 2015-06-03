
import datetime
import calendar


def getHistory(db):
    table = db.loginAudits
    # date = datetime.datetime(2015, 5, 24, 9)
    # dateUnix = calendar.timegm(date.timetuple())
    # result = table.find(({'orgId': '5678' }), {'activity': {'$elemMatch': {'login': {'$gte': 1433170500}}},'_id': False})
    # try:
    #     result =table.aggregate([
    #         {"$match": {"orgId": "5678"}},
    #         {"$unwind": "$activity"},
    #         {"$match": {"activity.login": {'$gte': 1433215080}}},
    #         {"$group": {"_id": "$_id", "activity": {"$push": "$activity"}}}]) #"orgId": "$orgId", "connectorId": "$connectorId", "username": "$username",
    # except Exception as e:
    #     return []
    docList = []
    # for doc in result:
    #     docList.append(doc)
    return docList