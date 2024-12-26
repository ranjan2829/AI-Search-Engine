
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from fastapi import FastAPI

uri = "mongodb+srv://ranjanshitole3129:ranjan3129@aiengine.ssp5a.mongodb.net/?retryWrites=true&w=majority&appName=AIEngine"


client = MongoClient(uri, server_api=ServerApi('1'))



client.admin.command('ping')
print("Pinged your deployment. You successfully connected to MongoDB!")
