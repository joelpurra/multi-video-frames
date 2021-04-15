(function(window, $) {
    $.fn.extend({
        scrollToTop: function() {
            $("html, body").animate({
                scrollTop: Math.max(0, $(this).offset().top + 1),
            });
        },
    });

    const sharingLinkBase = "https://joelpurra.com/projects/multi-video-frames/",
        $window = $(window),
        $controls = $("#controls"),
        $addUrl = $("#addUrl"),
        $removeAllUrls = $("#removeAllUrls"),
        $videos = $("#videos"),
        $sharingLinkAnchor = $("#sharing-link-anchor"),
        $sharingLinkTextbox = $("#sharing-link-textbox");

    $(function() {
        function addUrlInput() {
            const $urlInput = $("<input />", {
                "type": "url",
                "placeholder": "https://... -- copy and paste URL here",
            })
                .data("random", getRandom())
                .appendTo($controls);

            return $urlInput;
        }

        function getRandom() {
            return Math.floor(Math.random() * 100000) + 100000;
        }

        function addVideoPanel($urlInput) {
            const $videoPanel = $("<iframe />").addClass("videoPanel")
                .data("$urlInput", $urlInput)
                .appendTo($videos);

            $urlInput.data("$videoPanel", $videoPanel).focus();
            setVideoSizes();

            $removeAllUrls.css("display", "inline-block");

            return $videoPanel;
        }

        function updateVideoPanels() {
            const $videoPanels = $videos.find(".videoPanel"),
                videoPanelCount = $videoPanels.length,

                // TODO: make horizontal/vertical video panel count a setting.
                videoPanelsHorizontalMax = 3,
                videoPanelsVerticalMax = 3,
                videoPanelsHorizontal = Math.min(Math.ceil(Math.sqrt(videoPanelCount)), videoPanelsHorizontalMax),
                videoPanelsVertical = videoPanelsHorizontal === 0 ? 0 : Math.min(Math.ceil(videoPanelCount / videoPanelsHorizontal), videoPanelsVerticalMax);

            // Clear all classes.
            $controls
                .attr("class", "")
                .addClass("urlInputs-" + videoPanelsHorizontal);

            // Clear all classes.
            $videos
                .attr("class", "")
                .addClass("videoPanelsHorizontal-" + videoPanelsHorizontal)
                .addClass("videoPanelsVertical-" + videoPanelsVertical);
        }

        function setVideoSizes() {
            updateVideoPanels();
        }

        function updateSharingLink() {
            const sharingLinkParts = $controls
                    .find("input")
                    .map(function(index, input) { const $input = $(input); return $input.val(); })
                    .get()
                    .map(function(url) { return encodeURIComponent(url); })
                    .join("&url="),
                sharingLink = sharingLinkBase + "?url=" + sharingLinkParts;

            $sharingLinkAnchor.attr("href", sharingLink);
            $sharingLinkTextbox.val(sharingLink);
        }

        $sharingLinkTextbox.on("focus", function(_event) { $sharingLinkTextbox.select(); });

        $controls.scrollToTop();

        updateVideoPanels();

        $addUrl.click(function(evt) {
            const _$target = $(evt.target),
                $urlInput = addUrlInput(),
                _$videoPanel = addVideoPanel($urlInput);
        });

        $window.on("change", function(evt) {
            const $target = $(evt.target),
                _random = $target.data("random"),
                url = $target.val(),
                $videoPanel = $target.data("$videoPanel");

            $videos.scrollToTop();

            $videoPanel.attr("src", url);

            updateSharingLink();
        });
    });

    (function() {
        function getValidOrNull(validValues, value) {
            const filteredValidValue = validValues.filter(function(validValue) { return value === validValue; });

            if (filteredValidValue.length === 1) {
                return value;
            }

            return null;
        }

        function validQuerystringKeyOrNull(key) {
            return getValidOrNull(validQuerystringKeys, key);
        }

        function isValidUrl(url) {
            const isValid = typeof url === "string"
            && url.length > 0
            && (
                // NOTE: not allowing http.
                url.startsWith("https://")
            );

            return isValid;
        }

        const validQuerystringKeys = [
                "url",
            ],
            locationSearch = document.location.search || "",
            querystring = locationSearch.substr(1).split("&")
                .filter(function(part) { return part.length > 0; })
                .map(function(part) { const parts = part.split("="); return { name: parts[0], value: parts.slice(1).join("=") }; })
                .reduce(function(obj, part) { obj[part.name] = (obj[part.name] || []).concat(part.value); return obj; }, {}),
            queryStringKeys = Object.keys(querystring),
            validQuerystring = queryStringKeys
                .every(function(key) { return !!validQuerystringKeyOrNull(key); })
            && queryStringKeys
                .every(function(key) { return Array.isArray(querystring[key]); })
            && queryStringKeys
                .every(function(key) { return querystring[key].length > 0; });

        let urls;

        if (!validQuerystring) {
            throw new Error("The querystring was not valid.");
        }

        // eslint-disable-next-line prefer-const
        urls = (
            Array.isArray(querystring.url) && querystring.url
                .map(function(url) { return decodeURIComponent(url); })
                .filter(function(url) { return isValidUrl(url); })
        ) || [];

        urls.forEach(function(url, index) {
            setTimeout(function() {
                $addUrl.click();

                setTimeout(function() {
                    const $inputs = $controls
                            .find("input"),
                        $input = $inputs.last();

                    $input
                        .val(url)
                        .change();
                },
                250 * (index + 1));
            },
            1000 * (index + 1));
        });
    }());
}(window, window.jQuery));
