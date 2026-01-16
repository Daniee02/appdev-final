<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// allow mobile app (development) – for now use *
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');

session_start();

require_once 'config.php';
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

$action = isset($_GET['action']) ? $_GET['action'] : '';

// ============================================================================
// REGISTER
// ============================================================================
if ($action === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['email']) || !isset($data['password']) || !isset($data['fullName']) || !isset($data['userType'])) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Invalid email format']);
        exit;
    }

    if (strlen($data['password']) < 6) {
        echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters']);
        exit;
    }

    if (!in_array($data['userType'], ['buyer', 'fisherman'])) {
        echo json_encode(['success' => false, 'error' => 'Invalid user type']);
        exit;
    }

    $result = registerUser(
        $data['email'],
        $data['password'],
        $data['fullName'],
        $data['userType'],
        $data['phone'] ?? '',
        $data['address'] ?? '',
        $data['city'] ?? ''
    );

    echo json_encode($result);
}

// ============================================================================
// LOGIN
// ============================================================================
else if ($action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['email']) || !isset($data['password'])) {
        echo json_encode(['success' => false, 'error' => 'Email and password required']);
        exit;
    }

    $result = loginUser($data['email'], $data['password']);

    if (!empty($result['success'])) {
        $_SESSION['user_id']   = $result['user']['id'];
        $_SESSION['user_type'] = $result['user']['user_type'];
    }

    echo json_encode($result);
}

// ============================================================================
// LOGOUT
// ============================================================================
else if ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
}

// ============================================================================
// PROFILE
// ============================================================================
else if ($action === 'profile') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $user = getUserById($_SESSION['user_id']);
    echo json_encode($user ? $user : ['error' => 'User not found']);
}

// ============================================================================
// CREATE LISTING
// ============================================================================
else if ($action === 'createlisting') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }
    if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'buyer') {
        echo json_encode(['success' => false, 'error' => 'Only buyers can create listings']);
        exit;
    }

    $fishSpecies  = $_POST['fishSpecies']  ?? null;
    $quantityKg   = $_POST['quantityKg']   ?? null;
    $pricePerKg   = $_POST['pricePerKg']   ?? null;
    $deliveryDate = $_POST['deliveryDate'] ?? null;

    if (!$fishSpecies || !$quantityKg || !$pricePerKg || !$deliveryDate) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }

    $imageFile = null;
    if (isset($_FILES['fishImage']) && $_FILES['fishImage']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = UPLOAD_DIR;
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileName   = 'fish_' . time() . '_' . basename($_FILES['fishImage']['name']);
        $uploadFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['fishImage']['tmp_name'], $uploadFile)) {
            $imageFile = $uploadFile;
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to upload image']);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Image file required']);
        exit;
    }

    $result = createListing(
        $_SESSION['user_id'],
        $fishSpecies,
        $quantityKg,
        $pricePerKg,
        $deliveryDate,
        $imageFile
    );

    echo json_encode($result);
}

// ============================================================================
// GET ALL LISTINGS
// ============================================================================
else if ($action === 'getlistings') {
    $listings = getAllListings();
    echo json_encode($listings);
}

// ============================================================================
// GET SINGLE LISTING
// ============================================================================
else if ($action === 'getlisting') {
    $listingId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($listingId <= 0) {
        echo json_encode(['success' => false, 'error' => 'Invalid listing ID']);
        exit;
    }

    $listing = getListingById($listingId);
    echo json_encode($listing ? $listing : ['success' => false, 'error' => 'Listing not found']);
}

// ============================================================================
// GET MY LISTINGS
// ============================================================================
else if ($action === 'getmylistings') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $listings = getUserListings($_SESSION['user_id']);
    echo json_encode($listings);
}

// ============================================================================
// DELETE LISTING
// ============================================================================
else if ($action === 'deletelisting') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $listingId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($listingId <= 0) {
        echo json_encode(['success' => false, 'error' => 'Invalid listing ID']);
        exit;
    }

    $result = deleteListing($listingId, $_SESSION['user_id']);
    echo json_encode($result);
}

// ============================================================================
// SEND MESSAGE
// ============================================================================
else if ($action === 'sendmessage') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['receiverId'])) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }

        $receiverId = (int)$data['receiverId'];
    $listingId  = isset($data['listingId']) ? (int)$data['listingId'] : null;
    $imagePath  = $data['imagePath'] ?? null;

    $result = sendMessage(
        $_SESSION['user_id'],   // sender
        $receiverId,            // receiver
        $listingId,
        $data['messageText'],
        $imagePath
    );

    if (!empty($result['success'])) {
        // create notification for the receiver (buyer or fisherman)
        createNotification(
            $receiverId,
            'new_message',
            'You have a new message.'
        );
    }

    echo json_encode($result);
}



