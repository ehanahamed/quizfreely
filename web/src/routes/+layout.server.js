import themesList from "$lib/themes"

export async function load({ cookies }) {
    let theme = "auto";
    let themeCookie = cookies.get("theme");
    if (themeCookie !== undefined && themesList.includes(themeCookie)) {
        theme = cookies.theme;
    }
    return {
        theme: theme,
        themeCCSSHref: `/themes/ehui-${theme}.min.css`
    }
}
