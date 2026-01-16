<?php
// ============================================================================
// DATABASE FUNCTIONS - FIXED VERSION
// ============================================================================

function getDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
    }
    $conn->set_charset("utf8mb4");
    return $conn;
}
function getPDO() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ]);
    }
    return $pdo;
}


function registerUser($email, $password, $fullName, $userType, $phone, $address, $city) {
    $conn = getDB();
    
    // Check if email already exists
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows > 0) {
        $checkStmt->close();
        $conn->close();
        return ['success' => false, 'error' => 'Email already registered'];
    }
    $checkStmt->close();
    
    $hashedPass = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $conn->prepare(
        "INSERT INTO users (email, password, full_name, user_type, phone_number, address, city, rating, total_reviews)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)"
    );
    
    if (!$stmt) {
        $conn->close();
        return ['success' => false, 'error' => 'Prepare failed: ' . $conn->error];
    }
    
    $stmt->bind_param("sssssss", $email, $hashedPass, $fullName, $userType, $phone, $address, $city);
    
    if ($stmt->execute()) {
        $userId = $conn->insert_id;
        $stmt->close();
        $conn->close();
        return ['success' => true, 'user_id' => $userId];
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        return ['success' => false, 'error' => 'Registration failed: ' . $error];
    }
}

function loginUser($email, $password) {
    $conn = getDB();
    $stmt = $conn->prepare("SELECT id, email, full_name, user_type, password, rating, total_reviews, phone_number, address, city FROM users WHERE email = ?");
    
    if (!$stmt) {
        $conn->close();
        return ['error' => 'Database error: ' . $conn->error];
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            unset($user['password']);
            $stmt->close();
            $conn->close();
            return ['success' => true, 'user' => $user];
        }
    }
    
    $stmt->close();
    $conn->close();
    return ['success' => false, 'error' => 'Invalid email or password'];
}

function getUserById($userId) {
    $conn = getDB();
    $stmt = $conn->prepare("
        SELECT id,
               email,
               full_name,
               user_type,
               phone_number,
               address,
               city,
               rating,
               total_reviews,
               profile_image      -- <== ADD THIS COLUMN
        FROM users
        WHERE id = ?
    ");

    if (!$stmt) {
        $conn->close();
        return null;
    }

    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    $stmt->close();
    $conn->close();

    return $user;
}


function createListing($buyerId, $fishSpecies, $quantityKg, $pricePerKg, $deliveryDate, $fishImage = null) {
    $conn = getDB();
    
    $quantityKg = (float) $quantityKg;
    $pricePerKg = (float) $pricePerKg;
    $totalPrice = $quantityKg * $pricePerKg;
    
    $stmt = $conn->prepare(
        "INSERT INTO listings (buyer_id, fish_species, quantity_kg, price_per_kg, total_price, fish_image, delivery_date, status, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NOW())"
    );
    
    if (!$stmt) {
        $conn->close();
        return ['success' => false, 'error' => 'Prepare failed: ' . $conn->error];
    }
    
    $stmt->bind_param("isdddss", $buyerId, $fishSpecies, $quantityKg, $pricePerKg, $totalPrice, $fishImage, $deliveryDate);
    
    if ($stmt->execute()) {
        $listingId = $conn->insert_id;
        $stmt->close();
        $conn->close();
        return ['success' => true, 'listing_id' => $listingId];
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        return ['success' => false, 'error' => 'Failed to create listing: ' . $error];
    }
}

function getAllListings() {
    $conn = getDB();
    
    $query = "SELECT l.id, l.buyer_id, l.fish_species, l.quantity_kg, l.price_per_kg, l.total_price, l.fish_image, l.delivery_date, l.status, l.created_at, u.full_name, u.city, u.rating 
              FROM listings l 
              JOIN users u ON l.buyer_id = u.id 
              WHERE l.status = 'active' 
              ORDER BY l.created_at DESC";
    
    $result = $conn->query($query);
    $listings = [];
    
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $listings[] = $row;
        }
    }
    
    $conn->close();
    return $listings;
}

