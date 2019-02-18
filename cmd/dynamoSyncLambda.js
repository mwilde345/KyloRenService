'use strict'

const AWS = require('aws-sdk')
const ssm = new AWS.SSM()
// https://medium.com/@simonrand_43344/using-aws-simple-systems-manager-and-lambda-to-replace-cron-in-an-ec2-auto-scaling-group-939d114ec9d7
exports.handler = (event) => {
  return new Promise((resolve, reject) => {
    runCommand('KRS-dynamoSync', 'mi-0cf54bccaf326b08d')
    })
    .catch(err => {
      reportFailure(err)
    })
}

const reportFailure = (failureMessage) => {
  const failureSnsTopic = process.env.FAILURE_SNS_TOPIC

  if(failureSnsTopic) {
    reportFailureToSns(failureSnsTopic, failureMessage)
  } else {
    console.log('Warning: no failure SNS defined.')
    console.log('Scheduled Job failed:', failureMessage)
  }
}

const reportFailureToSns = (topic, message) => {
  const sns = new AWS.SNS()

  return new Promise((resolve, reject) => {
    sns.publish({
      Message: message,
      Subject: 'Scheduled Job Failed',
      TopicArn: topic
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const runCommand = (documentName, instance) => {
  ssm.sendCommand({
    DocumentName: documentName,
    InstanceIds: [ instance ],
    TimeoutSeconds: 3600
  }, function(err, data) {
    if (err) {
      reportFailure(JSON.stringify(err))
    } else {
      console.log(data)
    }
  })
}