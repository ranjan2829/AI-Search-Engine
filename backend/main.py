from app.database import Database

def main():
    try:
        # Initialize database connection
        db = Database()
        print("MongoDB connection test successful!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close_connection()

if __name__ == "__main__":
    main()