// ============================================================================
// GET MESSAGES (conversation with one user)
// ============================================================================
else if ($action === 'getmessages') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $userId = isset($_GET['userid']) ? (int) $_GET['userid'] : 0;

    if ($userId <= 0) {
        echo json_encode(['success' => false, 'error' => 'Invalid user ID']);
        exit;
    }

    $currentUserId = (int) $_SESSION['user_id'];

    markMessagesAsRead($currentUserId, $userId);
    $messages = getConversation($currentUserId, $userId);

    echo json_encode($messages);
}

// ============================================================================
// GET INBOX (list of conversations)
// ============================================================================
else if ($action === 'getinbox') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $conversations = getInbox($_SESSION['user_id']);
    echo json_encode($conversations);
}

// ============================================================================
// CREATE ORDER
// ============================================================================
else if ($action === 'createorder') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['listingId']) || !isset($data['amount'])) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }

    $listing = getListingById((int) $data['listingId']);

    if (!$listing) {
        echo json_encode(['success' => false, 'error' => 'Listing not found']);
        exit;
    }

    $result = createTransaction(
        $listing['buyer_id'],
        $_SESSION['user_id'],
        (int) $data['listingId'],
        (float) $data['amount']
    );

    echo json_encode($result);
}

// ============================================================================
// GET TRANSACTIONS
// ============================================================================
else if ($action === 'gettransactions') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $transactions = getUserTransactions($_SESSION['user_id']);
    echo json_encode($transactions);
}

// ============================================================================
// DELETE TRANSACTION
// ============================================================================
else if ($action === 'deletetransaction') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id <= 0) {
        echo json_encode(['success' => false, 'error' => 'Invalid transaction ID']);
        exit;
    }

    $conn = getDB();

    $stmt = $conn->prepare(
        "DELETE FROM transactions WHERE id = ? AND (buyer_id = ? OR fisherman_id = ?)"
    );

    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => 'Database error']);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $stmt->bind_param("iii", $id, $userId, $userId);
    $success = $stmt->execute();

    $stmt->close();
    $conn->close();

    echo json_encode(['success' => $success ? true : false]);
}

// ============================================================================
// SUBMIT REVIEW
// ============================================================================
else if ($action === 'submitreview') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (
        !$data ||
        !isset($data['reviewedUserId']) ||
        !isset($data['rating']) ||
        !isset($data['comment'])
    ) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }

    $rating = (int)$data['rating'];
    if ($rating < 1 || $rating > 5) {
        echo json_encode(['success' => false, 'error' => 'Rating must be between 1 and 5']);
        exit;
    }

    $result = submitReview(
        $_SESSION['user_id'],                                      // <- use user_id
        (int)$data['reviewedUserId'],
        $rating,
        $data['comment'],
        isset($data['transactionId']) ? (int)$data['transactionId'] : null
    );

    echo json_encode($result);
}

// in api.php
else if ($action === 'getpublicprofile') {
    $userId = isset($_GET['userid']) ? (int) $_GET['userid'] : 0;
    if ($userId <= 0) {
        echo json_encode(['success' => false, 'error' => 'Invalid user ID']);
        exit;
    }

    $user = getPublicProfile($userId);
    if (!$user) {
        echo json_encode(null);
    } else {
        echo json_encode($user);
    }
}


else if ($action === 'getnotifications') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }
    $rows = getNotifications($_SESSION['user_id']);
    echo json_encode($rows);
}

else if ($action === 'readnotification') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['id'])) {
        echo json_encode(['success' => false, 'error' => 'Missing id']);
        exit;
    }
    $ok = markNotificationRead($_SESSION['user_id'], (int)$data['id']);
    echo json_encode(['success' => $ok ? true : false]);
}

// ============================================================================
// GET REVIEWS
// ============================================================================
else if ($action === 'getreviews') {
    $userId = isset($_GET['userid']) ? (int) $_GET['userid'] : 0;

    if ($userId <= 0) {
        echo json_encode(['success' => false, 'error' => 'Invalid user ID']);
        exit;
    }

    $reviews = getUserReviews($userId);
    echo json_encode($reviews);
}
// ================= UPDATE PROFILE =================
else if ($action === 'updateprofile') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $fullName = $_POST['fullName'] ?? null;
    $phone    = $_POST['phone'] ?? null;
    $address  = $_POST['address'] ?? null;
    $city     = $_POST['city'] ?? null;

    if (!$fullName || !$phone || !$address || !$city) {
        echo json_encode(['success' => false, 'error' => 'All fields are required']);
        exit;
    }

    // handle optional profile image
    $profileImage = null;
    if (!empty($_FILES['profileImage']['name'])) {
        $uploadDir = __DIR__ . '/uploads/profile';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $ext = pathinfo($_FILES['profileImage']['name'], PATHINFO_EXTENSION);
        $fileName = 'profile_' . time() . '_' . mt_rand(1000, 9999) . '.' . $ext;
        $target = $uploadDir . '/' . $fileName;

        if (move_uploaded_file($_FILES['profileImage']['tmp_name'], $target)) {
            // relative path saved in DB, used by PublicProfileScreen
            $profileImage = 'uploads/profile/' . $fileName;
        }
    }

    $result = updateProfile($_SESSION['user_id'], $fullName, $phone, $address, $city, $profileImage);
    echo json_encode($result);
}



