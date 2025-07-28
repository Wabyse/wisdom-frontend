import { useEffect, useState } from 'react';

export default function useFullScreen() {
    const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement);

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    return isFullScreen;
}