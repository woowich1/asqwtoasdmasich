<?php
function wfw_fortune_wheel_shortcode($atts) {
    // Ensure scripts are enqueued
    wp_enqueue_script('wfw-frontend');
    
    ob_start();
    ?>
    <div id="wfw-fortune-wheel" class="wfw-wheel-container"></div>
    <?php
    return ob_get_clean();
}
add_shortcode('fortune_wheel', 'wfw_fortune_wheel_shortcode');

