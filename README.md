## User-Panel


User Panel

- For database, Import dump in local
- add SMTPEMAIL & SMTPPASSWORD values in .env file
- For node modules, Run the command: npm install
- To Run nodejs server, Run the command: node app.js
- Now we can access all endpoints on 'http://localhost:3000/'

ENV Variables
HOST = host name on which application is running, for develop enviornment: localhost or 127.0.0.1
PORT = port number on which application is running
DBURL = to connect database
DBNAME = database name we are using while db connection
JWTSECRET = Used to verify JWT token
JWTSTATICTOKEN = static token for all non-auth routes(login, signup, verification)
SMTPHOST = host for mail service (To send mail with nodemailer)
SMTPPORT = port for mail service
SMTPEMAIL = email for mail service 
SMTPPASSWORD = password for SMTPEMAIL
SMTPSERVICE = service we can use for mail server(gmail or yahoo)
VERIFICATION_LINK = to share in an email for user verification