function getListingById($listingId) {
    $conn = getDB();
    
    $stmt = $conn->prepare(
        "SELECT l.id, l.buyer_id, l.fish_species, l.quantity_kg, l.price_per_kg, l.total_price, l.fish_image, l.delivery_date, l.status, l.created_at, u.full_name, u.phone_number, u.city, u.rating 
         FROM listings l 
         JOIN users u ON l.buyer_id = u.id 
         WHERE l.id = ?"
    );
    
    if (!$stmt) {
        $conn->close();
        return null;
    }
    
    $stmt->bind_param("i", $listingId);
    $stmt->execute();
    $result = $stmt->get_result();
    $listing = $result->fetch_assoc();
    
    $stmt->close();
    $conn->close();
    
    return $listing;
}

function getUserListings($userId) {
    $conn = getDB();
    
    $stmt = $conn->prepare("SELECT id, buyer_id, fish_species, quantity_kg, price_per_kg, total_price, fish_image, delivery_date, status, created_at FROM listings WHERE buyer_id = ? ORDER BY created_at DESC");
    
    if (!$stmt) {
        $conn->close();
        return [];
    }
    
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $listings = [];
    
    while ($row = $result->fetch_assoc()) {
        $listings[] = $row;
    }
    
    $stmt->close();
    $conn->close();
    
    return $listings;
}

function deleteListing($listingId, $userId) {
    $conn = getDB();
    
    $stmt = $conn->prepare("UPDATE listings SET status = 'cancelled' WHERE id = ? AND buyer_id = ?");
    
    if (!$stmt) {
        $conn->close();
        return ['success' => false, 'error' => 'Prepare failed'];
    }
    
    $stmt->bind_param("ii", $listingId, $userId);
    $success = $stmt->execute();
    
    $stmt->close();
    $conn->close();
    
    return $success ? ['success' => true] : ['success' => false, 'error' => 'Failed to delete listing'];
}

// db.php
function sendMessage($senderId, $receiverId, $listingId, $messageText, $imagePath = null) {
    $conn = getDB();

    $stmt = $conn->prepare(
        "INSERT INTO messages (sender_id, receiver_id, listing_id, message_text, image_path, is_read, created_at)
         VALUES (?, ?, ?, ?, ?, 0, NOW())"
    );
    if (!$stmt) {
        $conn->close();
        return ['success' => false, 'error' => 'Prepare failed: ' . $conn->error];
    }

    // listingId can be null
    $listingId = $listingId ?? null;

    $stmt->bind_param("iiiss", $senderId, $receiverId, $listingId, $messageText, $imagePath);
    $success = $stmt->execute();
    $stmt->close();
    $conn->close();

    return ['success' => $success ? true : false, 'error' => $success ? null : 'Failed to send message'];
}


function getConversation($me, $other) {
    $conn = getDB();

    $sql = "
        SELECT m.*
        FROM messages m
        WHERE 
            (m.sender_id = ? AND m.receiver_id = ?)
            OR
            (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.created_at ASC
    ";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        $conn->close();
        return [];
    }

    // me→other and other→me
    $stmt->bind_param("iiii", $me, $other, $other, $me);
    $stmt->execute();

    $result = $stmt->get_result();
    $messages = $result->fetch_all(MYSQLI_ASSOC);

    $stmt->close();
    $conn->close();

    return $messages;
}

function getInbox($me) {
    $conn = getDB();

    $sql = "
        SELECT
            u.id AS user_id,
            u.full_name,
            u.profile_image,  -- must be here
            u.is_verified,
            MAX(m.created_at) AS last_created_at,
            SUBSTRING_INDEX(
                GROUP_CONCAT(m.message_text ORDER BY m.created_at DESC SEPARATOR '|||'),
                '|||',
                1
            ) AS last_message,
            SUM(
                CASE
                    WHEN m.receiver_id = ? AND m.is_read = 0
                    THEN 1 ELSE 0
                END
            ) AS unread_count
        FROM messages m
        JOIN users u
          ON (u.id = m.sender_id AND m.receiver_id = ?)
          OR (u.id = m.receiver_id AND m.sender_id = ?)
        WHERE m.sender_id = ? OR m.receiver_id = ?
        GROUP BY u.id
        ORDER BY last_created_at DESC
    ";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        $conn->close();
        return [];
    }

    $stmt->bind_param("iiiii", $me, $me, $me, $me, $me);
    $stmt->execute();
    $result = $stmt->get_result();
    $inbox = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();

    return $inbox;
}




