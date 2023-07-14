import {useEffect, useRef} from "react";

const {v4: uuidv4} = require('uuid');
import {h337} from "heatmap.js";

function helloNpm() {
    return "hello NPM";
}

function useAnalyticsPage() {
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
    }, []);
}

function useAnalyticsClick() {
    useEffect(() => {
        const handleClick = (event) => {
            const target = event.target;

            if (target.matches('button') || target.matches('a')) {
                let id = localStorage.getItem('userId');
                if (!id) {
                    id = uuidv4();
                    if (typeof id === "string") {
                        localStorage.setItem('userId', id);
                    }
                }
                const button = (event.target)?.innerText ?? "unknown button";
                const buttonClickData = {
                    id: id,
                    button,
                    date: new Date(),
                };
                navigator.sendBeacon('http://localhost:3001/api/analytics/clickButton', JSON.stringify(buttonClickData));
            }
        };

        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);
}

function useHeatMap() {
    useEffect(() => {
        let heatmapInstance = h337.create({
            container: document.querySelector('.heatmap'),
            radius: 90
        });
        // document.querySelector('.demo-wrapper').onclick = function (ev) {
        //     heatmapInstance.addData({
        //         x: ev.layerX,
        //         y: ev.layerY,
        //         value: 1
        //     });
        // };
    }, []);
}

module.exports = {
    helloNpm,
    useAnalyticsPage,
    useAnalyticsClick,
    useHeatMap,
};