jQuery(document).ready(function($) {
    let sectorCount = $('.sector-row').length;

    function updateWheelPreview() {
        const sectors = [];
        $('.sector-row').each(function() {
            sectors.push({
                name: $(this).find('input[name*="[name]"]').val(),
                color: $(this).find('input[name*="[color]"]').val()
            });
        });

        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2 - 10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        sectors.forEach((sector, index) => {
            const startAngle = (index / sectors.length) * Math.PI * 2;
            const endAngle = ((index + 1) / sectors.length) * Math.PI * 2;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = sector.color;
            ctx.fill();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((startAngle + endAngle) / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.fillText(sector.name, radius - 10, 0);
            ctx.restore();
        });

        $('#wheel-preview').html(canvas);
    }

    $('#add-sector').on('click', function() {
        const newSector = `
            <div class="sector-row">
                <input type="text" name="fortune_wheel_options[sectors][${sectorCount}][name]" placeholder="Название приза">
                <input type="number" name="fortune_wheel_options[sectors][${sectorCount}][probability]" placeholder="Вероятность" min="0" max="100">
                <input type="color" name="fortune_wheel_options[sectors][${sectorCount}][color]" value="#${Math.floor(Math.random()*16777215).toString(16)}">
                <button type="button" class="button remove-sector">Удалить</button>
            </div>
        `;
        $('#fortune-wheel-sectors').append(newSector);
        sectorCount++;
        updateWheelPreview();
    });

    $(document).on('click', '.remove-sector', function() {
        $(this).closest('.sector-row').remove();
        updateWheelPreview();
    });

    $(document).on('input', '.sector-row input', updateWheelPreview);

    updateWheelPreview();

    $('form').on('submit', function(e) {
        e.preventDefault();
        const sectors = [];
        $('.sector-row').each(function() {
            sectors.push({
                name: $(this).find('input[name*="[name]"]').val(),
                probability: $(this).find('input[name*="[probability]"]').val(),
                color: $(this).find('input[name*="[color]"]').val()
            });
        });

        $.ajax({
            url: fortuneWheelAdmin.ajaxurl,
            method: 'POST',
            data: {
                action: 'fortune_wheel_update_sectors',
                nonce: fortuneWheelAdmin.nonce,
                sectors: sectors
            },
            success: function(response) {
                if (response.success) {
                    alert('Настройки сохранены');
                } else {
                    alert('Ошибка при сохранении настроек');
                }
            }
        });
    });
});

