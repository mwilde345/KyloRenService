// consider having the command run to git commit the changes to the local file every time a dynamo update is made.
// like a backup in the repo.
var AWS = require('aws-sdk');
var unmarshal = require('dynamodb-marshaler').unmarshal;
var Papa = require('papaparse');
var headers = [];
var unMarshalledArray = [];
const fs = require('fs');

  
//   if (program.profile) {
//     var newCreds = AWS.config.credentials;
//     newCreds.profile = program.profile;
//     AWS.config.update({credentials: newCreds});
//   }
  
var dynamoDB = new AWS.DynamoDB();
  
var query = {
    "TableName": "KyloRenConfigs",
    "Limit": 1000
};

var scanDynamoDB = function ( query ) {

    dynamoDB.scan( query, function ( err, data ) {
  
      if ( !err ) {
        unMarshalIntoArray( data.Items ); // Print out the subset of results.
        if ( data.LastEvaluatedKey ) { // Result is incomplete; there is more to come.
          query.ExclusiveStartKey = data.LastEvaluatedKey;
          scanDynamoDB(query);
        }
        else {
          //console.log(Papa.unparse( { fields: [ ...headers ], data: unMarshalledArray } ));
        }
      }
      else {
        console.dir(err);
      }
    });
  };
  
  function unMarshalIntoArray( items ) {
    if ( items.length === 0 )
      return;
  
    items.forEach( function ( row ) {
      let newRow = {};
  
      // console.log( 'Row: ' + JSON.stringify( row ));
      Object.keys( row ).forEach( function ( key ) {
        if ( headers.indexOf( key.trim() ) === -1 ) {
          // console.log( 'putting new key ' + key.trim() + ' into headers ' + headers.toString());
          headers.push( key.trim() );
        }
        let newValue = unmarshal( row[key] );
  
        if ( typeof newValue === 'object' ) {
          newRow[key] = JSON.stringify( newValue );
        }
        else {
          newRow[key] = newValue;
        }
      });
  
      // console.log( newRow );
      unMarshalledArray.push( newRow );
  
    });
  
}

var updateLocalCache = function(data) {
    fs.writeFileSync(
        `../data/dynamoData.csv`,
        Papa.unparse( { fields: [ ...headers ], data} ),
        'utf8');
}

scanDynamoDB(query);
updateLocalCache(unMarshalledArray);