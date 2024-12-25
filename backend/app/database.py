from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class Database:
    def __init__(self):
        self.mongo_uri = os.getenv("MONGO_URI")
        if not self.mongo_uri:
            raise ValueError("MongoDB URI must be provided.")
        
        try:
            self.client = MongoClient(
                self.mongo_uri,
                tls=True,
                tlsAllowInvalidCertificates=True
            )
            self.db = self.client.ai_search_engine
            print("MongoDB Connection Established Successfully!")
        except Exception as e:
            print(f"MongoDB Connection Error: {e}")
            raise

    def close_connection(self):
        if self.client:
            self.client.close()
            print("MongoDB Connection Closed")
db=Database()