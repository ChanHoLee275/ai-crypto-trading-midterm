import time
import requests
import os
import hmac
import dotenv

dotenv.load_dotenv()

def main():
    print("main program start")
    print('TASK A')
    url = os.environ.get('BALANCES_API')
    curr_time = create_time()
    signature = create_signature('GET', curr_time, url)
    api_request(url, curr_time, signature)
    print('TASK B')
    market = input("마켓 이름을 작성해주세요. 입력하지 않으면 XRP-PERP을 조회합니다.")
    if market == '':
        url = os.environ.get('ORDERS_API') + "?market="+ 'XRP-PERP'
        curr_time = create_time()
        signature = create_signature('GET', curr_time, url)
        api_request(url, curr_time, signature)
    else :
        url = os.environ.get('ORDERS_API') + "?market=" + market
        curr_time = create_time()
        signature = create_signature('GET', curr_time, url)
        api_request(url, curr_time, signature)
        

def create_time():
    return int(time.time() * 1000)

def create_signature(method:str, time:int, url:str):
    return hmac.new(os.environ.get('SECRET_KEY').encode(), (str(time) + method + url).encode(), 'sha256').hexdigest()

def api_request(url: str, time: int, signature: str):
    request = requests.Request('GET', os.environ.get("API_URL") + url).prepare()
    request.headers['FTX-KEY'] = os.environ.get('ACCESS_KEY')
    request.headers['FTX-SIGN'] = signature
    request.headers['FTX-TS'] = str(time)
    response = requests.Session().send(request=request)
    print(response.json())

if __name__ == '__main__':
    main()