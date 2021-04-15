((window, $) => {
    $.fn.extend({
        scrollToTop: function() {
            // NOTE: cannot be an arrow function since the this context is dynamically bound.
            $("html, body").animate({
                scrollTop: Math.max(
                    0,
                    $(this).offset().top + 1,
                ),
            });
        },
    });

    const
        log = (...args) => {
            // eslint-disable-next-line no-console
            console.log("multi-video-frames", ...args);
        },

        updateSharingLink = () => {
            const sharingLinkParts = $controls
                    .find("input")
                    .map((index, input) => {
                        const $input = $(input);

                        return $input.val();
                    })
                    .get()
                    .map((url) => encodeURIComponent(url))
                    .join("&url="),
                sharingLink = sharingLinkBase + "?url=" + sharingLinkParts;

            $sharingLinkAnchor.attr("href", sharingLink);
            $sharingLinkTextbox.val(sharingLink);
        },

        getVideoPanels = () => $videos.find(".videoPanel"),

        updateVideoPanels = () => {
            const $videoPanels = getVideoPanels(),
                videoPanelCount = $videoPanels.length,

                // TODO: make horizontal/vertical video panel count a setting.
                videoPanelsHorizontalMax = 3,
                videoPanelsVerticalMax = 3,
                videoPanelsHorizontal = Math.min(
                    Math.ceil(Math.sqrt(videoPanelCount)),
                    videoPanelsHorizontalMax,
                ),
                videoPanelsVertical = videoPanelsHorizontal === 0
                    ? 0
                    : Math.min(
                        Math.ceil(videoPanelCount / videoPanelsHorizontal),
                        videoPanelsVerticalMax,
                    );

            // Clear all classes.
            $controls
                .attr("class", "")
                .addClass("urlInputs-" + videoPanelsHorizontal);

            // Clear all classes.
            $videos
                .attr("class", "")
                .addClass("videoPanelsHorizontal-" + videoPanelsHorizontal)
                .addClass("videoPanelsVertical-" + videoPanelsVertical);
        },

        setVideoSizes = () => {
            updateVideoPanels();
        },

        addUrlInput = (url) => {
            const $urlInput = $("<input />", {
                "type": "url",
                "placeholder": "https://... -- copy and paste URL here",
                "value": url,
            })
                .appendTo($controls);

            return $urlInput;
        },

        addVideoPanel = ($urlInput) => {
            const $videoPanel = $("<iframe />")
                .addClass("videoPanel")
                .data("$urlInput", $urlInput)
                .appendTo($videos);

            $urlInput
                .data("$videoPanel", $videoPanel)
                .focus();

            setVideoSizes();

            $removeAllUrls.css("display", "inline-block");

            return $videoPanel;
        },

        updateVideoUrl = ($urlInput) => {
            const url = $urlInput.val(),
                $videoPanel = $urlInput.data("$videoPanel");

            $videoPanel.attr("src", url);

            updateSharingLink();
        },

        addUrlElementSet = (url) => {
            const $urlInput = addUrlInput(url),
                _$videoPanel = addVideoPanel($urlInput);

            updateVideoUrl($urlInput);
        },

        sharingLinkBase = "https://joelpurra.com/projects/multi-video-frames/",
        $window = $(window),
        $controls = $("#controls"),
        $addUrl = $("#addUrl"),
        $removeAllUrls = $("#removeAllUrls"),
        $videos = $("#videos"),
        $sharingLinkAnchor = $("#sharing-link-anchor"),
        $sharingLinkTextbox = $("#sharing-link-textbox");

    $(() => {
        $sharingLinkTextbox.on("focus", (_evt) => { $sharingLinkTextbox.select(); });

        $controls
            .delay(10)
            .scrollToTop();

        updateVideoPanels();

        $addUrl.click((evt) => {
            const _$target = $(evt.target),
                _$urlSet = addUrlElementSet();
        });

        $window.on("change", (evt) => {
            const $target = $(evt.target);

            updateVideoUrl($target);

            $videos
                .delay(10)
                .scrollToTop();
        });
    });

    $(() => {
        const getValidOrNull = (validValues, value) => {
                const filteredValidValue = validValues.filter((validValue) => value === validValue);

                if (filteredValidValue.length === 1) {
                    return value;
                }

                return null;
            },

            validQuerystringKeyOrNull = (key) => {
                return getValidOrNull(validQuerystringKeys, key);
            },

            isValidUrl = (url) => {
                const isValid = typeof url === "string"
                && url.length > 0
                && (
                    // NOTE: not allowing http.
                    url.startsWith("https://")
                );

                return isValid;
            },

            addUrls = (remainingUrls) => {
                const url = remainingUrls[0];

                if (!url) {
                    return;
                }

                log("loading", getVideoPanels().length, url);

                addUrlElementSet(url);

                setTimeout(
                    () => addUrls(remainingUrls.slice(1)),
                    250,
                );
            },

            validQuerystringKeys = [
                "url",
            ],
            locationSearch = document.location.search || "",
            querystring = locationSearch
                .substr(1)
                .split("&")
                .filter((part) => part.length > 0)
                .map((part) => {
                    const parts = part
                        .split("=");
                    return {
                        name: parts[0],
                        value: parts
                            .slice(1)
                            .join("="),
                    };
                })
                .reduce(
                    (obj, part) => {
                        obj[part.name] = (obj[part.name] || []).concat(part.value);

                        return obj;
                    },
                    {},
                ),
            queryStringKeys = Object.keys(querystring),
            validQuerystring = queryStringKeys
                .every((key) => !!validQuerystringKeyOrNull(key))
                && queryStringKeys
                    .every((key) => Array.isArray(querystring[key]))
                && queryStringKeys
                    .every((key) => querystring[key].length > 0);

        let urls;

        if (!validQuerystring) {
            throw new Error("The querystring was not valid.");
        }

        // eslint-disable-next-line prefer-const
        urls = (
            Array.isArray(querystring.url) && querystring.url
                .map((url) => decodeURIComponent(url))
                .filter((url) => isValidUrl(url))
        ) || [];

        log("urls found in querystring", urls);

        addUrls(urls);
    });
})(window, window.jQuery);
