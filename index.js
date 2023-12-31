const { useEffect, useRef } = require("react");
const { v4: uuidv4 } = require('uuid');
const h337 = require("heatmap.js");

function helloNpm() {
    return "hello NPM";
}

function heatMap() {
    let heatmapInstance = h337.create({
        radius: 90
    });
    document.querySelector('.demo-wrapper').onclick = function (ev) {
        heatmapInstance.addData({
            x: ev.layerX,
            y: ev.layerY,
            value: 1
        });
    };

    function sendBeaconData() {
        navigator.sendBeacon('http://localhost:3001/api/analytics/heatmap', JSON.stringify({
            data: heatmapInstance.getData(),
            path: window.location.pathname,
            date: new Date(),
        }));
    }

    window.addEventListener('beforeunload', sendBeaconData);

    return "heatmap";
}

const useAnalyticsPage = () => {

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

                const userData = {
                    language: language,
                    userAgent: userAgent,
                    id: id,
                    date: new Date(),
                    path: path
                };

                console.log("page analytics effect")


                navigator.sendBeacon('http://localhost:3001/api/analytics/page', JSON.stringify(userData));
            } catch (error) {
                console.error(error);
            }
        };

        getUserData();
    
    }, []);
    
}

function useAnalyticsClick() {

    useEffect(() => {
        console.log("okuseffect")
        const handleClick = (event) => {
            const target = event.target;

            console.log("handleClick");

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

                console.log(process.env.APP_SECRET);

                let headers = {
                    Authorization: 'Bearer ' + process.env.APP_SECRET
                };

                const blob = new Blob([JSON.stringify(buttonClickData)], headers);

                navigator.sendBeacon('http://localhost:3001/api/analytics/clickButton',
                    blob
                );
            }
        };

        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);
}

module.exports = {
    helloNpm,
    heatMap,
    useAnalyticsPage,
    useAnalyticsClick,
};