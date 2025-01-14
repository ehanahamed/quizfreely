import themesList from "$lib/themes";

export function handle ({ event, resolve }) {
    let theme = "auto";
    let themeCookie = event.cookies.get("theme");
    if (themeCookie !== undefined && themesList.includes(themeCookie)) {
        theme = themeCookie;
    }
    console.log(theme);
    event.locals.theme = theme;
    return resolve(event, {
        transformPageChunk: function ({ html }) {
            return html.replace("%theme%", `/themes/ehui-${theme}.min.css`);
        }
    });
}
