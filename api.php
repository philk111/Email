<?php

session_cache_limiter(false);

require_once '../vendor/autoload.php';
require_once 'db.php';

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$log = new Logger('main');
$log->pushHandler(new StreamHandler('logs/main.log', Logger::DEBUG));
$log->pushHandler(new StreamHandler('logs/main.log', Logger::ERROR));

$app = new \Slim\Slim();

\Slim\Route::setDefaultConditions(array(
    'emailId' => '\d+'
));

$app->response->headers->set('content-type', 'application/json');

$app->get('/', function () use ($app) {
    $app->response->headers->set('content-type', 'text/html');
    echo file_get_contents('register.html');
});

//FUNCTIONS------------------------------------------------------------------------------------------------------------------------------------------------------------
//GET AUTH USER ID------------------------------------------------------------------------------------------------------------------------------------------------------------
function getAuthUserId() {
    global $app, $log;
    $email = $app->request->headers("PHP_AUTH_USER");
    $password = $app->request->headers("PHP_AUTH_PW");

    if ($email && $password) {
        $row = DB::queryFirstRow("SELECT * FROM users WHERE email=%s", $email);
        if ($row && $row['password'] == $password) {
            return $row['ID'];
        }
    }

    $log->debug("BASIC authentication failed for user " . $email . " from " . $_SERVER['REMOTE_ADDR']);
    $app->response->status(401);
    return FALSE;
}

//REGISTER------------------------------------------------------------------------------------------------------------------------------------------------------------
$app->post('/api/v1/users', function() use ($app, $log) {

    $body = $app->request->getBody();
    $userInfo = json_decode($body, TRUE);


    $emailExists = DB::queryFirstRow("SELECT *  FROM users WHERE email=%s", $userInfo['email']);

    if ($emailExists) {
        $app->response()->setStatus(400);
        $log->debug("POST /REGISTRATION: [[" . $body . "]] data invalid: email already exists");
        echo json_encode("ERROR 400: email already exists");
        return;
    }


    if (strlen($userInfo['fullName']) < 2) {
        $app->response()->setStatus(400);
        $log->debug("POST /REGISTRATION: [[" . $body . "]] data invalid: Name must be between 2 and 50 characters");
        echo json_encode("ERROR 400: Name must be between 2 and 50 characters long.");
        return;
    }

    if (filter_var($userInfo['email'], FILTER_VALIDATE_EMAIL) === FALSE) {
        $app->response()->setStatus(400);
        $log->debug("POST /REGISTRATION: [[" . $body . "]] data invalid: Appears to be invalid email address.");
        echo json_encode("ERROR 400: Email address appears invalid");
        return;
    }

    if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/", $userInfo['password'])) {
        $app->response()->setStatus(400);
        $log->debug("POST /REGISTRATION: [[" . $body . "]] data invalid: Password too weak.");
        echo json_encode("ERROR 400: Password too weak. Must be 8 characters in length, contain 1 uppercase, 1 lower case and 1 special character ");
        return;
    }


    DB::insert('users', $userInfo);
    echo DB::insertId();
    $app->response->setStatus(201);
    return TRUE;
});

//UPATE PASSWORD------------------------------------------------------------------------------------------------------------------------------------------------------------
$app->put('/api/v1/users/:email', function($email) use ($app, $log) {
    $userId = getAuthUserId();
    if (!$userId) {
        $app->response->setStatus(403);
        return;
    }
    $body = $app->request->getBody();
    $passInfo = json_decode($body, TRUE);

    $email = $passInfo['email'];
    $password = $passInfo['oldPass'];


    if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/", $passInfo['password'])) {
        $app->response()->setStatus(400);
        $log->debug("POST /REGISTRATION: [[" . $body . "]] data invalid: Password too weak.");
        echo json_encode("ERROR 400: Password too weak. Must be 8 characters in length, contain 1 uppercase, 1 lower case and 1 special character ");
        return;
    }


    DB::update('users', array('password' => $passInfo['password']), 'email=%s', $passInfo['email']);
    $app->response->setStatus(201);
    echo json_encode(true);
});

//LOGIN------------------------------------------------------------------------------------------------------------------------------------------------------------
$app->get('/api/v1/users/:email', function() use ($app, $log) {
    $userId = getAuthUserId();
    if (!$userId) {
        return;
    }

    $userRecords = DB::query("SELECT userID, folder  FROM emails WHERE userID=%d", $userId);
    echo json_encode($userRecords, JSON_PRETTY_PRINT);
});

//GET EMAILS------------------------------------------------------------------------------------------------------------------------------------------------------------
//INBOX EMAILS------------------------------------------------------------------------------------------------------------------------------------------------------------
$app->get('/api/v1/emails/inbox', function() {
    $userId = getAuthUserId();
    if (!$userId) {
        $app->response->setStatus(403);
        return;
    }

    $inboxList = DB::query("SELECT * FROM emails WHERE userId=%d AND folder='inbox'", $userId);
    echo json_encode($inboxList, JSON_PRETTY_PRINT);
});

//IMPORTANT EMAILS------------------------------------------------------------------------------------------------------------------------------------------------------------
$app->get('/api/v1/emails/important', function() {
    $userId = getAuthUserId();
    if (!$userId) {
        $app->response->setStatus(403);
        return;
    }

    $importantList = DB::query("SELECT * FROM emails WHERE userId=%d AND folder='important'", $userId);
    echo json_encode($importantList, JSON_PRETTY_PRINT);
});

