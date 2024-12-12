<?php
if (!defined('ABSPATH')) exit;

function fortune_wheel_add_admin_menu() {
    add_menu_page(
        'Настройки Колеса Фортуны',
        'Колесо Фортуны',
        'manage_options',
        'fortune-wheel-settings',
        'fortune_wheel_settings_page',
        'dashicons-chart-pie',
        100
    );
}
add_action('admin_menu', 'fortune_wheel_add_admin_menu');

function fortune_wheel_settings_init() {
    register_setting('fortune_wheel', 'fortune_wheel_options');

    add_settings_section(
        'fortune_wheel_section',
        'Настройки секторов',
        'fortune_wheel_section_callback',
        'fortune-wheel-settings'
    );

    add_settings_field(
        'fortune_wheel_sectors',
        'Сектора',
        'fortune_wheel_sectors_callback',
        'fortune-wheel-settings',
        'fortune_wheel_section'
    );

    add_settings_field(
        'fortune_wheel_shortcode',
        'Шорткод',
        'fortune_wheel_shortcode_callback',
        'fortune-wheel-settings',
        'fortune_wheel_section'
    );
}
add_action('admin_init', 'fortune_wheel_settings_init');

function fortune_wheel_section_callback() {
    echo '<p>Настройте сектора колеса и их вероятности.</p>';
}

function fortune_wheel_sectors_callback() {
    $options = get_option('fortune_wheel_options');
    $sectors = isset($options['sectors']) ? $options['sectors'] : array();
    ?>
    <div id="fortune-wheel-sectors">
        <?php foreach ($sectors as $index => $sector) : ?>
            <div class="sector-row">
                <input type="text" name="fortune_wheel_options[sectors][<?php echo $index; ?>][name]" value="<?php echo esc_attr($sector['name']); ?>" placeholder="Название приза">
                <input type="number" name="fortune_wheel_options[sectors][<?php echo $index; ?>][probability]" value="<?php echo esc_attr($sector['probability']); ?>" placeholder="Вероятность" min="0" max="100">
                <input type="color" name="fortune_wheel_options[sectors][<?php echo $index; ?>][color]" value="<?php echo esc_attr($sector['color']); ?>">
                <button type="button" class="button remove-sector">Удалить</button>
            </div>
        <?php endforeach; ?>
    </div>
    <button type="button" class="button" id="add-sector">Добавить сектор</button>
    <div id="wheel-preview"></div>
    <?php
}

function fortune_wheel_shortcode_callback() {
    echo '<input type="text" value="[fortune_wheel]" readonly>';
    echo '<p>Используйте этот шорткод для вставки колеса на страницу или в пост.</p>';
}

function fortune_wheel_settings_page() {
    ?>
    <div class="wrap">
        <h1>Настройки Колеса Фортуны</h1>
        <form action="options.php" method="post">
            <?php
            settings_fields('fortune_wheel');
            do_settings_sections('fortune-wheel-settings');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

function fortune_wheel_admin_enqueue_scripts($hook) {
    if ('toplevel_page_fortune-wheel-settings' !== $hook) {
        return;
    }
    wp_enqueue_style('fortune-wheel-admin-style', FORTUNE_WHEEL_URL . 'admin/css/admin-style.css', array(), '1.0.0');
    wp_enqueue_script('fortune-wheel-admin-script', FORTUNE_WHEEL_URL . 'admin/js/admin-script.js', array('jquery'), '1.0.0', true);
    wp_localize_script('fortune-wheel-admin-script', 'fortuneWheelAdmin', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('fortune-wheel-admin-nonce')
    ));
}
add_action('admin_enqueue_scripts', 'fortune_wheel_admin_enqueue_scripts');

function fortune_wheel_update_sectors() {
    check_ajax_referer('fortune-wheel-admin-nonce', 'nonce');
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized');
    }

    $sectors = isset($_POST['sectors']) ? $_POST['sectors'] : array();
    $options = get_option('fortune_wheel_options', array());
    $options['sectors'] = $sectors;
    update_option('fortune_wheel_options', $options);

    wp_send_json_success();
}
add_action('wp_ajax_fortune_wheel_update_sectors', 'fortune_wheel_update_sectors');

