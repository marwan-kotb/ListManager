<?php
$action = $_GET['action'] ?? '';

if ($action === 'list') {
    $tasks = [];
    if (file_exists('tasks.json')) {
        $tasks = json_decode(file_get_contents('tasks.json'), true);
    }
    echo json_encode($tasks);
} elseif ($action === 'delete') {
    $index = $_GET['index'] ?? '';
    if ($index !== '') {
        $tasks = [];
        if (file_exists('tasks.json')) {
            $tasks = json_decode(file_get_contents('tasks.json'), true);
        }
        if (isset($tasks[$index])) {
            unset($tasks[$index]);
            $tasks = array_values($tasks);
            file_put_contents('tasks.json', json_encode($tasks));
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
    } else {
        echo json_encode(['success' => false]);
    }
} elseif ($action === 'sort') {
    $option = $_GET['option'] ?? 'dateAdded';
    $tasks = [];
    if (file_exists('tasks.json')) {
        $tasks = json_decode(file_get_contents('tasks.json'), true);
    }
    if ($option === 'title') {
        usort($tasks, function($a, $b) {
            return strcmp($a['title'], $b['title']);
        });
    } else {
        usort($tasks, function($a, $b) {
            return strtotime($a['dateAdded']) - strtotime($b['dateAdded']);
        });
    }
    echo json_encode($tasks);
} elseif ($action === 'filter') {
    $option = $_GET['option'] ?? '';
    $tasks = [];
    if (file_exists('tasks.json')) {
        $tasks = json_decode(file_get_contents('tasks.json'), true);
    }
    $filteredTasks = array_filter($tasks, function($task) use ($option) {
        return strpos(strtolower($task['title']), strtolower($option)) !== false;
    });
    echo json_encode(array_values($filteredTasks));
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'add') {
    $taskTitle = $_POST['taskTitle'] ?? '';
    if ($taskTitle !== '') {
        $tasks = [];
        if (file_exists('tasks.json')) {
            $tasks = json_decode(file_get_contents('tasks.json'), true);
        }
        $tasks[] = [
            'title' => $taskTitle,
            'dateAdded' => date('Y-m-d H:i:s')
        ];
        file_put_contents('tasks.json', json_encode($tasks));
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'edit') {
    
    $taskTitle = $_GET['taskTitle'] ?? '';
    $index = $_GET['index'] ?? '';
    
    if ($taskTitle !== '' && $index !== '') {
        $tasks = [];
        if (file_exists('tasks.json')) {
            $tasks = json_decode(file_get_contents('tasks.json'), true);
        }
        if (isset($tasks[$index])) {
            $tasks[$index]['title'] = $taskTitle;
            file_put_contents('tasks.json', json_encode($tasks));
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid index or task title']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Index or task title not provided']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}