// ============================================================================
// ADD BUYER REQUEST
// ============================================================================
else if ($action === 'addrequest') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'not_logged_in']);
        exit;
    }

    $buyer_id = $_SESSION['user_id'];

    $fish  = trim($_POST['fish_species'] ?? '');
    $qty   = (float) ($_POST['quantity_kg'] ?? 0);
    $price = (float) ($_POST['desired_price_per_kg'] ?? 0);
    $city  = trim($_POST['city'] ?? '');
    $notes = trim($_POST['notes'] ?? '');

    if ($fish === '' || $qty <= 0 || $price <= 0 || $city === '') {
        echo json_encode(['success' => false, 'error' => 'missing_fields']);
        exit;
    }

    $imagePath = null;
    if (!empty($_FILES['image']['name'])) {
        $uploadDir = __DIR__ . '/../uploads/requests/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $ext      = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $fileName = 'req_' . time() . '_' . mt_rand(1000, 9999) . '.' . $ext;
        $target   = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
            $imagePath = 'uploads/requests/' . $fileName;
        }
    }

    $pdo = getPDO();

    $stmt = $pdo->prepare("
        INSERT INTO buyer_requests
          (buyer_id, fish_species, quantity_kg, desired_price_per_kg, city, notes, image_path)
        VALUES
          (:buyer_id, :fish, :qty, :price, :city, :notes, :image)
    ");
    $ok = $stmt->execute([
        ':buyer_id' => $buyer_id,
        ':fish'     => $fish,
        ':qty'      => $qty,
        ':price'    => $price,
        ':city'     => $city,
        ':notes'    => $notes,
        ':image'    => $imagePath,
    ]);

    echo json_encode(['success' => $ok]);
}

// ============================================================================
// GET REQUESTS
// ============================================================================
else if ($action === 'getrequests') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'not_logged_in']);
        exit;
    }

    $pdo = getPDO();

    $stmt = $pdo->query("
        SELECT br.*, u.full_name AS buyer_name
        FROM buyer_requests br
        JOIN users u ON br.buyer_id = u.id
        WHERE br.status = 'open'
        ORDER BY br.created_at DESC
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($rows);
}
// ============================================================================
// GET TOTAL UNREAD MESSAGES
// ============================================================================
else if ($action === 'getunreadtotal') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $userId = (int) $_SESSION['user_id'];

    $conn = getDB();
    if (!$conn) {
        echo json_encode(['success' => false, 'error' => 'DB error']);
        exit;
    }

    $sql = "SELECT COUNT(*) AS unread_total
            FROM messages
            WHERE receiver_id = ? AND is_read = 0";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        $conn->close();
        echo json_encode(['success' => false, 'error' => 'DB error']);
        exit;
    }

    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    $conn->close();

    $total = (int)($res['unread_total'] ?? 0);
    echo json_encode(['success' => true, 'unread_total' => $total]);
}
// in api.php
// ============================================================================
// COMPLETE TRANSACTION
// ============================================================================
else if ($action === 'completetransaction') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        echo json_encode(['success' => false, 'error' => 'Invalid transaction ID']);
        exit;
    }

    require_once 'db.php';
    $userId = (int)$_SESSION['user_id'];

    $ok = completeTransaction($id, $userId); // function in db.php

    echo json_encode(['success' => $ok ? true : false]);
    exit;
}

// new action, same style as others
else if ($action === 'canceltransaction') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }

    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        echo json_encode(['success' => false, 'error' => 'Invalid transaction ID']);
        exit;
    }

    require_once 'db.php';
    $userId = (int)$_SESSION['user_id'];

    // You will create this in db.php
    $ok = cancelTransaction($id, $userId);

    echo json_encode(['success' => $ok ? true : false]);
    exit;
}



// ============================================================================
// UNKNOWN ACTION
// ============================================================================
else {
    echo json_encode(['success' => false, 'error' => 'Unknown action']);
}

?>
