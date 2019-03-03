key regen service

copy this cfn template:
https://github.com/evanchiu/serverless-todo
and use this as well for codepipeline: https://medium.com/@jeffreyrussom/react-continuous-deployments-with-aws-codepipeline-f5034129ff0e

so the serverless todo will update the site based on a cloudformation deploy and serverless transform of a build.zip file. 
codepipeline one updates code based on github push. But i want a way to auto update my cloudformation stack too, instead of going through console. in that case i can just keep my github updating style and add an npm script like serverless-todos:
"package": "aws cloudformation package --template-file template.yml --output-template-file packaged-template.yml --s3-bucket $S3_BUCKET",	
"deploy": "aws cloudformation deploy --template-file packaged-template.yml --capabilities CAPABILITY_IAM --stack-name dev-todo-$USER"	
but if i do that, i need to have a premade s3 bucket for the template to live in.
update it from the console for now, adding in SSm and stuff.

created a subdomain: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-routing-traffic-for-subdomains.html
map that subdomain to my new cloudfront distribution from the cfn template.
* to do that, add A and AAAA records to the subdomain in route53
* also add alternate cnames in the cloudfront distribution itself.
* assigned the miraclebob.com cert in cloudfront to the subdomain
    * k that didn't work. https://docs.aws.amazon.com/acm/latest/userguide/acm-certificate.html#wildcard
    * created a new cert (has to be in us-east-1) for krs.miraclebob.com

set up pi with SSM: https://aws.amazon.com/blogs/mt/manage-raspberry-pi-devices-using-aws-systems-manager/
create run command target as result of cloudwatch codepipeline complete event: https://docs.aws.amazon.com/systems-manager/latest/userguide/rc-cwe.html
make sure to put that cloudwatch event/target into the cfn script

big issue with react-scripts build pointing to random crap: https://stackoverflow.com/questions/42686149/create-react-app-build-with-public-url
it is the homepage key in my package.json



I want to:
* have code deploy for website code when i push to github
* run ssm commands on pi when i push to github to update and stuff on the pi
* have all my resources in a CFN template to put on my work account.

I need:
* github token: https://github.com/settings/tokens with only repo scope. param for cfn stack
* that stack w/ github param is a one time create.
* should stack additions be made in a whole new stack or change sets. what's the codepipeline behavior in cfn when it exists?
* 

to include in master template:
* cloudwatch codepipeline->ssm event
    * {
    *   "source": [
    *     "aws.codepipeline"
    *   ],
    *   "detail-type": [
    *     "CodePipeline Pipeline Execution State Change"
    *   ],
    *   "detail": {
    *     "pipeline": ["KyloRenService-CodePipeline-EBNME3II4066"],
    *     "state": [
    *       "SUCCEEDED"
    *     ]
    *   }
    * }
    * ---
    * also the target for the event: (remove quotes from "InstanceIds")
    * the role should be one with full SSM Access.
    * make your own document for the target:
    * {
    *   "schemaVersion": "1.2",
    *   "description": "Update code on the pi using git pull",
    *   "parameters": {},
    *   "runtimeConfig": {
    *     "aws:runShellScript": {
    *       "properties": [
    *         {
    *           "id": "0.aws:runShellScript",
    *           "workingDirectory": "/home/pi/Documents/Dev/KyloRenService",
    *           "runCommand": [
    *             "git pull"
    *           ]
    *         }
    *       ]
    *     }
    *   }
    * }

