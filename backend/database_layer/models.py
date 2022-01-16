from sqlalchemy import *
import json
from sqlalchemy import sql
from sqlalchemy.orm import relationship
from os import path
from pathlib import Path
import sys
p = path.join(str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, p)

from pathlib import Path
from database_layer.database import Base

"""
Contains classes to access and manipulate the table in the database and to execute different queries using SQLAlchemy
"""


class User(Base):
    __tablename__ = 'users'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    name = Column('name', String(200), nullable=False)
    email = Column('email', String(50), nullable=False, unique=True)
    password = Column('password', String(255), nullable=False)

    def __init__(self, name=None, email=None, password=None):
        self.name = name
        self.email = email
        self.password = password


class Product(Base):
    __tablename__ = 'products'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    name = Column('name', String(200), nullable=False)
    description = Column('description', String(1000), nullable=False)
    price = Column('price', DECIMAL(10,2), nullable=False)
    image_url = Column('image_url', String(500), nullable=False)

    def __init__(self, name=None, description = None, price = None, image_url = None):
        self.name = name
        self.description = description
        self.price = price
        self.image_url = image_url


class Order(Base):
    __tablename__ = 'orders'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    user_id = Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    product_id = Column('product_id', Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    quantity = Column('quantity', Integer, nullable=False)

    def __init__(self, user_id=None, product_id=None, quantity=None):
        self.user_id = user_id
        self.product_id = product_id
        self.quantity = quantity