//SOCIAL EMAILS------------------------------------------------------------------------------------------------------------------------------------------------------------
$app->get('/api/v1/emails/social', function() {
    $userId = getAuthUserId();
    if (!$userId) {
        $app->response->setStatus(403);
        return;
    }

    $socialList = DB::query("SELECT * FROM emails WHERE userId=%d AND folder='social'", $userId);
    echo json_encode($socialList, JSON_PRETTY_PRINT);
});

//SPAM EMAILS------------------------------------------------------------------------------------------------------------------------------------------------------------
$app->get('/api/v1/emails/spam', function() {
    $userId = getAuthUserId();
    if (!$userId) {
        $app->response->setStatus(403);
        return;
    }

    $spamList = DB::query("SELECT * FROM emails WHERE userId=%d AND folder='spam'", $userId);
    echo json_encode($spamList, JSON_PRETTY_PRINT);
});

//OUTBOX EMAILS------------------------------------------------------------------------------------------------------------------------------------------------------------
$app->get('/api/v1/emails/outbox', function() {
    $userId = getAuthUserId();
    if (!$userId) {
        $app->response->setStatus(403);
        return;
    }

    $outboxList = DB::query("SELECT * FROM emails WHERE userId=%d AND folder='outbox'", $userId);
    echo json_encode($outboxList, JSON_PRETTY_PRINT);
});

//SELECT EMAIL------------------------------------------------------------------------------------------------------------------------------------------------------------
$app->get('/api/v1/emails/:emailId', function($emailId) use ($app, $log) {
    $userId = getAuthUserId();
    if (!$userId) {
        $app->response->setStatus(403);
        return;
    }

    $email = DB::queryFirstRow("SELECT * FROM emails WHERE ID=%d", $emailId);

    if (!$email) {
        $app->response()->setStatus(404);
        $log->debug("GET /todoitems/" . $emailId . " returned 404");
        echo json_encode("404 - item not found");
        return;
    }

    echo json_encode($email, JSON_PRETTY_PRINT);
});




//MOVE FOLDER------------------------------------------------------------------------------------------------------------------------------------------------------------
$app->put('/api/v1/emails/:emailId', function($emailId) use ($app, $log) {
    $userId = getAuthUserId();
    if (!$userId) {
        $app->response->setStatus(403);
        return;
    }
    $body = $app->request->getBody();
    $moveToFolder = json_decode($body, TRUE);


    DB::update('emails', array('folder' => $moveToFolder), 'ID=%i', $emailId);
    $app->response->setStatus(201);
    echo json_encode(true);
});

//NEW EMAIL------------------------------------------------------------------------------------------------------------------------------------------------------------
$app->post('/api/v1/emails', function() use ($app, $log) {
    $userId = getAuthUserId();
    if (!$userId) {
        $app->response->setStatus(403);
        return;
    }

    $email = $app->request->headers("PHP_AUTH_USER");
    $body = $app->request->getBody();
    $newEmail = json_decode($body, TRUE);
    $date = date('Y-m-d');

    
    if (strlen($newEmail['subject']) <= 2) {
    $app->response()->setStatus(400);
    $log->debug("POST /REGISTRATION: [[" . $body . "]] data invalid: Subject line must have at least 2 characters.");
    echo json_encode("ERROR 400: Subject line must have at least 2 characters.");
    return;
    }

    if (filter_var($newEmail['to'], FILTER_VALIDATE_EMAIL) === FALSE) {
      $app->response()->setStatus(400);
      $log->debug("POST /REGISTRATION: [[" . $body . "]] data invalid: Appears to be invalid email address.");
      echo json_encode("ERROR 400: Email address appears invalid");
      return;
      }
     
    if (isset($newEmail['hasFile'])) {
        $file = base64_decode($newEmail['file']);
        DB::insert('emails', array('folder' => 'Outbox', 'from' => $email, 'userID' => $userId, 'to1' => $newEmail['to'],
            'subject' => $newEmail['subject'], 'body' => $newEmail['body'], 'dateSent' => $date,
            'attachmentFileName' => $newEmail['fileName'], 'attachmentMimeType' => $newEmail['fileType'], 'attachment' => $file));
        echo DB::insertId();
        $app->response->setStatus(201);
        return TRUE;
    }


    DB::insert('emails', array('folder' => 'Outbox', 'from' => $email, 'userID' => $userId, 'to1' => $newEmail['to'],
        'subject' => $newEmail['subject'], 'body' => $newEmail['body'], 'dateSent' => $date));
    echo DB::insertId();
    $app->response->setStatus(201);
    return TRUE;
});

//SIMULATE EMAILS------------------------------------------------------------------------------------------------------------------------------------------------------------
$app->get('/queue/', function() use ($app, $log) {
    $app->response()['Content-Type'] = 'application/json';
    $deliveredCount = 0;
    $undeliveredEmails = array();

    $emailList = DB::query("SELECT ID,to1 FROM emails WHERE folder='Outbox'");

    foreach ($emailList as $email) {

        $recipientID = DB::queryOneField("ID","SELECT ID FROM users WHERE email=%s", $email['to1']);

        if ($recipientID) {

            DB::update("emails", array("userID" => $recipientID, "folder" => "Inbox"), 'ID=%i', $email['ID']);
            $deliveredCount++;
        } else {

            array_push($undeliveredEmails, $email['to1']);
        }
    }
    $retval = array(
        "processed" => count($emailList),
        "delivered" => $deliveredCount,
        "undeliveredList" => $undeliveredEmails
    );
    echo json_encode($retval, JSON_PRETTY_PRINT);
});



$app->run();
