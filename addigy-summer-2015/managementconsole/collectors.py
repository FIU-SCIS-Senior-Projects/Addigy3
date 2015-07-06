__author__ = 'ayme'
import uuid

from datetime import datetime

def storeLoginActivity(db,data):
    table = db.loginAudits
    if 'loginHistory' in data:
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
                    userUpdates[username] = updateArray
            else:
                del time['isUpdate']
    return userUpdates

def storeBrowsingHistory(db,data):
    table = db.browsingHistoryAudits
    if 'browsingHistory' in data:
        browisngData = data['browsingHistory']
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
    postid = table.insert_one({'connectorId':connectorId, 'orgId':orgId, 'facterReport':facterReport}).inserted_id

def storeAvailableMemory(db, data):
    table = db.availableMemory

    try:
        facterReport = data["facterReport"]
        for elem in facterReport:
            mem = elem['memoryfree_mb']
        connectorId = data['connectorId']
        orgId = data['orgId']
        postid = table.insert_one({'connectorId':connectorId, 'orgId':orgId, 'availMemory':mem, 'date': datetime.now()}).inserted_id
    except Exception:
        print(Exception)

def verifyCollectorId(db,data):
    table = db.tenants
    org = data['orgId']
    tenant = data['connectorId']
    containsId = False
    collectionExists = True

    try:
        result = table.aggregate([
                {'$match': {'orgId': 'addigy'}}]);
    except Exception as e:
        #Check if error is collection DNE or if zero query results
        collections = db.collection_names()
        dbexists = False
        for name in collections:
            if name == 'tenants':
                dbexists = True
        if not dbexists:
            collectionExists = False

    if collectionExists:
        # Check 'tenant' collection for existing org record
        try:
            for doc in result:
                if doc['connectorId'] == tenant:
                    containsId = True
        except Exception as e:
            pass # do nothing
    else:
        # create 'tenant' collection
        db.create_collection('tenant')

    # Insert tenant into collection if it does not already exist
    if not containsId:
        post_id = table.insert_one({'orgId': org, 'connectorId': tenant})

    return

def storeSoftwareUpdates(db,data):
    if 'softwareUpdates' in data:
        table = db.machineUpdates
        softwareUpdates = data['softwareUpdates']
        connectorId = data['connectorId']
        orgId = data['orgId']
        updatesIds=[]
        for update in softwareUpdates:
            updatesIds.append(getUpdateId(db, update))
        result = table.find({'orgId':orgId, 'connectorId': connectorId})
        if result.count() == 0:
            table.insert({'orgId':orgId, 'connectorId': connectorId, 'updates':updatesIds})
        else:
            table.update({'orgId':orgId, 'connectorId': connectorId}, {'$set': {'updates':updatesIds}})

def getUpdateId(db, update):
    table = db.updates
    result = table.find({'updateName': update})
    size = result.count()
    updateId = 0
    if size == 0:
        updateId = uuid.uuid1().hex
        table.insert_one({'updateId': updateId, 'updateName':update})
    else:
        for doc in result:
            updateId = doc['updateId']
            break
    return updateId