* cloudfront/route53 setup?
* all the stuff from ssm setup
    * pi aws config (set up keys and secret)
    * SSMServiceRole (https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-service-role.html)
    * managed instance activation (https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-managed-instance-activation.html)
        * code: Bi8DJfSbeuRsTeePtg/V
        * id: 71095c7d-db32-4513-b1d5-42a603a6045e
    * SSM stuff on pi: (https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-linux.html)
        * https://s3.us-west-2.amazonaws.com/amazon-ssm-us-west-2/latest/debian_arm/amazon-ssm-agent.deb\
        * sudo amazon-ssm-agent -register -code "Bi8DJfSbeuRsTeePtg/V" -id "71095c7d-db32-4513-b1d5-42a603a6045e" -region "us-east-2"
        * need access i think.... https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-access.html. shouldn't cuz i'm admin
        * logs in /var/log/amazon/ssm
        * KRS-updatePiConfig ssm document triggered by cloudwatch.
        * make sure to run the latest version or always set the default version to latest after updating (scriptify it)
    * got this issue when doing sudo -i and running startupScript (does git stuff)
        * *** Please tell me who you are.
        * 
        * Run
        * 
        *   git config --global user.email "you@example.com"
        *   git config --global user.name "Your Name"
    * so gotta set that stuff by default or something. automatically.
    * make sure anything that is invoked from cli, like the bin scripts in package.json, have been 755 chmoded.
    * IMPORTANT: realize that .bashrc and the runCommand documents are not in source control, so if they depend on stuff that is in source control,
        * then they could break when those change. e.g. updatePi run command invokes startupScript.sh. I rename it to syncScript. the git pulling happens within that
        * script, but it's unreachable because the run command is looking for syncScript since i manually updated it, but in the local repo it's still startupScript because
        * git pull hasn't been run yet. So, make a script to automate updating of the run commands and better yet have git pull stuff in syncScript so that it can run from
        * .bashrc, but duplicate the git pull stuff into a new run command that runs before the updatePi run command. That's a bit overkill to do git pull twice in a row. but 
        * just realize you have to tread carefully. Else you need to manually do a git pull on the pi via ssh or run command.
* iot stuff
    * https://docs.aws.amazon.com/iot/latest/developerguide/iot-sdk-setup.html
    * deviceSDK dir in home dir with the 3 one click iot certs and the 4 amazon certs
    * KyloRenService iot group
    * iot policy for the pi
* Dynamo table
    * https://github.com/ironSource/node-dynamodb-stream
    * Create the table, stream trigger run command which simply scans the table and replaces the local file.
    * configId, color, createdBy, preset, sound
    * KRSDynamoTrail cloudtrail and associate krsdynamotrailbucket in S3
    * Lambda handler to sync dynamo via runcommand: https://medium.com/@simonrand_43344/using-aws-simple-systems-manager-and-lambda-to-replace-cron-in-an-ec2-auto-scaling-group-939d114ec9d7
    * node file on pi to pull from dynamo
    * KRS-syncDynamo run command document. make sure it does a commit and push of the csv file afterward.
    * IAM role for the pi to read dynamo
    * set the profile env variable: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html
    * so doing sudo node cmd/dynamoSync fails because there was no .aws/credentials file in the /root dir. so i made it and it works.
    * so root creates the dynamoData.csv file, so the pi user can't edit it. To fix, do umask 002 so default file perms are 664. and umask 003 for directories to be 774

On Startup:
* sudo service amazon-ssm-agent start
* iot listener
* git reset hard origin/master and git pull and npm install if package.json changed
    * well also my script files use the bin thing which requires an npm install as well...
    * that bin thing: https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e

Issues:
* doing npm install on the pi: https://github.com/nodejs/node-gyp/issues/454 gives permission errors w/ node-gyp
* 

TODO:
* logging
 * for all the files: dynamoSync, iot_listener, lights, sounds, runConfig, conditionalInstall, syncScript
 * setup logging for js files with winston or something
 * setup logging for script files
* script to copy aws credentials file from pi home dir to /root user directory.

Sounds:
* Pygame is quiet
* use omxplayer wrapper. install: https://github.com/willprice/python-omxplayer-wrapper/issues/115
* you can do async sounds
* weird stuff when doing audio same time as lights. fuzz from audio. no lights. did this: https://www.raspberrypi.org/forums/viewtopic.php?f=29&t=136445 then got some lights but still fuzz audio.
