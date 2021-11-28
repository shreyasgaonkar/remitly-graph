exports.handler = function (event, context, callback) {

    // Parse the input for the parameter values
    var tmp = event.methodArn.split(':');
    var apiGatewayArnTmp = tmp[5].split('/');
    var resource = '/';
    if (apiGatewayArnTmp[3]) {
        resource += apiGatewayArnTmp[3];
    }

    var condition = {};
    condition.IpAddress = {};
    const allowedDomains = ["https://www.remitly.shreyasgaonkar.com", "https://remitly.shreyasgaonkar.com"];

    if (allowedDomains.includes(event.headers.origin)) {
        callback(null, generateAllow('me', event.methodArn));
    } else {
        callback("Unauthorized");
    }
};

// Help function to generate an IAM policy
var generatePolicy = function (principalId, effect, resource) {

    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};

var generateAllow = function (principalId, resource) {
    return generatePolicy(principalId, 'Allow', resource);
};

var generateDeny = function (principalId, resource) {
    return generatePolicy(principalId, 'Deny', resource);
};