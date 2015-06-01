__author__ = 'ayme'

def storeActivity(table,data):
    loginUpdates = getLoginUpdates(table,data["loginHistory"])
    cursor = table.find({ 'connectorId':'1234'})
    size = cursor.count()
    if(size==0):
        post_id = table.insert_one(data).inserted_id
    else:
        addNewLoginData(cursor,data['loginHistory'])

def addNewLoginData(cursor,loginData):
    dataToAdd = []
    for elem in loginData:
        username=elem['username']
        timeList=elem['activity']
        for time in timeList:
            del time['update']
            dataToAdd.append(time)
    cursor.update({'connectorId': '1234', "loginHistory":{'$elemMatch':{'username':'ayme'}}}, {'$push': {'login': {'$each': dataToAdd}}})


def getLoginUpdates(table, loginData):
    updateArray = []
    for elem in loginData:
        username=elem['username']
        timeList=elem['activity']
        for time in timeList:
            if(time["update"]):
                del time['update']
                updateArray.append(time)
                timeList.remove(time)
    return updateArray

