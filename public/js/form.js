const { useState } = React;

const LeadForm = () => {
    const [step, setStep] = useState('initial');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        agreed: false
    });
    const [error, setError] = useState('');

    const handleDriverLicense = (hasLicense) => {
        if (hasLicense) {
            setStep('notEligible');
        } else {
            setStep('form');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.agreed) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        if (!formData.phone.match(/^89\d{9}$/)) {
            setError('Телефон должен быть в формате 89XXXXXXXXX');
            return;
        }

        fetch(fortuneWheelAjax.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'fortune_wheel_submit_form',
                nonce: fortuneWheelAjax.nonce,
                ...formData
            })
        })
        .then(response.then(response => response.json())
        .then(data => {
            if (data.success) {
                setStep('complete');
            } else {
                setError(data.data);
            }
        })
        .catch(() => {
            setError('Произошла ошибка при отправке формы');
        });
    };

    if (step === 'initial') {
        return (
            <div className="lead-form">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    У вас уже есть водительское удостоверение?
                </h2>
                <div className="flex gap-4 justify-center">
                    <button
                        className="spin-button"
                        onClick={() => handleDriverLicense(true)}
                    >
                        Да
                    </button>
                    <button
                        className="spin-button"
                        onClick={() => handleDriverLicense(false)}
                    >
                        Нет
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'notEligible') {
        return (
            <div className="lead-form">
                <h2 className="text-xl font-bold mb-4 text-center">
                    Спасибо за проявленный интерес!
                </h2>
                <p className="text-center text-gray-600">
                    К сожалению, призы фортуны для вас не актуальны
                </p>
            </div>
        );
    }

    if (step === 'complete') {
        return (
            <div className="lead-form">
                <h2 className="text-xl font-bold mb-4 text-center text-green-600">
                    Форма успешно отправлена!
                </h2>
                <p className="text-center text-gray-600">
                    Теперь вы можете испытать удачу!
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="lead-form">
            <div className="form-group">
                <label htmlFor="name">Имя *</label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="phone">Телефон *</label>
                <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="89XXXXXXXXX"
                    pattern="89[0-9]{9}"
                    required
                />
            </div>

            <div className="checkbox-group">
                <input
                    type="checkbox"
                    id="agreed"
                    checked={formData.agreed}
                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                    required
                />
                <label htmlFor="agreed">
                    Согласен на обработку персональных данных
                </label>
            </div>

            <a href="https://tomich-auto.tomsk.ru/политика-конфиденциальности/" className="privacy-link block mb-4">
                Политика конфиденциальности
            </a>

            {error && (
                <div className="text-red-600 mb-4 text-center">
                    {error}
                </div>
            )}

            <button type="submit" className="spin-button w-full">
                Крутить колесо
            </button>
        </form>
    );
};

ReactDOM.render(<LeadForm />, document.getElementById('fortune-wheel-form'));

