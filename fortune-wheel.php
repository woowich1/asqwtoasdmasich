<?php
/*
Plugin Name: Колесо Фортуны
Description: Плагин для отображения стильного колеса фортуны с поддержкой лид-форм.
Version: 5.6
Author: Вувич
*/

if (!defined('ABSPATH')) exit;

define('FORTUNE_WHEEL_PATH', plugin_dir_path(__FILE__));
define('FORTUNE_WHEEL_URL', plugin_dir_url(__FILE__));

// Подключаем файлы
require_once FORTUNE_WHEEL_PATH . 'admin/admin.php';
require_once FORTUNE_WHEEL_PATH . 'includes/shortcode.php';
require_once FORTUNE_WHEEL_PATH . 'includes/ajax-handler.php';

// Регистрируем скрипты и стили
function fortune_wheel_enqueue_scripts() {
    wp_enqueue_style('fortune-wheel-style', FORTUNE_WHEEL_URL . 'public/css/style.css', array(), '1.0.0');
    wp_enqueue_script('react');
    wp_enqueue_script('react-dom');
    wp_enqueue_script('fortune-wheel-script', FORTUNE_WHEEL_URL . 'public/js/wheel.js', array('react', 'react-dom'), '1.0.0', true);
    wp_enqueue_script('fortune-wheel-form', FORTUNE_WHEEL_URL . 'public/js/form.js', array('react', 'react-dom'), '1.0.0', true);
    
    wp_localize_script('fortune-wheel-script', 'fortuneWheelAjax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('fortune-wheel-nonce')
    ));
}
add_action('wp_enqueue_scripts', 'fortune_wheel_enqueue_scripts');

// Активация плагина
function fortune_wheel_activate() {
    // Создаем таблицу для хранения участников
    global $wpdb;
    $table_name = $wpdb->prefix . 'fortune_wheel_participants';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        name varchar(100) NOT NULL,
        phone varchar(15) NOT NULL,
        prize varchar(255) NOT NULL,
        ip varchar(45) NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'fortune_wheel_activate');

// Деактивация плагина
function fortune_wheel_deactivate() {
    // Очистка данных, если необходимо
}
register_deactivation_hook(__FILE__, 'fortune_wheel_deactivate');

