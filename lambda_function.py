import json
import boto3
from boto3.dynamodb.conditions import Key

client = boto3.client('dynamodb')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('remitly')


def main():

    dateReturned = []
    rate = []

    fe = Key('time').begins_with('2020-')

    response = table.scan(FilterExpression=fe)
    data = response['Items']

    for i in data:
        dateReturned.append(i['time'].split(" ")[0])
        rate.append(list(i['rate']))

    bodyGot = {}

    # Sort rate array by date
    dateReturned, rate = zip(*sorted(zip(dateReturned, rate)))

    bodyGot['date'] = dateReturned
    bodyGot['rate'] = rate

    bodyGot = json.dumps(bodyGot)
    sendback = {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": bodyGot
    }
    return sendback


def lambda_handler(event, context):
    return main()
