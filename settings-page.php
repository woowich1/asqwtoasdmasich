<?php
function wfw_settings_page() {
    if (isset($_POST['wfw_save_settings'])) {
        $prizes = array_filter($_POST['prizes']);
        $probabilities = array_filter($_POST['probabilities'], 'is_numeric');
        $num_sections = intval($_POST['num_sections']);
        
        // Normalize probabilities to ensure they sum up to 100%
        $total_probability = array_sum($probabilities);
        if ($total_probability > 0) {
            $probabilities = array_map(function($prob) use ($total_probability) {
                return round(($prob / $total_probability) * 100, 2);
            }, $probabilities);
        }
        
        update_option('wfw_prizes', $prizes);
        update_option('wfw_probabilities', $probabilities);
        update_option('wfw_num_sections', $num_sections);
        update_option('wfw_texts', $_POST['texts']);
        echo '<div class="notice notice-success"><p>Settings saved successfully!</p></div>';
    }
    
    $prizes = get_option('wfw_prizes', array());
    $probabilities = get_option('wfw_probabilities', array());
    $num_sections = get_option('wfw_num_sections', 8);
    $texts = get_option('wfw_texts', array(
        'title' => 'Колесо Фортуны',
        'question' => 'У ВАС УЖЕ ЕСТЬ ВОДИТЕЛЬСКОЕ УДОСТОВЕРЕНИЕ?',
        'yesButton' => 'ДА',
        'noButton' => 'НЕТ',
        'formTitle' => 'ВЫИГРАЙТЕ БЕСПЛАТНОЕ ОБУЧЕНИЕ И МЕРЧ «ТОМИЧА»',
        'submitButton' => 'ИСПЫТАТЬ УДАЧУ',
        'winTitle' => 'ПОЗДРАВЛЯЕМ!',
        'claimButton' => 'ЗАБРАТЬ ПРИЗ',
        'notInterested' => 'НЕТ, НЕ ИНТЕРЕСНО'
    ));
    ?>
    <div class="wrap">
        <h1>Fortune Wheel Settings</h1>
        <form method="post" action="">
            <h2>Wheel Settings</h2>
            <table class="form-table">
                <tr>
                    <th>Number of Sections</th>
                    <td>
                        <input type="number" name="num_sections" value="<?php echo esc_attr($num_sections); ?>" min="4" max="12" class="small-text">
                    </td>
                </tr>
            </table>

            <h2>Prizes and Probabilities</h2>
            <table class="form-table">
                <?php for ($i = 0; $i < $num_sections; $i++): ?>
                <tr>
                    <th>Prize <?php echo $i + 1; ?></th>
                    <td>
                        <input type="text" name="prizes[]" value="<?php echo esc_attr($prizes[$i] ?? ''); ?>" class="regular-text">
                    </td>
                    <th>Probability (%)</th>
                    <td>
                        <input type="number" name="probabilities[]" value="<?php echo esc_attr($probabilities[$i] ?? ''); ?>" min="0" max="100" step="0.01" class="small-text">
                    </td>
                </tr>
                <?php endfor; ?>
            </table>

            <h2>Texts</h2>
            <table class="form-table">
                <?php foreach ($texts as $key => $value): ?>
                <tr>
                    <th><?php echo ucwords(str_replace('_', ' ', $key)); ?></th>
                    <td>
                        <input type="text" name="texts[<?php echo $key; ?>]" value="<?php echo esc_attr($value); ?>" class="regular-text">
                    </td>
                </tr>
                <?php endforeach; ?>
            </table>

            <p class="submit">
                <input type="submit" name="wfw_save_settings" class="button button-primary" value="Save Settings">
            </p>
        </form>

        <h2>Preview</h2>
        <div id="wfw-admin-preview" class="wfw-admin-container">
            <div class="wfw-wheel-container"></div>
        </div>
    </div>
    <?php
}

