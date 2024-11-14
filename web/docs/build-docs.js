import * as fs from "node:fs";
import path from "node:path";
import Showdown from "showdown"
const markdown = new Showdown.Converter();

/*
    iterates over all files (and subfolders) in dir
    callback function is called for each file,
    and the callback's parameter is each file's full path.
    usage example:
    recursiveAllFiles("/path/goes/here", function (eachFilepath) {
        console.log(eachFilePath);
        doSomething(eachFilepath);
    })
*/
function recursiveAllFiles(dir, callback) {
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
                                /* if this is a subfolder, do the whole thing again */
                                recursiveAllFiles(path.join(dir, filename), callback);
                            } else {
                                /* if this is a file, run the callback function */
                                callback(path.join(dir, filename));
                            }
                        }
                    })
                })
            }
        }
    )
}

let docsSourceDir = path.resolve(import.meta.dirname, "..", "..", "docs");
let docsBuiltDir = path.resolve(import.meta.dirname, "docs", "content");
try {
    recursiveAllFiles(docsSourceDir, function (filePath) {
        fs.readFile(filePath, {
            encoding: "utf8"
        }, function (error, data) {
            if (error) {
                console.error(error);
            } else {
                let relativeFilePath = path.relative(docsSourceDir, filePath);
                fs.writeFile(
                    path.join(docsBuiltDir, relativeFilePath),
                    markdown.convert(data),
                    function (error) {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log("Successfully built: " + relativeFilePath);
                        }
                    }
                )
            }
        });
    })
} catch (error) {
    console.error(error);
}
