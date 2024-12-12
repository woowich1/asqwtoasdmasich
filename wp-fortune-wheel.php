<?php
/*
Plugin Name: Колесо Фортуны
Description: Плагин для отображения стильного колеса фортуны с поддержкой лид-форм.
Version: 5.6
Author: Вувич
*/
if (!defined('ABSPATH')) exit;

require_once plugin_dir_path(__FILE__) . 'admin/settings-page.php';
require_once plugin_dir_path(__FILE__) . 'includes/shortcode.php';
require_once plugin_dir_path(__FILE__) . 'includes/ajax-handler.php';

// Enqueue necessary scripts and styles
function wfw_enqueue_scripts() {
    // Enqueue React and ReactDOM from WordPress
    wp_enqueue_script('react', 'https://unpkg.com/react@18/umd/react.production.min.js', array(), '18.2.0', true);
    wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', array('react'), '18.2.0', true);
    
    // Enqueue our plugin scripts
    wp_enqueue_style('wfw-styles', plugins_url('assets/css/style.css', __FILE__));
    wp_enqueue_script('wfw-frontend', plugins_url('assets/js/frontend.bundle.js', __FILE__), array('react', 'react-dom'), '1.1', true);
    
    // Localize script
    $prizes = get_option('wfw_prizes', array());
    $probabilities = get_option('wfw_probabilities', array());
    $texts = get_option('wfw_texts', array());
    
    wp_localize_script('wfw-frontend', 'wfwData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('wfw_nonce'),
        'prizes' => $prizes,
        'probabilities' => $probabilities,
        'texts' => $texts
    ));
}
add_action('wp_enqueue_scripts', 'wfw_enqueue_scripts');

// Enqueue admin scripts
function wfw_admin_enqueue_scripts($hook) {
    if ('toplevel_page_fortune-wheel-settings' !== $hook) {
        return;
    }
    
    // Enqueue React and ReactDOM
    wp_enqueue_script('react', 'https://unpkg.com/react@18/umd/react.production.min.js', array(), '18.2.0', true);
    wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', array('react'), '18.2.0', true);
    
    // Enqueue admin scripts
    wp_enqueue_style('wfw-admin-styles', plugins_url('assets/css/admin-style.css', __FILE__));
    wp_enqueue_script('wfw-admin', plugins_url('assets/js/admin.bundle.js', __FILE__), array('react', 'react-dom'), '1.1', true);
    
    // Localize admin script
    $prizes = get_option('wfw_prizes', array());
    $probabilities = get_option('wfw_probabilities', array());
    
    wp_localize_script('wfw-admin', 'wfwAdminData', array(
        'prizes' => $prizes,
        'probabilities' => $probabilities
    ));
}
add_action('admin_enqueue_scripts', 'wfw_admin_enqueue_scripts');

// Register admin menu
function wfw_admin_menu() {
    add_menu_page(
        'Fortune Wheel Settings',
        'Fortune Wheel',
        'manage_options',
        'fortune-wheel-settings',
        'wfw_settings_page',
        'dashicons-marker'
    );
}
add_action('admin_menu', 'wfw_admin_menu');

// Create database table on plugin activation
function wfw_activate() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'fortune_wheel_leads';
    
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        name varchar(100) NOT NULL,
        phone varchar(20) NOT NULL,
        prize varchar(255) NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'wfw_activate');
add_action('admin_footer', function() {
    if (isset($_GET['page']) && $_GET['page'] === 'fortune-wheel-settings') {
        echo '<script>console.log("Admin data:", window.wfwAdminData);</script>';
    }
});

