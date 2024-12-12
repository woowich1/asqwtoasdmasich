<?php
function wfw_handle_form_submission() {
    check_ajax_referer('wfw_nonce', 'nonce');
    
    $name = sanitize_text_field($_POST['name']);
    $phone = sanitize_text_field($_POST['phone']);
    $prize = sanitize_text_field($_POST['prize']);
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'fortune_wheel_leads';
    
    $result = $wpdb->insert(
        $table_name,
        array(
            'name' => $name,
            'phone' => $phone,
            'prize' => $prize
        ),
        array('%s', '%s', '%s')
    );
    
    if ($result) {
        wp_send_json_success('Lead saved successfully');
    } else {
        wp_send_json_error('Error saving lead');
    }
}
add_action('wp_ajax_wfw_submit_form', 'wfw_handle_form_submission');
add_action('wp_ajax_nopriv_wfw_submit_form', 'wfw_handle_form_submission');

function wfw_localize_script_data() {
    $prizes = get_option('wfw_prizes', array());
    $probabilities = get_option('wfw_probabilities', array());
    $texts = get_option('wfw_texts', array());
    
    wp_localize_script('wfw-react', 'wfwData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('wfw_nonce'),
        'prizes' => $prizes,
        'probabilities' => $probabilities,
        'texts' => $texts
    ));
}
add_action('wp_enqueue_scripts', 'wfw_localize_script_data');

function wfw_localize_admin_script_data() {
    $prizes = get_option('wfw_prizes', array());
    $probabilities = get_option('wfw_probabilities', array());
    
    wp_localize_script('wfw-admin-script', 'wfwAdminData', array(
        'prizes' => $prizes,
        'probabilities' => $probabilities
    ));
}
add_action('admin_enqueue_scripts', 'wfw_localize_admin_script_data');

