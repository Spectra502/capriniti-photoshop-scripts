var inputFolder = Folder.selectDialog("Select the folder with PSD files");
var outputFolder = Folder.selectDialog("Select the output folder for JPEGs");

var targetGroupName = "aretes_editados"; // Name of the group to rotate
var rotateAngle = 15; // Angle to rotate the target group or layer

if (inputFolder != null && outputFolder != null) {
    var files = inputFolder.getFiles("*.psd");

    for (var i = 0; i < files.length; i++) {
        var doc = open(files[i]);

        // Prepare output filename
        var fileName = doc.name.replace(/\.[^\.]+$/, ''); // remove extension
        var outFile1 = new File(outputFolder + "/" + fileName + "-01"+ ".jpg");
        var outFile2 = new File(outputFolder + "/" + fileName + "-02"+ ".jpg");

        // Save File1 (normal position) for Web options
        var opts = new ExportOptionsSaveForWeb();
        opts.format = SaveDocumentType.JPEG;
        opts.optimized = true;
        opts.quality = 100;
        opts.includeProfile = false; // false means it will convert to sRGB

        doc.exportDocument(outFile1, ExportType.SAVEFORWEB, opts);

        // Save File2 (rotated position) for Web options
        try {
            var target = doc.layerSets.getByName(targetGroupName);
        } catch (e) {
            // fall back to layer
            try {
                target = doc.artLayers.getByName(targetGroupName);
            } catch (e2) {
                alert("Group or layer '" + targetGroupName + "' not found in " + doc.name);
                continue;
            }
        }

        doc.activeLayer = target;
        target.rotate(rotateAngle, AnchorPosition.MIDDLECENTER); // Rotate the target group or layer by 15 degrees
        doc.exportDocument(outFile2, ExportType.SAVEFORWEB, opts);

        doc.close(SaveOptions.DONOTSAVECHANGES);
    }
}
