from __future__ import print_function
import serial
import os
import requests
import json
import re
PORT = "COM1"
cashiers = ['a','b','1']
shoppc = "http://localhost:3000"
class Transaction:
    def __init__(self):
        self.items = {}
        for i in cashiers:
            self.items[i]=[]

    def addItem(self,cashier,item):
        self.items[cashier].append(item)
    def finalize(self, cashier):
        item = self.items[cashier]
        payload = {
            'cashier': cashier,
            'list': item
            }
        print(json.dumps(payload))
        headers = {'content-type': 'application/json'}#,'accept': 'text/plain'}
        res = requests.post(shoppc+'/processTransaction', data=json.dumps(payload), headers=headers)
        print(res.text)
        
        

def item_wrap(barcode, quantity, price):
    d = {
        'barcode':barcode,
        'quantity':quantity,
        'price': price
        }
    return d


def create_connection():
    if os.name == 'posix':
        PORT = "/dev/ttyUSB0"
    elif os.name == "nt":
        PORT = "COM1"
    return serial.Serial(PORT,9600,timeout = 0.5)

def query_price(barcode, cid):
    payload = {
        'barcode':barcode,
        'cashier':cid
        }
    res = requests.post(shoppc+"/getPrice",data=payload)
    resd = json.loads(res.text)
    return resd["price"]

def handle(cid, barcode, quantity, t, ser_write, ser_read):
    if len(barcode) != 8:
        print("error: invalid barcode")
        return
    price = query_price(barcode, cid)
    print("price: "+str(price))
    ser_write(price)
    t.addItem(cid, item_wrap(barcode,quantity,price))
    h = ser_read(1)
    if h == "#":
        t.finalize(cid)
    
def parse(message):
    m = re.search('([0-9]{8}):([0-9]{4})',message)
    return m.groups(0), m.groups(1)

def main():
    ser = create_connection()
    ser_write = lambda x: ser.write(x)
    ser_read = lambda x: ser.read(x)
    transactions = Transaction()
    for cid in cashiers:
        ser.write(cid)
        fst = ser.read(1)
        #provisional as of now I echo the id.
        if fst!= cid:
            barcode, quantity = parse(fst + ser.read(11))
            handle(cid, barcode, quantity,transactions, ser_write, ser_read)
    

#if __name__ == '__main__':
def test():
    inp = lambda x: raw_input()
    outp = lambda x: print(x)
    bar = '30011470'
    quantity = 1000
    t = Transaction()
    handle('1',bar,quantity,t,outp,inp)
