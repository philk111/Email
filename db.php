<?php

DB::$dbName = 'hw3restfulemail';
DB::$user = 'hw3restfulemail';
DB::$password = 'Ecy8NNhPV7bmdH4s';


DB::$error_handler = 'sql_error_handler';
DB::$nonsql_error_handler = 'nonsql_error_handler';

function nonsql_error_handler($params) {
    global $app, $log;
    // $_SERVER[] has info about client IP, etc.
    $log->error("Database error: " . $params['error']);
    http_response_code(500);
    echo '"500 - internal error"';
    die;
}

function sql_error_handler($params) {
    global $app, $log;
    $log->error("SQL error: " . $params['error']);
    $log->error(" in query: " . $params['query']);
    http_response_code(500);
    echo '"500 - internal error"';
    die; // don't want to keep going if a query broke
}