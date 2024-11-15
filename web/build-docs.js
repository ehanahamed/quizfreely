import path from "node:path";
import { promises as fsPromises } from "node:fs";
import Showdown from "showdown"
const markdown = new Showdown.Converter({ tables: true });

let srcDir = path.resolve(import.meta.dirname, "..", "docs");
let outputDir = path.join(import.meta.dirname, "views", "docs");
let outputListFile = path.join(import.meta.dirname, "docs.json")

let srcFiles = [];
let srcSubfolders = [];
async function recursiveDir(dir) {
    let dirEnts = await fsPromises.readdir(dir, {
        withFileTypes: true
    });
    for (var i = 0; i < dirEnts.length; i++) {
        if (dirEnts[i].isDirectory()) {
            srcSubfolders.push(path.join(dir, dirEnts[i].name));
            await recursiveDir(path.join(dir, dirEnts[i].name));
        } else if (dirEnts[i].isFile()) {
            srcFiles.push(path.join(dir, dirEnts[i].name));
        }
    }
};

await recursiveDir(srcDir);
await fsPromises.rm(outputDir, {
    recursive: true,
    force: true
});
await fsPromises.mkdir(outputDir);
let outputFiles = [];
let outputSubfolders = [];
for (var i = 0; i < srcSubfolders.length; i++) {
    let relativeFolderPath = path.relative(srcDir, srcSubfolders[i]);
    let outputFolderPath = path.join(outputDir, relativeFolderPath);
    await fsPromises.mkdir(outputFolderPath);
    outputSubfolders.push(relativeFolderPath);
}
for (var i = 0; i < srcFiles.length; i++) {
    if (srcFiles[i].endsWith(".md")) {
        let relativeFilePath = path.relative(srcDir, srcFiles[i]);
        /* remove `.md` (last 3 chars) & add `.html` ext */
        let newRelativeFilePath = (relativeFilePath.substring(0, (relativeFilePath.length - 3)) + ".html");
        let outputFilePath = path.join(outputDir, newRelativeFilePath);
        let fileContent = await fsPromises.readFile(
            srcFiles[i],
            { encoding: "utf8" }
        );
        await fsPromises.writeFile(
            outputFilePath,
            markdown.makeHtml(fileContent)
        )
        outputFiles.push(newRelativeFilePath);
        console.log("✅ " + relativeFilePath);
    }
}

await fsPromises.writeFile(
    outputListFile,
    JSON.stringify({
        files: outputFiles,
        folders: outputSubfolders
    })
)
