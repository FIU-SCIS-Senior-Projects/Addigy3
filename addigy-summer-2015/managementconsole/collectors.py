__author__ = 'ayme'

def storeLoginActivity(db,data):
    table = db.loginAudits
    loginData = data["loginHistory"]
    loginUpdates = getLoginUpdates(loginData)
    connectorId = data['connectorId']
    orgId = data['orgId']
    for elem in loginData:
        timeList = elem['activity']
        username = elem['username']
        cursor = table.find({'connectorId':connectorId, 'username':username})
        size = cursor.count()
        if(size==0):
            post_id = table.insert_one({'connectorId':connectorId, 'username':username, 'orgId':orgId, 'activity':timeList}).inserted_id
        else:
            addNewLoginData(table,username,connectorId, timeList)
        updatesLogins(table, username,connectorId, loginUpdates)


def updatesLogins(table,username,connectorId,loginUpdates):
    for key, value in loginUpdates.items():
        for elem in value:
            login=elem['login']
            logout=elem['logout']
            table.update({'connectorId': connectorId, 'username':username, "activity.login": login},{'$set': { 'activity.$.logout' : logout }})

def addNewLoginData(table,username,connectorId, timeList):
    table.update({'connectorId': connectorId, 'username':username},{'$push': {'activity': {'$each': timeList}}})

def getLoginUpdates(loginData):
    userUpdates = {}
    for elem in loginData:
        username = elem['username']
        timeList=elem['activity']
        updateArray = []
        for time in timeList:
            if(time["isUpdate"]):
                del time['isUpdate']
                updateArray.append(time)
                timeList.remove(time)
                if username in userUpdates:
                    userUpdates[username].append(timeList)
                else:
                    userUpdates[username]=updateArray
            else:
                del time['isUpdate']
    return userUpdates

