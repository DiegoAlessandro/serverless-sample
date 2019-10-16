import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
var AWS = require('aws-sdk');

var region = 'ap-northeast-1'; // e.g. us-west-1
var domain = 'search-elasticsearch-instance-32kqsp63pkpux5cirac6musqce.ap-northeast-1.es.amazonaws.com'; // e.g. search-domain.region.es.amazonaws.com
var index = 'node-test';
var type = '_doc';
var id = '1';
var json = {
  "title": "Moneyball",
  "director": "Bennett Miller",
  "year": "2011"
};

const AWS_ACCESS_KEY_ID = 'AKIA6MY47Q4I6FIJSS43';
const AWS_SECRET_ACCESS_KEY='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';

export const hello: APIGatewayProxyHandler = async (event, _context) => {

  var endpoint = new AWS.Endpoint(domain);
  var request = new AWS.HttpRequest(endpoint, region);

  request.method = 'PUT';
  request.path += index + '/' + type + '/' + id;
  request.body = JSON.stringify(json);
  request.headers['host'] = domain;
  request.headers['Content-Type'] = 'application/json';
  // Content-Length is only needed for DELETE requests that include a request
  // body, but including it for all requests doesn't seem to hurt anything.
  request.headers["Content-Length"] = request.body.length;

  var credentials = new AWS.EnvironmentCredentials(AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY);
  var signer = new AWS.Signers.V4(request, 'es');
  signer.addAuthorization(credentials, new Date());

  var client = new AWS.HttpClient();
  console.log('client');
  await client.handleRequest(request, null, function(response) {
    console.log(response.statusCode + ' ' + response.statusMessage);
    var responseBody = '';
    response.on('data', function (chunk) {
      responseBody += chunk;
    });
    response.on('end', function (chunk) {
      console.log(chunk);
      console.log('Response body: ' + responseBody);
    });
  }, function(error) {
    console.log('Error: ' + error);
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };
};
