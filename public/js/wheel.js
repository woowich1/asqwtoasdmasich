const { useState, useEffect, useCallback } = React;

const FortuneWheel = () => {
    const [sectors, setSectors] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        // Загрузка секторов из настроек WordPress
        fetch('/wp-json/fortune-wheel/v1/sectors')
            .then(response => response.json())
            .then(data => setSectors(data));
    }, []);

    const createConfetti = useCallback(() => {
        return Array.from({ length: 50 }).map(() => ({
            left: Math.random() * 100,
            animationDuration: 3 + Math.random() * 2,
            color: `hsl(${Math.random() * 360}, 50%, 50%)`,
            animationDelay: Math.random() * 3
        }));
    }, []);

    const spinWheel = () => {
        if (spinning) return;

        setSpinning(true);
        const extraSpins = 5;
        const baseRotation = 360 * extraSpins;
        const randomSector = Math.floor(Math.random() * sectors.length);
        const sectorRotation = (360 / sectors.length) * randomSector;
        const totalRotation = baseRotation + sectorRotation;

        setRotation(totalRotation);

        setTimeout(() => {
            setSpinning(false);
            setWinner(sectors[randomSector]);
            setShowConfetti(true);
        }, 5000);
    };

    return (
        <div className="fortune-wheel-container">
            <div className="wheel-wrapper">
                <div 
                    className="fortune-wheel" 
                    style={{ 
                        transform: `rotate(${rotation}deg)`,
                    }}
                >
                    {sectors.map((sector, index) => {
                        const rotation = (index * 360) / sectors.length;
                        return (
                            <div
                                key={index}
                                className="sector"
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    backgroundColor: sector.color,
                                }}
                            >
                                <span 
                                    className="sector-text"
                                    style={{
                                        transform: `rotate(${90 + (360 / sectors.length) / 2}deg)`,
                                    }}
                                >
                                    {sector.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="wheel-center" />
            </div>
            
            <button 
                className="spin-button"
                onClick={spinWheel}
                disabled={spinning}
            >
                {spinning ? 'Крутится...' : 'Крутить колесо'}
            </button>

            {showConfetti && createConfetti().map((confetti, index) => (
                <div
                    key={index}
                    className="confetti"
                    style={{
                        left: `${confetti.left}%`,
                        animationDuration: `${confetti.animationDuration}s`,
                        backgroundColor: confetti.color,
                        animationDelay: `${confetti.animationDelay}s`
                    }}
                />
            ))}

            {winner && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className="text-2xl font-bold mb-4">Поздравляем!</h2>
                        <p className="text-xl mb-6">Вы выиграли: {winner.name}</p>
                        <div className="flex gap-4 justify-center">
                            <button 
                                className="spin-button"
                                onClick={() => window.location.href = 'https://tomich-auto.tomsk.ru/forma/'}
                            >
                                Оставить заявку
                            </button>
                            <button 
                                className="spin-button"
                                onClick={() => {
                                    setWinner(null);
                                    setShowConfetti(false);
                                }}
                                style={{ background: '#6B7280' }}
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

ReactDOM.render(<FortuneWheel />, document.getElementById('fortune-wheel-app'));

