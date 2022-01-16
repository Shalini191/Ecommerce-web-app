from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import json
from os import path
from pathlib import Path
import sys
p = path.join(str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, p)
config = json.load(open(path.join(p, 'database_layer/config.json')))['mysql']

engine = create_engine(
    "mysql://{}:{}@{}/{}".format(config['user'], config['password'], config['host'], config['db']),
    connect_args={
        'port': 3306
        },
    echo='debug',
    echo_pool=True
)

db_session = scoped_session(
    sessionmaker(
        bind=engine,
        autocommit=False,
        autoflush=False
    )
)

Base = declarative_base()
    
def init_db():
    import database_layer.models
    Base.metadata.create_all(bind=engine)