function markMessagesAsRead($userId, $senderId) {
    $conn = getDB();

    $stmt = $conn->prepare("
        UPDATE messages 
        SET is_read = 1 
        WHERE receiver_id = ? AND sender_id = ?
    ");

    if (!$stmt) {
        $conn->close();
        return false;
    }

    $stmt->bind_param("ii", $userId, $senderId);
    $success = $stmt->execute();

    $stmt->close();
    $conn->close();

    return $success;
}


function createTransaction($buyerId, $fishermenId, $listingId, $amount) {
    $conn = getDB();
    
    $stmt = $conn->prepare("INSERT INTO transactions (buyer_id, fisherman_id, listing_id, amount, status, created_at) VALUES (?, ?, ?, ?, 'pending', NOW())");
    
    if (!$stmt) {
        $conn->close();
        return ['success' => false, 'error' => 'Prepare failed'];
    }
    
    $stmt->bind_param("iiid", $buyerId, $fishermenId, $listingId, $amount);
    $success = $stmt->execute();
    
    $stmt->close();
    $conn->close();
    
    return $success ? ['success' => true] : ['success' => false, 'error' => 'Failed to create transaction'];
}

function getUserTransactions($userId) {
    $conn = getDB();
    
    $stmt = $conn->prepare(
        "SELECT t.id, t.buyer_id, t.fisherman_id, t.listing_id, t.amount, t.status, t.created_at, l.fish_species, l.quantity_kg, u.full_name 
         FROM transactions t 
         JOIN listings l ON t.listing_id = l.id 
         JOIN users u ON u.id = CASE WHEN t.buyer_id = ? THEN t.fisherman_id ELSE t.buyer_id END
         WHERE t.buyer_id = ? OR t.fisherman_id = ?
         ORDER BY t.created_at DESC"
    );
    
    if (!$stmt) {
        $conn->close();
        return [];
    }
    
    $stmt->bind_param("iii", $userId, $userId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $transactions = [];
    
    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }
    
    $stmt->close();
    $conn->close();
    
    return $transactions;
}

function submitReview($reviewerId, $reviewedUserId, $rating, $comment, $transactionId = null) {
    $conn = getDB();

    // 1) prevent duplicate review from same reviewer to same user
    $check = $conn->prepare(
        "SELECT id FROM reviews WHERE reviewer_id = ? AND reviewed_user_id = ? LIMIT 1"
    );
    if ($check) {
        $check->bind_param("ii", $reviewerId, $reviewedUserId);
        $check->execute();
        $res = $check->get_result();
        if ($res && $res->num_rows > 0) {
            $check->close();
            $conn->close();
            return [
                'success' => false,
                'error'   => 'You have already rated this user.',
            ];
        }
        $check->close();
    }

    // 2) insert new review
    $stmt = $conn->prepare(
        "INSERT INTO reviews (reviewer_id, reviewed_user_id, rating, comment, transaction_id, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())"
    );
    if (!$stmt) {
        $conn->close();
        return ['success' => false, 'error' => 'Prepare failed: ' . $conn->error];
    }

    $stmt->bind_param("iiisi", $reviewerId, $reviewedUserId, $rating, $comment, $transactionId);

    if ($stmt->execute()) {
        $stmt->close();

        // 3) update fisherman's rating summary
        $ratingStmt = $conn->prepare(
            "UPDATE users
             SET rating = (SELECT AVG(rating) FROM reviews WHERE reviewed_user_id = ?),
                 total_reviews = (SELECT COUNT(*) FROM reviews WHERE reviewed_user_id = ?)
             WHERE id = ?"
        );
        if ($ratingStmt) {
            $ratingStmt->bind_param("iii", $reviewedUserId, $reviewedUserId, $reviewedUserId);
            $ratingStmt->execute();
            $ratingStmt->close();
        }

        $conn->close();
        return ['success' => true];
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        return ['success' => false, 'error' => 'Failed to submit review. ' . $error];
    }
}
function createNotification($userId, $type, $message) {
    $conn = getDB();
    $stmt = $conn->prepare(
        "INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)"
    );
    if (!$stmt) {
        $conn->close();
        return false;
    }
    $stmt->bind_param("iss", $userId, $type, $message);
    $ok = $stmt->execute();
    $stmt->close();
    $conn->close();
    return $ok;
}
function getPublicProfile($userId) {
    $conn = getDB();

    $sql = "
        SELECT
            u.id,
            u.email,
            u.full_name,
            u.user_type,
            u.phone_number,
            u.address,
            u.city,
            u.profile_image,
            u.is_verified,              -- important for the badge
            u.rating,
            u.total_reviews
        FROM users u
        WHERE u.id = ?
        LIMIT 1
    ";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        $conn->close();
        return null;
    }

    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $res  = $stmt->get_result();
    $user = $res->fetch_assoc();

    $stmt->close();
    $conn->close();

    return $user ?: null;
}

