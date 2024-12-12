<?php
if (!defined('ABSPATH')) exit;

function fortune_wheel_submit_form() {
    check_ajax_referer('fortune-wheel-nonce', 'nonce');

    $name = sanitize_text_field($_POST['name']);
    $phone = sanitize_text_field($_POST['phone']);
    $prize = sanitize_text_field($_POST['prize']);
    $ip = $_SERVER['REMOTE_ADDR'];

    global $wpdb;
    $table_name = $wpdb->prefix . 'fortune_wheel_participants';

    // Проверяем, участвовал ли уже этот IP или телефон
    $existing_entry = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE ip = %s OR phone = %s",
        $ip,
        $phone
    ));

    if ($existing_entry) {
        wp_send_json_error('Вы уже участвовали в розыгрыше.');
        return;
    }

    // Записываем нового участника
    $wpdb->insert(
        $table_name,
        array(
            'name' => $name,
            'phone' => $phone,
            'prize' => $prize,
            'ip' => $ip
        )
    );

    // Отправляем email
    $to = 'avtoshkolatomitch@yandex.ru';
    $subject = 'Новый участник Колеса Фортуны';
    $message = "Имя: $name\nТелефон: $phone\nПриз: $prize\n";
    wp_mail($to, $subject, $message);

    wp_send_json_success('Ваша заявка успешно отправлена!');
}
add_action('wp_ajax_fortune_wheel_submit_form', 'fortune_wheel_submit_form');
add_action('wp_ajax_nopriv_fortune_wheel_submit_form', 'fortune_wheel_submit_form');

