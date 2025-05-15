<?php

// If you're using Composer, require the autoloader.
require 'vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Register the PDO connection
Flight::register('db', 'PDO', array('mysql:host=localhost;dbname=inventorydb', 'root', ''), function ($db) {
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
});

// Get all inventory items
Flight::route('GET /items', function () {
    $items = Flight::db()->query('SELECT * FROM inventory_items')->fetchAll(PDO::FETCH_ASSOC);
    Flight::json($items);
});

// Get a single inventory item by ID
Flight::route('GET /items/@id', function ($id) {
    $stmt = Flight::db()->prepare('SELECT * FROM inventory_items WHERE id = ?');
    $stmt->execute([$id]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    return Flight::json($item);
});

// Add a new inventory item
Flight::route('POST /items', function () {
    $data = Flight::request()->data->getData();

    // Basic validation (you can expand this)
    if (empty($data['name']) || empty($data['quantity']) || empty($data['price'])) {
        Flight::json(['error' => 'Name, quantity, and price are required.'], 422);
        return;
    }

    // Insert data into the database
    $stmt = Flight::db()->prepare('INSERT INTO inventory_items (name, quantity, price, description) VALUES (?, ?, ?, ?)');
    $stmt->execute([
        $data['name'],
        $data['quantity'],
        $data['price'],
        $data['description'] ?? null // Optional field
    ]);
    Flight::json(['message' => 'Item added successfully']);
});

// Update an inventory item by ID
Flight::route('PUT /items/@id', function ($id) {
    $data = Flight::request()->data->getData();

    // Basic validation (you can expand this)
    if (empty($data['name']) || empty($data['quantity']) || empty($data['price'])) {
        Flight::json(['error' => 'Name, quantity, and price are required.'], 422);
        return;
    }

    // Update the inventory item in the database
    $stmt = Flight::db()->prepare('UPDATE inventory_items SET name = ?, quantity = ?, price = ?, description = ? WHERE id = ?');
    $stmt->execute([
        $data['name'],
        $data['quantity'],
        $data['price'],
        $data['description'] ?? null, // Optional field
        $id
    ]);
    Flight::json(['message' => 'Item updated successfully']);
});

// Delete an inventory item by ID
Flight::route('DELETE /items/@id', function ($id) {
    $stmt = Flight::db()->prepare('DELETE FROM inventory_items WHERE id = ?');
    $stmt->execute([$id]);
    Flight::json(['message' => 'Item deleted successfully']);
});

// Start the framework
Flight::start();
