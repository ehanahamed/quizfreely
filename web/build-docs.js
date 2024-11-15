import * as fs from "node:fs";
import path from "node:path";
import Showdown from "showdown"
const markdown = new Showdown.Converter();

/*
    recursiveAllFiles(dir, { eachFile, eachFolderBefore })

    iterates over all files (and subfolders) in directory/folder.
    callback object needs two functions: `eachFile` and `eachFolderBefore`.
    eachFile runs for every file (even in subfolders).
    eachFolderBefore (optional) runs for each subfolder the function had to travel through,
    it's ran/called before eachFile is called for that subfolder's contents.
    
    example:
    recursiveAllFiles("/path/goes/here", {
        eachFile: function (filePath) {
            console.log(filePath);
            doSomething(filePath);
        },
        eachFolderBefore: function (folderPath) {
            console.log(folderPath);
            doSomethingElse(folderPath);
        }
    })
*/
function recursiveAllFiles(dir, callbacks) {
    fs.readdir(
        dir,
        function (error, files) {
            if (error) {
                console.error(error);
            } else {
                files.forEach(function (filename) {
                    path.join()
                    fs.stat(path.join(dir, filename), function (error, fileStat) {
                        if (error) {
                            console.error(error);
                        } else {
                            if (fileStat.isDirectory()) {
                                if (callbacks.eachFolderBefore) {
                                    callbacks.eachFolderBefore(path.join(dir, filename));
                                }
                                /* this is a subfolder, do the whole thing again */
                                recursiveAllFiles(path.join(dir, filename), callbacks);
                            } else {
                                /* if this is a file, run the callback function */
                                callbacks.eachFile(path.join(dir, filename));
                            }
                        }
                    })
                })
            }
        }
    )
}

let docsSourceDir = path.resolve(import.meta.dirname, "..", "docs");
let docsOutputDir = path.join(import.meta.dirname, "views", "docs");
try {
    fs.rm(docsOutputDir, {
        recursive: true,
        force: true
    }, function (error) {
        if (error) {
            console.error(error);
        } else {
            fs.mkdir(docsOutputDir, function (error) {
                if (error) {
                    console.error(error);
                } else {
                    recursiveAllFiles(docsSourceDir, {
                        eachFolderBefore: function (folderPath) {
                            let relativeFolderPath = path.relative(docsSourceDir, folderPath);
                            let outputFolderPath = path.join(docsOutputDir, relativeFolderPath)
                            fs.mkdir(
                                outputFolderPath,
                                { recursive: true },
                                function (error) {
                                    if (error) {
                                        console.error(error);
                                    }
                                }
                            )
                        },
                        eachFile: function (filePath) {
                            if (filePath.endsWith(".md")) {
                                let relativeFilePath = path.relative(docsSourceDir, filePath);
                                /* remove .md (3 characters) with `.substring(...)` and then add ".html" to change extension */
                                let relativeFilePathNewExt = relativeFilePath.substring(0, relativeFilePath.length - 3) + ".html";
                                let outputFilePath = path.join(docsOutputDir, relativeFilePathNewExt);

                                fs.readFile(filePath, {
                                    encoding: "utf8"
                                }, function (error, data) {
                                    if (error) {
                                        console.error(error);
                                    } else {
                                        fs.writeFile(
                                            outputFilePath,
                                            markdown.makeHtml(data),
                                            function (error) {
                                                if (error) {
                                                    console.error(error);
                                                } else {
                                                    console.log("✅ " + relativeFilePath);
                                                }
                                            }
                                        )
                                    }
                                });
                            }
                        }
                    })
                }
            })
        }
    })
} catch (error) {
    console.error(error);
}
