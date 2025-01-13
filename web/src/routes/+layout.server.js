export async function load({ cookies }) {
    let theme = "auto";
    if (cookies.theme !== undefined && themes.includes(cookies.theme)) {
      theme = cookies.theme;
    }
    let themeCss = `/themes/ehui-${theme}.min.css`;
    return {
      theme: theme,
      themeCss: themeCss
    }
}