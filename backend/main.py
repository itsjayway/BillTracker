from flask import Flask
from flask import request
from flask import jsonify

from bson import ObjectId

from datetime import datetime

import pymongo

app = Flask(__name__)
CLIENT = pymongo.MongoClient("mongodb://localhost:27017")


@app.route("/")
def hello_world():
    return "<h1>Hello world</h1>"


@app.route("/get_all_bills")
def get_all_bills():
    connection = pymongo.MongoClient("mongodb://localhost:27017")
    db = connection["BILL_TRACKER"]
    collection = db["COMPANIES"]

    companies = []
    # find all companies whose shown value is 1
    for company in collection.find({"shown": {"$ne": 0}}):
        company["_id"] = str(company["_id"])
        companies.append(company)

    # sort by date
    companies.sort(key=lambda entry: datetime.strptime(entry["due_date"], "%m/%d/%Y"))

    # get current date and add overdue to front and backend
    now = datetime.now().strftime("%m/%d/%Y")

    # check every bill and update if it's overdue
    for company in companies:
        if company["due_date"] <= now:
            try:
                if company["overdue"]:
                    continue
            except:
                collection.update_one(
                    {"_id": ObjectId(company["_id"])}, {"$set": {"overdue": 1}}
                )
                company["overdue"] = 1
        else:
            if company["overdue"]:
                collection.update_one(
                    {"_id": ObjectId(company["_id"])}, {"$set": {"overdue": 0}}
                )
    print("companies", companies)
    return companies


@app.route("/create_bill", methods=["POST"])
def create_bill():
    data = request.get_json()
    data["shown"] = 1
    data["overdue"] = 1
    connection = pymongo.MongoClient("mongodb://localhost:27017")
    db = connection["BILL_TRACKER"]
    collection = db["COMPANIES"]
    collection.insert_one(data)
    return {"success": 1}


def log_transaction(account_id, amount, notes):
    connection = pymongo.MongoClient("mongodb://localhost:27017")
    db = connection["BILL_TRACKER"]

    companies_collection = db["COMPANIES"]
    company_name = companies_collection.find_one({"account_id": account_id})["name"]
    transactions_collection = db["TRANSACTIONS"]

    transaction = {
        "account_id": account_id,
        "name": company_name,
        "amount": amount,
        "date": datetime.now().strftime("%m/%d/%Y"),
        "time": datetime.now().strftime("%H:%M:%S"),
        "notes": notes or "",
    }

    transactions_collection.insert_one(transaction)


@app.route("/get_transactions/<bill_id>")
def get_transactions(bill_id):
    connection = pymongo.MongoClient("mongodb://localhost:27017")
    db = connection["BILL_TRACKER"]
    collection = db["TRANSACTIONS"]

    transactions = []
    for transaction in collection.find({"bill_id": bill_id}):
        transaction["_id"] = str(transaction["_id"])
        transactions.append(transaction)
    return transactions


@app.route("/get_all_transactions")
def get_all_transactions():
    connection = pymongo.MongoClient("mongodb://localhost:27017")
    db = connection["BILL_TRACKER"]
    collection = db["TRANSACTIONS"]

    transactions = []
    for transaction in collection.find():
        transaction["_id"] = str(transaction["_id"])
        transactions.append(transaction)
    transactions.reverse()
    return jsonify({"transactions": transactions})


