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

        sharingLinkBase = "https://joelpurra.com/projects/multi-video-frames/",
        $window = $(window),
        $controls = $("#controls"),
        $addUrl = $("#addUrl"),
        $removeAllUrls = $("#removeAllUrls"),
        $videos = $("#videos"),
        $sharingLinkAnchor = $("#sharing-link-anchor"),
        $sharingLinkTextbox = $("#sharing-link-textbox");

    $(() => {
        const addUrlInput = () => {
                const $urlInput = $("<input />", {
                    "type": "url",
                    "placeholder": "https://... -- copy and paste URL here",
                })
                    .data("random", getRandom())
                    .appendTo($controls);

                return $urlInput;
            },

            getRandom = () => {
                return Math.floor(Math.random() * 100000) + 100000;
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

            updateVideoPanels = () => {
                const $videoPanels = $videos.find(".videoPanel"),
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
            };

        $sharingLinkTextbox.on("focus", (_evt) => { $sharingLinkTextbox.select(); });

        $controls.scrollToTop();

        updateVideoPanels();

        $addUrl.click((evt) => {
            const _$target = $(evt.target),
                $urlInput = addUrlInput(),
                _$videoPanel = addVideoPanel($urlInput);
        });

        $window.on("change", (evt) => {
            const $target = $(evt.target),
                _random = $target.data("random"),
                url = $target.val(),
                $videoPanel = $target.data("$videoPanel");

            $videos.scrollToTop();

            $videoPanel.attr("src", url);

            updateSharingLink();
        });
    });

    (() => {
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

        urls.forEach((url, index) => {
            setTimeout(
                () => {
                    log("loading", index, url);

                    $addUrl.click();

                    setTimeout(
                        () => {
                            const $inputs = $controls
                                    .find("input"),
                                $input = $inputs.last();

                            $input
                                .val(url)
                                .change();
                        },
                        250 * (index + 1),
                    );
                },
                1000 * (index + 1),
            );
        });
    })();
})(window, window.jQuery);
