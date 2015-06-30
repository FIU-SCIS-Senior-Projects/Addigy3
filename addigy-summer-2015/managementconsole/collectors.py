__author__ = 'ayme'

def storeLoginActivity(db,data):
    table = db.loginAudits
    loginData = data["loginHistory"]
    if loginData is not None:
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
                    userUpdates[username] = updateArray
            else:
                del time['isUpdate']
    return userUpdates

def storeBrowsingHistory(db,data):
    table = db.browsingHistoryAudits
    browisngData = data['browsingHistory']
    if browisngData is not None:
        connectorId = data['connectorId']
        orgId = data['orgId']
        for elem in browisngData:
            username=elem['username']
            domains = elem['domains']
            for domain in domains:
                domainName = domain['domainName']
                visitedDates = domain['visitDates']
                type = domain = domain['domainType']
                cursor = table.find({'connectorId': connectorId, 'username': username, 'domain':domainName})
                size = cursor.count()
                if(size==0):
                    post_id = table.insert_one({'orgId': orgId, 'connectorId': connectorId, 'username': username,
                                                'domain': domainName, 'visits': visitedDates, 'type': type}).inserted_id
                else:
                    addNewDomainVisists(table, username, connectorId, domainName, visitedDates)

def addNewDomainVisists(table,username,connectorId, domain, visitedDates):
    table.update({'connectorId': connectorId, 'username': username, 'domain':domain}, {'$push': {'visits': {'$each': visitedDates}}})

def storeFacterReport(db, data):
    table = db.facterAudits
    facterReport = data["facterReport"]
    connectorId = data['connectorId']
    orgId = data['orgId']
    sp_serial_number = facterReport["sp_serial_number"]
    postid = table.insert_one({'connectorId':connectorId, 'orgId':orgId, 'sp_serial_number':sp_serial_number, 'facterReport':facterReport}).inserted_id

def storeSoftwareUpdates(db,data):
    table = db.updatesAudits
    softwareUpdates = data['softwareUpdates']
    if softwareUpdates is not None:
        connectorId = data['connectorId']
        orgId = data['orgId']
        policy = 'policy1'
        table.remove({{'orgId': orgId, 'connectorId': connectorId}});
        table.insert({'orgId': orgId, 'connectorId': connectorId, 'policy': policy, 'updates': softwareUpdates})

