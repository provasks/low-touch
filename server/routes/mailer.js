var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Mailer home page');
});
// // define the about route
router.post('/send', function(req, res) {
  var transporter = nodemailer.createTransport({
    host: 'smtp.corp.netapp.com',
    port: 25,
    secure: false // upgrade later with STARTTLS
    // auth: {
    //   user: 'noreply-clusterviewer@netapp.com',
    //   pass: 'P6hi4a5kCc'
    // }
  });

  const mailOptions = {
    from: 'noreply-lowtouch@netapp.com', // sender address
    // to: 'provasks@gmail.com',
    // cc: ['provas.saha@netapp.com'],
    to: 'ng-lowtouch-feedback@netapp.com',
    cc: ['provas.saha@netapp.com', 'nibu.habel@netapp.com'],

    subject: 'Issue from Low-Touch', // Subject line
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <style>
          h1 {
            margin: 10px;
          }
          h2 {
            margin: 7px;
          }
          h3 {
            margin: 5px;
          }
          h1 a {
            text-decoration: none;
          }
          h3 a {
            text-decoration: none;
          }
          .container {
            margin: 0 auto;
            text-align: center;
            width: 600px;
          }
          table {
            width: 100%;
            text-align: left;
            border-collapse: collapse;
          }
          td {
            padding: 5px;
            border: 1px solid #ccc;
          }
          .odd {
            background-color: rgba(0, 0, 0, 0.075);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>
            <span> <a href="${req.body.msg.siteUrl}"> Low Touch POC</a></span>
          </h1>
          <h2>
            ${req.body.msg.title}
          </h2>
          <h3>
            Click
            <a
              href="${req.body.msg.hostUrl}"
              >here</a
            >
            to see the host detail.
          </h3>
    
          <table>
            <tbody>
              <tr class="odd">
                <td style="width: 33.33%">Logged by</td>
                <td>${req.body.msg.email}</td>
              </tr>
              <tr class="even">
                <td>Logging Time</td>
                <td>${req.body.msg.date}</td>
              </tr>
              <tr class="odd">
                <td>Cluster</td>
                <td>${req.body.msg.cluster}</td>
              </tr>
              <tr class="even">
                <td>Serial</td>
                <td>${req.body.msg.serial}</td>
              </tr>
              <tr class="odd">
                <td>Hostname</td>
                <td>${req.body.msg.host}</td>
              </tr>
              <tr class="even">
                <td>Aggregate</td>
                <td>${req.body.msg.aggregate}</td>
              </tr>
              <tr class="odd">
                <td>Problem detail</td>
                <td>${req.body.msg.problem}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>         
        `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(400).send({ success: false });
    } else {
      console.log(info);
      res.status(200).send({ success: true });
    }
  });
});

module.exports = router;
