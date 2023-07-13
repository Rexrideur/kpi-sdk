const { useEffect, useRef } = require("react");
const { v4: uuidv4 } = require('uuid');

function helloNpm() {
    return "hello NPM";
}

function useAnalytics() {
    const userData = useRef(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const language = navigator.language;
                const userAgent = navigator.userAgent;
                const path = window.location.pathname;

                let id = localStorage.getItem('userId');
                if (!id) {
                    id = uuidv4();
                    if (typeof id === "string") {
                        localStorage.setItem('userId', id);
                    }
                }

                userData.current = {
                    language: language,
                    userAgent: userAgent,
                    id: id,
                    date: new Date(),
                    path: path
                };
                // navigator.sendBeacon('/analytics', JSON.stringify(userData.current));
            } catch (error) {
                console.error(error);
            }
        };

        getUserData();

        const handleClick = (event) => {
            if (userData.current) {
                const button = (event.target)?.innerText ?? "unknown button";
                const buttonClickData = {
                    id: userData.current.id,
                    button,
                    date: new Date(),
                };
                // navigator.sendBeacon('/analytics', JSON.stringify(buttonClickData));
            }
        };

        window.addEventListener("click", handleClick);

        const handleUnload = () => {
            if (userData.current) {
                userData.current = null;
            }
        };

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("click", handleClick);
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, []);
}

module.exports = {
    helloNpm,
    useAnalytics
};