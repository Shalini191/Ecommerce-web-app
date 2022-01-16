from sqlalchemy import MetaData, Table, Column, DECIMAL, Integer, String, VARCHAR, ForeignKey, Boolean, Enum, JSON, PrimaryKeyConstraint, CheckConstraint,sql, TEXT, UniqueConstraint
import sys
from os import path
from pathlib import Path
from database_layer.database import *


def createAllDatabases():
    """
    Creates all the tables in the MySQL Database.
    All the table structures and their constraints are defined here.
    users: Stores the details of all the users
    products: Stores the details of all the products
    orders: Stores mappings between users and the products they order
    """
    meta = MetaData()

    users = Table(
        'users', meta,
        Column('id', Integer, primary_key=True, autoincrement=True),
        Column('name', String(200), nullable=False),
        Column('email', String(50), nullable=False, unique=True),
        Column('password', String(255), nullable=False)
    )

    products = Table(
        'products', meta,
        Column('id', Integer, primary_key=True, autoincrement=True),
        Column('name', String(200), nullable=False),
        Column('description', String(1000), nullable=False),
        Column('price', DECIMAL(10,2), nullable=False),
        Column('image_url', String(500), nullable=False)
    )

    orders = Table(
        'orders', meta,
        Column('id', Integer, primary_key=True, autoincrement=True),
        Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        Column('product_id', Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        Column('quantity', Integer, nullable=False)
    )

    meta.create_all(engine)

createAllDatabases()