function getNotifications($userId) {
    $conn = getDB();
    $stmt = $conn->prepare(
        "SELECT id, type, message, is_read, created_at
         FROM notifications
         WHERE user_id = ?
         ORDER BY created_at DESC"
    );
    if (!$stmt) {
        $conn->close();
        return [];
    }
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $res = $stmt->get_result();
    $rows = $res->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();
    return $rows;
}

function markNotificationRead($userId, $notificationId) {
    $conn = getDB();
    $stmt = $conn->prepare(
        "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?"
    );
    if (!$stmt) {
        $conn->close();
        return false;
    }
    $stmt->bind_param("ii", $notificationId, $userId);
    $ok = $stmt->execute();
    $stmt->close();
    $conn->close();
    return $ok;
}



function getUserReviews($userId) {
    $conn = getDB();
    
    $stmt = $conn->prepare(
        "SELECT r.id, r.rating, r.comment, r.created_at, u.full_name 
         FROM reviews r 
         JOIN users u ON r.reviewer_id = u.id 
         WHERE r.reviewed_user_id = ? 
         ORDER BY r.created_at DESC"
    );
    
    if (!$stmt) {
        $conn->close();
        return [];
    }
    
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $reviews = [];
    
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }
    
    $stmt->close();
    $conn->close();
    
    return $reviews;
}

function updateProfile($userId, $fullName, $phone, $address, $city, $profileImage = null) {
    $conn = getDB();
    
    if ($profileImage) {
        $stmt = $conn->prepare("UPDATE users SET full_name = ?, phone_number = ?, address = ?, city = ?, profile_image = ? WHERE id = ?");
        
        if (!$stmt) {
            $conn->close();
            return ['success' => false, 'error' => 'Prepare failed'];
        }
        
        $stmt->bind_param("sssssi", $fullName, $phone, $address, $city, $profileImage, $userId);
    } else {
        $stmt = $conn->prepare("UPDATE users SET full_name = ?, phone_number = ?, address = ?, city = ? WHERE id = ?");
        
        if (!$stmt) {
            $conn->close();
            return ['success' => false, 'error' => 'Prepare failed'];
        }
        
        $stmt->bind_param("ssssi", $fullName, $phone, $address, $city, $userId);
    }
    
    $success = $stmt->execute();
    $stmt->close();
    $conn->close();
    
    return $success ? ['success' => true] : ['success' => false, 'error' => 'Failed to update profile'];
}
function completeTransaction(int $id, int $userId): bool
{
    $conn = getDB();

    $sql = "
        UPDATE transactions
        SET status = 'completed'
        WHERE id = ?
          AND (buyer_id = ? OR fisherman_id = ?)
    ";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        $conn->close();
        return false;
    }

    $stmt->bind_param('iii', $id, $userId, $userId);
    $ok = $stmt->execute();

    $stmt->close();
    $conn->close();

    return $ok;
}

function cancelTransaction(int $id, int $userId): bool
{
    $conn = getDB();

    $sql = "
        UPDATE transactions
        SET status = 'cancelled'
        WHERE id = ?
          AND buyer_id = ?
          AND status = 'pending'
    ";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        $conn->close();
        return false;
    }

    $stmt->bind_param('ii', $id, $userId);
    $ok = $stmt->execute();

    $stmt->close();
    $conn->close();

    return $ok;
}


?>