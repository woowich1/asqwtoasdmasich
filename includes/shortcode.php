<?php
if (!defined('ABSPATH')) exit;

function fortune_wheel_shortcode() {
    ob_start();
    ?>
    <div id="fortune-wheel-app"></div>
    <?php
    return ob_get_clean();
}
add_shortcode('fortune_wheel', 'fortune_wheel_shortcode');

