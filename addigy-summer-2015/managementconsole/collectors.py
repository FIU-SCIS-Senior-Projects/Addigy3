__author__ = 'ayme'

def storeActivity(table,data):
    post_id = table.insert_one(data).inserted_id

