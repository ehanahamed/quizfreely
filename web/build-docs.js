import * as fs from "node:fs";
import path from "node:path";
import Showdown from "showdown"
const markdown = new Showdown.Converter();

/*
    recursiveAllFiles(dir, { eachFile, eachFolderBefore })

    iterates over all files (and subfolders) in directory/folder.
    callback object needs two functions: `eachFile` and `eachFolderBefore`.
    eachFile runs for every file (even in subfolders).
    eachFolderBefore runs for each subfolder the function had to travel through,
    it's called before the eachFile is called for that subfolder's contents.
    
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
                                callbacks.eachFolderBefore(path.join(dir, filename));
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
let docsOutputDir = path.resolve(import.meta.dirname, "docs");
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
                            let relativeFilePath = path.relative(docsSourceDir, filePath);
                            let outputFilePath = path.join(docsOutputDir, relativeFilePath);
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
                    })
                }
            })
        }
    })
} catch (error) {
    console.error(error);
}