@app.route("/pay_bill", methods=["POST"])
def pay_bill():
    data = request.get_json()
    connection = pymongo.MongoClient("mongodb://localhost:27017")
    db = connection["BILL_TRACKER"]
    collection = db["COMPANIES"]

    account_id = data["account_id"]

    def find_bill(account_id):
        connection = pymongo.MongoClient("mongodb://localhost:27017")
        db = connection["BILL_TRACKER"]
        collection = db["COMPANIES"]
        return collection.find_one({"account_id": account_id})

    bill = find_bill(account_id)

    # print("Bill: ", bill)
    # update the bill's due date to the next month
    due_date = datetime.strptime(bill["due_date"], "%m/%d/%Y")
    next_month = due_date.month + 1
    curr_day = due_date.day
    if next_month > 12:
        next_month = 1

    # handle last days of the month
    replace_day = due_date.day
    if replace_day == 30 and next_month in [1, 3, 5, 7, 9, 10, 12]:
        replace_day = 31
    elif replace_day == 31 and next_month in [2, 4, 6, 8, 11]:
        if next_month == 2:
            replace_day = 28
        else:
            replace_day = 30
    elif replace_day in [28, 29] and next_month == 3:
        replace_day = 31

    due_date = due_date.replace(day=1)
    due_date = due_date.replace(month=next_month)
    due_date = due_date.replace(day=replace_day)
    due_date = due_date.strftime("%m/%d/%Y")

    collection.update_one({"account_id": account_id}, {"$set": {"due_date": due_date}})
    log_transaction(account_id, data["amount"], data["notes"])

    now = datetime.now().strftime("%m/%d/%Y")
    if due_date > now:
        collection.update_one({"account_id": account_id}, {"$set": {"overdue": 0}})

    return {"success": 1}


@app.route("/get_bill/<int:bill_id>")
def get_bill(bill_id):
    pass


@app.route("/update_bill/<int:bill_id>", methods=["PUT"])
def update_bill(bill_id):
    pass


@app.route("/delete_bill", methods=["DELETE"])
def delete_bill():
    data = request.get_json()
    connection = pymongo.MongoClient("mongodb://localhost:27017")
    db = connection["BILL_TRACKER"]
    collection = db["COMPANIES"]
    collection.update_one({"account_id": data["accountId"]}, {"$set": {"shown": 0}})
    return {"success": 1}


@app.route("/get_hidden_bills")
def get_hidden_bills():
    connection = pymongo.MongoClient("mongodb://localhost:27017")
    db = connection["BILL_TRACKER"]
    collection = db["COMPANIES"]

    companies = []

    for company in collection.find({"shown": 0}):
        company["_id"] = str(company["_id"])
        companies.append(company)

    return jsonify({"companies": companies})


@app.route("/show_bill", methods=["PUT"])
def show_bill():
    data = request.get_json()
    connection = pymongo.MongoClient("mongodb://localhost:27017")
    db = connection["BILL_TRACKER"]
    collection = db["COMPANIES"]

    collection.update_one({"account_id": data["account_id"]}, {"$set": {"shown": 1}})
    return {"success": 1}


@app.route("/get_transactions_between_dates", methods=["POST"])
def get_transactions_between_dates():
    data = request.get_json()
    connection = pymongo.MongoClient("mongodb://localhost:27017")
    db = connection["BILL_TRACKER"]
    collection = db["TRANSACTIONS"]

    begin_date = data["beginDate"]
    end_date = data["endDate"]

    def convert_if_necessary(in_date, which=0):
        if not in_date:
            return (
                datetime.max.date().strftime("%m/%d/%Y")
                if which
                else datetime.min.date().strftime("%m/%d/%Y")
            )
        else:
            return datetime.strptime(in_date, "%Y-%m-%d").date().strftime("%m/%d/%Y")

    begin_date, end_date = convert_if_necessary(begin_date), convert_if_necessary(
        end_date, 1
    )

    # print(f"==============={begin_date} -> {end_date}===============")

    transactions = []

    for transaction in collection.find(
        {"date": {"$gte": begin_date, "$lte": end_date}}
    ):
        transaction["_id"] = str(transaction["_id"])
        transactions.append(transaction)

    transactions.reverse()
    return jsonify({"transactions": transactions})


@app.route("/admin/show_all_bills", methods=["PUT"])
def show_all_bills():
    connection = pymongo.MongoClient("mongodb://localhost:27017")
    db = connection["BILL_TRACKER"]
    collection = db["COMPANIES"]
    collection.update_many({}, {"$set": {"shown": 1}})
    return {"success": 1}


if __name__ == "__main__":
    app.run(debug=True)
