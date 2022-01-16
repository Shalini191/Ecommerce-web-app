from routes.main import app
from database_layer.database import init_db

if __name__ == "__main__":
  init_db()
  app.run()