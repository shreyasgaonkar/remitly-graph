import json
import datetime
import boto3
from boto3.dynamodb.conditions import Key

DYNAMODB = boto3.resource('dynamodb')
TABLE = DYNAMODB.Table('remitly')
YEAR = datetime.datetime.utcnow().year


def main():
    """Grab data and plot"""
    date_returned = []
    rate = []

    filter_expression = Key('time').begins_with(f'{YEAR}-')

    response = TABLE.scan(FilterExpression=filter_expression)
    data = response['Items']

    for i in data:
        date_returned.append(i['time'].split(" ")[0])
        rate.append(list(i['rate']))

    body_got = {}

    # Sort rate array by date
    date_returned, rate = zip(*sorted(zip(date_returned, rate)))

    body_got['date'] = date_returned
    body_got['rate'] = rate

    body_got = json.dumps(body_got)
    sendback = {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": body_got
    }
    return sendback


def lambda_handler(event, context):
    """Main Lambda function"""
    return main()
